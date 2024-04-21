import nodemailer from 'nodemailer';
import { parse as parseCSV } from 'csv-parse/sync';
import Papa from 'papaparse';

export async function POST(request) {
    try {
        // Parse the form data (HTML file and CSV file) from the request
        const formData = await request.formData();

        // Get the HTML file from the form data
        const htmlFile = formData.get('html_template');
        const htmlContent = await htmlFile.text(); // Read the HTML content

        // Get the CSV file from the form data
        const csvFile = formData.get('csv_excel');
        const csvContent = await csvFile.text(); // Read the CSV content

        const senderEmail = formData.get('sender_email');

        const subject = formData.get('subject');

        const email_field = formData.get('email_field');
        const recipient_field = formData.get('recipient_field');

        let SERVER_URL, SERVER_PORT, SERVER_USER, SERVER_PASS;

        if (formData.get('simple') !== 'true') {
            SERVER_URL = formData.get('SERVER_URL');
            SERVER_PORT = formData.get('SERVER_PORT');
            SERVER_USER = formData.get('SERVER_USER');
            SERVER_PASS = formData.get('SERVER_PASS');
        }

        // Parse the CSV content to get the list of recipients
        const recipients = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true
        }).data; // Correctly retrieve the data array directly

        // Function to remove rows where 'Email Address' is empty
        function removeRowsWithEmptyEmail(data) {
            return data.filter(entry => entry['Email Address'] && entry['Email Address'].trim() !== "");
        }

        // Removing rows with empty 'Email Address'
        const filteredData = removeRowsWithEmptyEmail(recipients); // Correct the reference here

        console.log(filteredData);

        // Retrieve SMTP configuration from the environment variables
        const smtpServer = formData.get('simple') !== 'true' ? SERVER_URL : process.env.NEXT_PRIVATE_SMTP_SERVER_APPLE;
        const smtpPort = formData.get('simple') !== 'true' ? SERVER_PORT : process.env.NEXT_PRIVATE_SMTP_PORT_APPLE;
        const email = formData.get('simple') !== 'true' ? SERVER_USER : process.env.NEXT_PRIVATE_EMAIL_APPLE;
        const password = formData.get('simple') !== 'true' ? SERVER_PASS : process.env.NEXT_PRIVATE_PASSWORD_APPLE;


        // Create a transporter using your email provider's SMTP settings
        const transporter = nodemailer.createTransport({
            host: smtpServer,
            port: parseInt(smtpPort), // Convert port to number
            // secure: smtpPort === '465', // true for port 465 (SSL), false otherwise
            secure: false,
            auth: {
                user: email,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Sending emails individually
        for (const recipient of filteredData) {
            // Replace the placeholder with the recipient's name
            const personalizedHtml = htmlContent.replace("[Recipient's Name]", recipient[recipient_field]);

            const mailOptions = {
                from: senderEmail,
                to: recipient[email_field],
                subject: subject,
                html: personalizedHtml,
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent to:", recipient[email_field]);  // Debug: Log recipient email
        }


        // Return a success response
        return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error sending email:', error);

        // Return an error response
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}