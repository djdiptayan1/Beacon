import nodemailer from 'nodemailer';
import { parse as parseCSV } from 'csv-parse/sync';

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

        let SERVER_URL, SERVER_PORT, SERVER_USER, SERVER_PASS;

        if (formData.get('simple') !== 'true') {
            SERVER_URL = formData.get('SERVER_URL');
            SERVER_PORT = formData.get('SERVER_PORT');
            SERVER_USER = formData.get('SERVER_USER');
            SERVER_PASS = formData.get('SERVER_PASS');
        }

        // Parse the CSV content to get the list of recipients
        const recipients = parseCSV(csvContent, {
            columns: true, // Treat the first row as column names
            skip_empty_lines: true,
        });

        // Retrieve SMTP configuration from the environment variables
        const smtpServer = formData.get('simple') !== 'true' ? SERVER_URL : process.env.NEXT_PRIVATE_SMTP_SERVER;
        const smtpPort = formData.get('simple') !== 'true' ? SERVER_PORT : process.env.NEXT_PRIVATE_SMTP_PORT;
        const email = formData.get('simple') !== 'true' ? SERVER_USER : process.env.NEXT_PRIVATE_EMAIL;
        const password = formData.get('simple') !== 'true' ? SERVER_PASS : process.env.NEXT_PRIVATE_PASSWORD;


        // Create a transporter using your email provider's SMTP settings
        const transporter = nodemailer.createTransport({
            host: smtpServer,
            port: parseInt(smtpPort), // Convert port to number
            secure: smtpPort === '465', // true for port 465 (SSL), false otherwise
            auth: {
                user: email,
                pass: password,
            },
        });

        // Create the email options
        const mailOptions = {
            from: senderEmail, // Sender address
            to: recipients.map((recipient) => recipient.Email).join(','),
            subject,
            html: htmlContent,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

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