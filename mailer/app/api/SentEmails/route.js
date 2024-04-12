import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();
        const { to, subject, htmlContent } = body;

        // Retrieve SMTP configuration from the environment variables
        const smtpServer = process.env.NEXT_PRIVATE_SMTP_SERVER;
        const smtpPort = process.env.NEXT_PRIVATE_SMTP_PORT;
        const email = process.env.NEXT_PRIVATE_EMAIL;
        const password = process.env.NEXT_PRIVATE_PASSWORD;

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
            from: "dj2037@srmist.edu.in", // Sender address
            to,
            subject,
            html: htmlContent, // HTML content (received from the request body)
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