# 📧 Beacon

> A powerful mass email sender for marketing campaigns with beautiful templates and AWS SES integration

![Logo](https://mailer-6i6.pages.dev/logo.png)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)](https://tailwindcss.com/)
[![AWS SES](https://img.shields.io/badge/AWS-SES-orange)](https://aws.amazon.com/ses/)

## ✨ Features

- 🎨 **Beautiful Email Templates** - Pre-built responsive templates for various campaign types
- 📊 **Excel/CSV Import** - Easy bulk email import from spreadsheets
- 🎯 **Template Personalization** - Dynamic content replacement using spreadsheet data
- ☁️ **AWS SES Integration** - Reliable email delivery with Amazon Simple Email Service
- 📝 **Rich Text Editor** - Built-in WYSIWYG editor for custom templates
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Real-time Processing** - Live feedback during email sending process

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
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `beacon` directory:

   ```env
   # AWS SES Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_SES_REGION=us-east-1
   AWS_REGION=us-east-1
   
   # Legacy SMTP (if needed)
   SMTP_SERVER=your_smtp_server
   SMTP_PORT=587
   EMAIL=your_email@domain.com
   PASSWORD=your_password
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Usage

### 1. Prepare Your Data

- Create an Excel or CSV file with recipient information
- Include columns like: `email`, `name`, `company`, etc.
- First row should contain column headers

### 2. Choose a Template

- Select from pre-built templates:
  - Welcome emails
  - Newsletter campaigns
  - Product launches
  - Event invitations
  - Promotional campaigns

### 3. Customize Your Campaign

- Use the built-in editor to modify templates
- Add dynamic placeholders like `{{name}}`, `{{company}}`
- Preview your email before sending

### 4. Send Your Campaign

- Upload your CSV/Excel file
- Set sender email and subject line
- Review and send your campaign

## 🏗️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **AWS SES** - Email delivery service
- **Nodemailer** - Email sending library (fallback)

### Tools & Libraries

- **TinyMCE** - Rich text editor
- **Papa Parse** - CSV parsing
- **XLSX** - Excel file processing
- **React Quill** - Alternative rich text editor

## 🗂️ Project Structure

```text
beacon/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── SendEmails/    # Email sending endpoint
│   │   └── upload-image/  # Image upload endpoint
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Homepage
├── components/            # React components
│   ├── EmailForm/         # Main email form
│   ├── TemplateEditor/    # Template editor
│   ├── TemplateSelector/  # Template selection
│   └── ui/                # Reusable UI components
├── templates/             # Email templates
│   ├── welcome.html
│   ├── newsletter.html
│   ├── product-launch.html
│   ├── event-invitation.html
│   └── promotional.html
└── public/                # Static assets
```

## 🔧 Configuration

### AWS SES Setup

1. **Create AWS Account** and navigate to SES console
2. **Verify your domain** or email address
3. **Create IAM user** with SES permissions:

   ```json
   {
     "Version": "2025-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

4. **Add credentials** to your `.env.local` file

### Email Templates

Templates support dynamic placeholders:

- `{{name}}` - Recipient name
- `{{email}}` - Recipient email
- `{{company}}` - Company name
- `{{custom_field}}` - Any CSV column header

## 🚢 Deployment

### Deploy on Vercel

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Your app will be live at `your-app.vercel.app`

### Deploy on other platforms

The app can be deployed on any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify