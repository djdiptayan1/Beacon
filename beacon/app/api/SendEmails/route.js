import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand, GetSendQuotaCommand } from '@aws-sdk/client-ses';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

// Configuration for performance tuning
const DEFAULT_MAX_SEND_RATE = 12;
const CONCURRENCY_LIMIT = 10;
const MAX_SEND_RATE = DEFAULT_MAX_SEND_RATE;

export async function POST(request) {
    // No tempDir needed; use in-memory buffers
    try {
        const formData = await request.formData();
        const csvFile = formData.get('csv_excel');
        const htmlTemplate = formData.get('html_template');
        const senderEmail = formData.get('sender_email');
        const subject = formData.get('subject');
        const templateType = formData.get('template_type') || 'upload'; // Default to upload for backward compatibility

        // Validate required fields
        if (!csvFile || !htmlTemplate || !senderEmail || !subject) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields',
                    missing: {
                        csvFile: !csvFile,
                        htmlTemplate: !htmlTemplate,
                        senderEmail: !senderEmail,
                        subject: !subject
                    }
                },
                { status: 400 }
            );
        }

        console.log('Processing email request with:', {
            csvFileSize: csvFile.size,
            htmlTemplateSize: htmlTemplate.size,
            senderEmail,
            subject,
            templateType
        });

        // Configure AWS SES Client
        const awsConfig = {
            region: process.env.GITHUB_AWS_SES_REGION,
            credentials: {
                accessKeyId: process.env.GITHUB_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.GITHUB_AWS_SECRET_ACCESS_KEY,
            },
        };

        if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'AWS credentials not configured properly',
                    details: 'Missing GITHUB_AWS_ACCESS_KEY_ID or GITHUB_AWS_SECRET_ACCESS_KEY in environment variables'
                },
                { status: 500 }
            );
        }

        const sesClient = new SESClient(awsConfig);

        // Fetch dynamic quota but respect the hard-coded MAX_SEND_RATE as a safety ceiling
        let sessionSendRate = MAX_SEND_RATE;
        try {
            const quotaResponse = await sesClient.send(new GetSendQuotaCommand({}));
            sessionSendRate = Math.min(quotaResponse.MaxSendRate || MAX_SEND_RATE, MAX_SEND_RATE);
            console.log(`SES Session Rate: ${sessionSendRate} emails/sec (Concurrency: ${CONCURRENCY_LIMIT})`);
        } catch (quotaError) {
            console.warn('Quota check unauthorized, using configured MAX_SEND_RATE ceiling:', MAX_SEND_RATE);
        }

        // Use in-memory buffers for file processing
        const csvBuffer = Buffer.from(await csvFile.arrayBuffer());
        const templateBuffer = Buffer.from(await htmlTemplate.arrayBuffer());

        // Read Excel file from buffer
        const workbook = XLSX.read(csvBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Read template from buffer
        let template = templateBuffer.toString('utf-8');

        // Validate Excel data structure
        if (data.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Excel file is empty or invalid' },
                { status: 400 }
            );
        }

        // Check if required columns exist
        const firstRow = data[0];
        const availableColumns = Object.keys(firstRow);
        console.log('Available columns in Excel:', availableColumns);

        if (!firstRow.Name || !firstRow.Email) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Excel file must contain "Name" and "Email" columns',
                    availableColumns: availableColumns,
                    hasName: !!firstRow.Name,
                    hasEmail: !!firstRow.Email
                },
                { status: 400 }
            );
        }

        console.log(`Processing ${data.length} records from Excel file`);

        // Send emails using Amazon SES in parallel
        const results = [];
        const queue = [...data];

        // Adaptive Delay Logic: To maintain X calls/sec, we need (1000ms / rate) gap between starts per worker
        // But since we have multiple workers, we calculate delay based on the total rate
        const delayMs = (1000 / sessionSendRate) * CONCURRENCY_LIMIT;

        const processQueue = async () => {
            while (queue.length > 0) {
                const row = queue.shift();
                if (!row || !row.Email) continue;

                const startTime = Date.now();
                try {
                    // Replace placeholders in template
                    let personalizedTemplate = template;
                    personalizedTemplate = personalizedTemplate.replace(/{{Recipient_name}}/g, row.Name);

                    // Replace any other placeholders that might exist
                    Object.keys(row).forEach(key => {
                        const placeholder = new RegExp(`{{${key}}}`, 'g');
                        personalizedTemplate = personalizedTemplate.replace(placeholder, row[key]);
                    });

                    // Create SES email parameters
                    const emailParams = {
                        Source: senderEmail,
                        Destination: {
                            ToAddresses: [row.Email],
                        },
                        Message: {
                            Subject: {
                                Data: subject,
                                Charset: 'UTF-8',
                            },
                            Body: {
                                Html: {
                                    Data: personalizedTemplate,
                                    Charset: 'UTF-8',
                                },
                            },
                        },
                    };

                    const command = new SendEmailCommand(emailParams);
                    const response = await sesClient.send(command);

                    results.push({
                        email: row.Email,
                        name: row.Name,
                        status: 'success',
                        message: 'Email sent successfully',
                        messageId: response.MessageId
                    });

                } catch (error) {
                    console.error(`Error sending email to ${row.Email}:`, error);
                    let errorMessage = error.message || 'Unknown error occurred';

                    if (error.name === 'MessageRejected' || error.message.includes('Email address is not verified')) {
                        errorMessage = `SES Sandbox: Identity not verified. Ensure both sender and recipient (${row.Email}) are verified in AWS SES console.`;
                    } else if (error.message.includes('AccessDenied')) {
                        errorMessage = 'AWS SES permission denied - check IAM permissions for ses:SendEmail';
                    } else if (error.message.includes('InvalidParameterValue')) {
                        errorMessage = 'Invalid email format or parameters';
                    }

                    results.push({
                        email: row.Email,
                        name: row.Name,
                        status: 'error',
                        message: errorMessage
                    });
                } finally {
                    // Throttle execution to respect MaxSendRate
                    const elapsed = Date.now() - startTime;
                    if (elapsed < delayMs) {
                        await new Promise(resolve => setTimeout(resolve, delayMs - elapsed));
                    }
                }
            }
        };

        // Start multiple processors in parallel
        const processors = Array.from({ length: CONCURRENCY_LIMIT }, () => processQueue());
        await Promise.all(processors);

        // Calculate summary
        const successCount = results.filter(r => r.status === 'success').length;
        const errorCount = results.filter(r => r.status === 'error').length;
        const skippedCount = results.filter(r => r.status === 'skipped').length;

        console.log('Email sending completed:', {
            total: data.length,
            successful: successCount,
            failed: errorCount,
            skipped: skippedCount
        });

        // Determine if the operation was successful overall
        const isSuccess = successCount > 0 || (errorCount === 0 && skippedCount > 0);
        const statusCode = isSuccess ? 200 : 400;

        // Create appropriate message
        let message = 'Email sending process completed';
        if (successCount === 0 && errorCount > 0) {
            message = 'All emails failed to send. Please check AWS SES configuration and verify email addresses.';
        } else if (successCount === 0 && skippedCount > 0) {
            message = 'No emails were sent. All recipients were skipped.';
        } else if (errorCount > 0) {
            message = `Partial success: ${successCount} sent, ${errorCount} failed, ${skippedCount} skipped.`;
        } else {
            message = `Successfully sent ${successCount} emails.`;
        }

        return NextResponse.json({
            success: isSuccess,
            message: message,
            summary: {
                total: data.length,
                successful: successCount,
                failed: errorCount,
                skipped: skippedCount
            },
            results: results,
            awsNote: errorCount > 0 && results.some(r => r.message && r.message.includes('not verified'))
                ? 'AWS SES is in sandbox mode. Only verified email addresses can receive emails. Please verify recipient emails in AWS SES Console or request production access.'
                : null
        }, { status: statusCode });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error processing request',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}