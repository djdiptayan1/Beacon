# 📧 Beacon

> A mass email sender with AWS SES integration and HTML template support

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)
[![AWS SES](https://img.shields.io/badge/AWS-SES-orange)](https://aws.amazon.com/ses/)

Beacon is a Next.js web application for sending mass emails using AWS SES. Upload Excel/CSV files with recipient data and HTML templates to send personalized emails.

## ✨ Features

- 📊 **Excel/CSV File Upload** - Import recipient data from .xlsx and .csv files
- � **HTML Template Upload** - Upload custom HTML email templates  
- 🎯 **Variable Replacement** - Replace `{{placeholders}}` in templates with data from spreadsheet columns
- ☁️ **AWS SES Integration** - Send emails using Amazon Simple Email Service
- 📝 **Rich Text Editor** - React Quill editor for creating email content
- 🖼️ **Image Upload** - Upload images to use in email templates
- 🔄 **API Endpoints** - REST API for programmatic email sending
- � **Email Status Tracking** - Success/failure tracking for each email sent

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- AWS Account with SES configured
- Domain verified in AWS SES (for production)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/djdiptayan1/Beacon.git
   cd Beacon/beacon
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and configure it:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your AWS credentials:

   ```env
   # AWS SES Configuration (Required)
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_SES_REGION=us-east-1
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Usage

### Web Interface

1. **Prepare Your Data**
   - Create an Excel (.xlsx) or CSV file with recipient information
   - First row should contain column headers

2. **Choose a Template**
   - Select from pre-built templates:
     - Welcome
     - Newsletter  
     - Product Launch
     - Event Invitation
     - Promotional

3. **Customize Your Campaign**
   - Use the built-in React Quill editor to modify templates
   - Preview your email before sending

4. **Send Your Campaign**
   - Upload your Excel/CSV file
   - Set sender email and subject line
   - Monitor real-time progress and results

### API Integration

You can also send emails programmatically using the REST API endpoint.

#### Send Emails API

**Endpoint:** `POST /api/SendEmails`

**Content-Type:** `multipart/form-data`

**Required Fields:**
- `csv_excel` (File) - Excel/CSV file with recipient data
- `html_template` (File) - HTML template file
- `sender_email` (String) - Verified sender email address
- `subject` (String) - Email subject line

**Optional Fields:**
- `template_type` (String) - Template type identifier (default: "upload")

**Example using cURL:**

```bash
curl -X POST http://localhost:3000/api/SendEmails \
  -F "csv_excel=@recipients.xlsx" \
  -F "html_template=@template.html" \
  -F "sender_email=your-verified-email@domain.com" \
  -F "subject=Your Campaign Subject" \
  -F "template_type=custom"
```

**Example using JavaScript/Node.js:**

```javascript
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('csv_excel', fs.createReadStream('recipients.xlsx'));
form.append('html_template', fs.createReadStream('template.html'));
form.append('sender_email', 'your-verified-email@domain.com');
form.append('subject', 'Your Campaign Subject');
form.append('template_type', 'custom');

fetch('http://localhost:3000/api/SendEmails', {
  method: 'POST',
  body: form
})
.then(response => response.json())
.then(data => console.log(data));
```

**Example using Python:**

```python
import requests

url = 'http://localhost:3000/api/SendEmails'
files = {
    'csv_excel': open('recipients.xlsx', 'rb'),
    'html_template': open('template.html', 'rb')
}
data = {
    'sender_email': 'your-verified-email@domain.com',
    'subject': 'Your Campaign Subject',
    'template_type': 'custom'
}

response = requests.post(url, files=files, data=data)
print(response.json())
```

**Response Format:**

```json
{
  "success": true,
  "message": "Successfully sent 15 emails.",
  "summary": {
    "total": 15,
    "successful": 15,
    "failed": 0,
    "skipped": 0
  },
  "results": [
    {
      "email": "user@example.com",
      "name": "John Doe",
      "status": "success",
      "message": "Email sent successfully",
      "messageId": "0100018c-..."
    }
  ],
  "awsNote": null
}
```

#### Image Upload API

**Endpoint:** `POST /api/upload-image`

**Content-Type:** `multipart/form-data`

**Fields:**
- `file` (File) - Image file to upload

**Example:**

```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "file=@image.jpg"
```

**Response:**

```json
{
  "location": "/uploads/unique-filename.jpg"
}
```

### Excel/CSV Data Format

Your data file must include these required columns:

| Column | Description | Required |
|--------|-------------|----------|
| `Name` | Recipient's full name | ✅ Yes |
| `Email` | Recipient's email address | ✅ Yes |

**Example CSV:**

```csv
Name,Email,Company,Position
John Doe,john@example.com,Acme Corp,Developer
Jane Smith,jane@example.com,Tech Inc,Manager
```

### Template Placeholders

Use these placeholders in your HTML templates for personalization:

- `{{Receipient_name}}` - Recipient's name (note the specific spelling)
- `{{Name}}` - Recipient's name
- `{{Email}}` - Recipient's email
- `{{any_column_name}}` - Any column from your CSV/Excel file

**Example Template:**

```html
<h1>Hello {{Receipient_name}}!</h1>
<p>Welcome to our platform.</p>
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful SVG icons
- **React Quill** - Rich text WYSIWYG editor

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **AWS SDK v3** - AWS SES integration (`@aws-sdk/client-ses`)
- **XLSX** - Excel file processing
- **Papa Parse** - CSV parsing
- **UUID** - Unique identifier generation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Class Variance Authority** - Component variants
- **clsx & tailwind-merge** - Conditional styling

## 🗂️ Project Structure

```
beacon/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── SendEmails/          # Email sending endpoint
│   │   │   └── route.js         # POST /api/SendEmails
│   │   ├── upload-image/        # Image upload endpoint
│   │   │   └── route.js         # POST /api/upload-image
│   ├── tutorials/               # Tutorials page
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   ├── page.js                  # Homepage
│   └── quill-custom.css         # Rich editor styles
├── components/                  # React components
│   ├── EmailForm/              # Main email form component
│   ├── TemplateEditor/         # Template editor interface
│   ├── TemplateSelector/       # Template selection UI
│   ├── Hero/                   # Landing page hero
│   ├── Features/               # Features section
│   ├── CTA/                    # Call-to-action section
│   ├── modules/                # Popup components
│   │   ├── Success_Popup.jsx
│   │   └── Error_Popup.jsx
│   └── ui/                     # Reusable UI components
├── public/                    # Static assets
│   ├── uploads/              # User uploaded images
│   ├── sample-data.xlsx      # Sample data file
│   └── sample-template.html   # Sample template
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
└── tailwind.config.js        # TailwindCSS configuration
```

## 🔧 Configuration

### AWS SES Setup

1. **Create AWS Account** and navigate to [SES Console](https://console.aws.amazon.com/sesv2/)

2. **Verify your email address** or domain:
   - Go to "Verified identities"
   - Add your sender email address
   - Check your email and click the verification link

3. **Create IAM user** with SES permissions:

   Create a policy with these permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail",
           "ses:GetSendQuota",
           "ses:GetSendStatistics"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

4. **Generate Access Keys** for the IAM user

5. **Add credentials** to your `.env.local` file

6. **Request Production Access** (if needed):
   - By default, SES is in sandbox mode
   - Only verified emails can receive messages
   - Request production access to send to any email

### Environment Variables

Required environment variables:

```env
# AWS SES Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_SES_REGION=us-east-1  # or your preferred region
```

Available AWS SES regions:
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Select the `beacon` folder as root directory

2. **Configure Environment Variables**
   - Add your AWS credentials in Vercel dashboard
   - Go to Project Settings → Environment Variables

3. **Deploy**
   - Vercel will automatically deploy your app

### Self-Hosting

```bash
npm run build
npm start
```

The app will run on port 3000 by default.

## 🔒 Security Considerations

- **Environment Variables**: Never commit AWS credentials to version control
- **Input Validation**: All uploads are validated for file type and size
- **Rate Limiting**: Built-in delays between emails to prevent rate limiting
- **File Cleanup**: Temporary files are automatically cleaned up after processing

## 🐛 Troubleshooting

### Common Issues

**"Email address not verified in AWS SES"**
- Verify your sender email in AWS SES Console
- Check spam folder for verification email

**"AWS SES permission denied"**
- Verify IAM user has correct SES permissions
- Check AWS credentials in environment variables

**"Excel file must contain Name and Email columns"**
- Ensure your CSV/Excel has exact column names: `Name` and `Email`
- Check for extra spaces or special characters in headers

### Getting Help

- Create an issue on GitHub
- Check AWS SES documentation
- Review console logs for detailed error messages

## 📊 Monitoring & Analytics

The application provides detailed analytics for each email campaign:

### Success Metrics
- Total emails processed
- Successfully sent emails
- Failed emails with error reasons
- Skipped emails (invalid data)

### Error Handling
- AWS SES sandbox mode detection
- Email verification status
- Rate limiting protection
- Detailed error messages for troubleshooting

### Logging
- Console logging for development
- Request/response tracking
- Error stack traces (development mode)

## 🔒 Security Considerations

- **Environment Variables**: Never commit AWS credentials to version control
- **Input Validation**: All uploads are validated for file type and size
- **Rate Limiting**: Built-in delays between emails to prevent rate limiting
- **Error Handling**: Sensitive information is not exposed in production errors
- **File Cleanup**: Temporary files are automatically cleaned up after processing

## 🐛 Troubleshooting

### Common Issues

**"Email address not verified in AWS SES"**
- Verify your sender email in AWS SES Console
- Check spam folder for verification email

**"AWS SES permission denied"**
- Verify IAM user has correct SES permissions
- Check AWS credentials in environment variables

**"Excel file must contain Name and Email columns"**
- Ensure your CSV/Excel has exact column names: `Name` and `Email`
- Check for extra spaces or special characters in headers

**Rate limiting errors**
- AWS SES has sending limits (200 emails/day in sandbox)
- Request production access for higher limits
- Built-in delays help prevent rate limiting

### Getting Help

- Create an issue on GitHub
- Check AWS SES documentation
- Review console logs for detailed error messages