"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Success_Popup from '../modules/Success_Popup';
import Error_Popup from '../modules/Error_Popup';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EmailForm = () => {
    const formref = useRef(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [file_csv, setFile_csv] = useState(null);
    const [file_html, setFile_html] = useState(null);
    const [textContent, setTextContent] = useState('');

    const [formData_simple, setFormData_simple] = useState({
        simple: true,
        sender_email: '',
        subject: '',
        template_type: 'html' // Default to HTML template
    });

    const [isQuillLoaded, setIsQuillLoaded] = useState(false);

    useEffect(() => {
        setIsQuillLoaded(true);
    }, []);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'indent',
        'align', 'link', 'image'
    ];

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'csv_excel') {
            setFile_csv(files[0]);
        } else if (name === 'html_template') {
            setFile_html(files[0]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData_simple((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setSending(true);

        // Validation for template content
        if (formData_simple.template_type === 'html' && !file_html) {
            alert('Please upload an HTML template file.');
            setSending(false);
            return;
        }

        if (formData_simple.template_type === 'text' && (!textContent.trim() || textContent === '<p><br></p>')) {
            alert('Please write your email content.');
            setSending(false);
            return;
        }

        const formData = new FormData();
        const data = formData_simple;

        // Append form data
        for (const key in data) {
            if (data[key] !== null && data[key] !== '') {
                formData.append(key, data[key]);
            }
        }

        // Append files if present
        if (file_csv) {
            formData.append('csv_excel', file_csv);
        }

        // Handle template content based on type
        if (formData_simple.template_type === 'html' && file_html) {
            formData.append('html_template', file_html);
        } else if (formData_simple.template_type === 'text' && textContent) {
            // Create a blob from text content and append as file
            const textBlob = new Blob([textContent], { type: 'text/plain' });
            formData.append('html_template', textBlob, 'text-content.txt');
        }

        try {
            const response = await fetch('/api/SendEmails', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('Email sent successfully:', data);
                setSuccessData(data); // Store the detailed response data
                setShowSuccessPopup(true);
                setSuccess(true);
            } else {
                console.error('Error sending email:', data);
                // Show detailed error information
                let errorMessage = data.message || 'Unknown error occurred';
                if (data.awsNote) {
                    errorMessage += '\n\n' + data.awsNote;
                }
                if (data.summary) {
                    errorMessage += `\n\nSummary: ${data.summary.successful} sent, ${data.summary.failed} failed, ${data.summary.skipped} skipped`;
                }
                alert(errorMessage);
                setShowErrorPopup(true);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error: Unable to connect to the server');
            setShowErrorPopup(true);
        } finally {
            setSending(false);
        }

        // Reset form state
        setFile_csv(null);
        setFile_html(null);
        setTextContent('');
        setFormData_simple({
            simple: true,
            sender_email: '',
            subject: '',
            template_type: 'html'
        });

        if (formref.current) {
            formref.current.reset();
        }
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false);
        setSuccessData(null); // Clear success data when closing
    };

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-24 sm:py-32 overflow-hidden" id="EMAIL_SEND_FORM">

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Email Campaign
                        </h2>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                    >
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Send Mass Emails
                        </span>
                        <span className="block text-3xl sm:text-4xl lg:text-5xl font-light text-gray-600 mt-2">
                            Effortlessly
                        </span>
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light"
                    >
                        Upload your Excel sheet and template to start sending
                        <span className="text-gray-800 font-medium"> personalized emails</span> to your audience.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mx-auto max-w-4xl"
                >
                    <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-2xl p-8 lg:p-12">
                        <form className="space-y-8" ref={formref} onSubmit={handleSendEmail}>
                            {/* File Upload Section */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Excel/CSV File
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="csv_excel"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-gray-600
                                                file:mr-4 file:py-3 file:px-6
                                                file:rounded-xl file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-gradient-to-r file:from-blue-50 file:to-purple-50
                                                file:text-blue-700 hover:file:from-blue-100 hover:file:to-purple-100
                                                file:transition-all file:duration-300 file:cursor-pointer
                                                border-2 border-dashed border-gray-300 rounded-xl p-4
                                                hover:border-blue-400 transition-colors duration-300
                                                focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Template Type Selection */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-800 mb-4">
                                    Template Type
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            name="template_type"
                                            value="html"
                                            checked={formData_simple.template_type === 'html'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData_simple.template_type === 'html'
                                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}>
                                            <div className="flex flex-col items-center space-y-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                </svg>
                                                <span className="font-medium text-center">HTML Template</span>
                                                <span className="text-xs text-center text-purple-600">Upload File</span>
                                            </div>
                                        </div>
                                    </label>
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            name="template_type"
                                            value="text"
                                            checked={formData_simple.template_type === 'text'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData_simple.template_type === 'text'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}>
                                            <div className="flex flex-col items-center space-y-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                <span className="font-medium text-center">Rich Text Template</span>
                                                <span className="text-xs text-center text-green-600">Rich Editor</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>                                {/* Template Content Section */}
                            {formData_simple.template_type === 'html' ? (
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                        Upload HTML Template
                                    </label>
                                    <input
                                        type="file"
                                        name="html_template"
                                        accept=".html,.htm"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-gray-600
                                                file:mr-4 file:py-3 file:px-6
                                                file:rounded-xl file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-gradient-to-r file:from-purple-50 file:to-pink-50
                                                file:text-purple-700 hover:file:from-purple-100 hover:file:to-pink-100
                                                file:transition-all file:duration-300 file:cursor-pointer
                                                border-2 border-dashed border-gray-300 rounded-xl p-4
                                                hover:border-purple-400 transition-colors duration-300
                                                focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Tip:</span> Use <code className="bg-gray-200 px-1 rounded">{"{{Receipient_name}}"}</code> in your HTML template for personalization with recipient names.
                                            <br /><span className="font-medium">HTML Mode:</span> You can use HTML tags for rich formatting.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                        Write Your Email Content
                                    </label>
                                    {isQuillLoaded && (
                                        <div className="transition-colors duration-300">
                                            <ReactQuill
                                                theme="snow"
                                                value={textContent}
                                                onChange={setTextContent}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Write your email content here. Use {{Receipient_name}} to personalize with recipient names."
                                                style={{
                                                    height: '200px',
                                                    borderRadius: '12px',
                                                }}
                                                className="rich-text-editor"
                                            />
                                        </div>
                                    )}
                                    <div className="mt-16 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Tip:</span> Use <code className="bg-gray-200 px-1 rounded">{"{{Receipient_name}}"}</code> for personalization with recipient names.
                                            <br /><span className="font-medium">Rich Text Mode:</span> Use the toolbar above for formatting - bold, italic, colors, lists, links, and more!
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Form Fields Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                        Sender&apos;s Email
                                    </label>
                                    <input
                                        type="email"
                                        name="sender_email"
                                        value={formData_simple.sender_email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                                                     focus:border-blue-500 focus:outline-none transition-colors duration-300
                                                     text-gray-700 placeholder-gray-400"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData_simple.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                                                     focus:border-blue-500 focus:outline-none transition-colors duration-300
                                                     text-gray-700 placeholder-gray-400"
                                        placeholder="Your email subject"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Excel Format Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-blue-800 mb-3">📋 Requirements & AWS SES Setup</h4>
                                <div className="space-y-3 text-sm text-blue-700">
                                    <div>
                                        <p className="font-medium mb-2">Excel File Format:</p>
                                        <div className="flex space-x-4 ml-4 mb-2">
                                            <span className="px-2 py-1 bg-blue-100 rounded font-mono">Name</span>
                                            <span className="px-2 py-1 bg-blue-100 rounded font-mono">Email</span>
                                        </div>
                                        <a
                                            href="/sample-data.xlsx"
                                            download
                                            className="ml-4 text-blue-600 hover:text-blue-800 underline text-xs"
                                        >
                                            📥 Download sample Excel file
                                        </a>
                                    </div>

                                    <div>
                                        <p className="font-medium mb-2">Template Options:</p>
                                        <div className="ml-4 mb-2 space-y-1">
                                            <p className="text-xs">• <strong>HTML Template:</strong> Upload .html or .htm files with rich formatting</p>
                                            <p className="text-xs">• <strong>Rich Text Template:</strong> Use the rich text editor for Gmail-like formatting</p>
                                            <p className="text-xs">• Use <code className="bg-blue-100 px-1 rounded">{"{{Receipient_name}}"}</code> for personalization</p>
                                        </div>
                                        <div className="flex space-x-4 ml-4">
                                            <a
                                                href="/sample-template.html"
                                                download
                                                className="text-blue-600 hover:text-blue-800 underline text-xs"
                                            >
                                                📥 Download sample HTML template
                                            </a>
                                        </div>
                                    </div>

                                    {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="font-medium mb-2 text-yellow-800">⚠️ AWS SES Sandbox Mode:</p>
                                            <div className="ml-4 text-yellow-700 text-xs space-y-1">
                                                <p>• In sandbox mode, emails can only be sent TO verified addresses</p>
                                                <p>• <strong>For testing:</strong> Verify recipient emails in AWS SES Console</p>
                                                <p>• <strong>For production:</strong> Request production access in AWS SES</p>
                                                <p>• Sender email must also be verified in AWS SES</p>
                                            </div>
                                        </div> */}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={sending || success}
                                    className={`w-full group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${sending || success
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                    <span className="relative flex items-center space-x-2">
                                        {sending ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Sending Emails...</span>
                                            </>
                                        ) : success ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Emails Sent Successfully!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                <span>Send Email Campaign</span>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Popups */}
                {showSuccessPopup && <Success_Popup onClose={closePopup} successData={successData} />}
                {showErrorPopup && <Error_Popup onClose={closePopup} />}
            </div>
        </section>
    );
};

export default EmailForm; 