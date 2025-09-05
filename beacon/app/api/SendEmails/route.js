import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

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
            region: process.env.AWS_SES_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        };

        console.log('AWS Configuration:', {
            region: awsConfig.region,
            hasAccessKeyId: !!awsConfig.credentials.accessKeyId,
            hasSecretAccessKey: !!awsConfig.credentials.secretAccessKey
        });

        if (!awsConfig.credentials.accessKeyId || !awsConfig.credentials.secretAccessKey) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'AWS credentials not configured properly',
                    details: 'Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in environment variables'
                },
                { status: 500 }
            );
        }

        const sesClient = new SESClient(awsConfig);

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

        // Send emails using Amazon SES
        const results = [];
        let processedCount = 0;

        for (const row of data) {
            try {
                processedCount++;
                console.log(`Processing email ${processedCount}/${data.length} for ${row.Email}`);

                // Skip rows with missing email or name
                if (!row.Email || !row.Name) {
                    results.push({
                        email: row.Email || 'Unknown',
                        name: row.Name || 'Unknown',
                        status: 'skipped',
                        message: 'Missing email or name'
                    });
                    continue;
                }

                // Replace placeholders in template
                let personalizedTemplate = template;

                // Replace {{Recipient_name}} with the actual name
                personalizedTemplate = personalizedTemplate.replace(/{{Recipient_name}}/g, row.Name);

                // Replace any other placeholders that might exist
                Object.keys(row).forEach(key => {
                    const placeholder = new RegExp(`{{${key}}}`, 'g');
                    personalizedTemplate = personalizedTemplate.replace(placeholder, row[key]);
                });

                const isPlainTextOnly = false; // We always send as HTML now since rich text editor produces HTML

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

                // Send email
                const command = new SendEmailCommand(emailParams);
                const response = await sesClient.send(command);

                results.push({
                    email: row.Email,
                    name: row.Name,
                    status: 'success',
                    message: 'Email sent successfully',
                    messageId: response.MessageId
                });

                // Add a small delay between emails to avoid rate limiting
                if (processedCount < data.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            } catch (error) {
                console.error(`Error sending email to ${row.Email}:`, error);

                // Provide specific error messages
                let errorMessage = error.message || 'Unknown error occurred';
                if (error.message.includes('Email address is not verified')) {
                    errorMessage = 'Email address not verified in AWS SES';
                } else if (error.message.includes('AccessDenied')) {
                    errorMessage = 'AWS SES permission denied - check IAM permissions';
                } else if (error.message.includes('InvalidParameterValue')) {
                    errorMessage = 'Invalid email format or parameters';
                }

                results.push({
                    email: row.Email,
                    name: row.Name,
                    status: 'error',
                    message: errorMessage
                });
            }
        }

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

        // No temp files to clean up

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