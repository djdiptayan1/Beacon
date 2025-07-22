"use client";
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Success_Popup from '../modules/Success_Popup';
import Error_Popup from '../modules/Error_Popup';
import TemplateEditor from '../TemplateEditor/TemplateEditor';
import TemplateSelector from '../TemplateSelector/TemplateSelector';

const EmailForm = () => {
    const formref = useRef(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('Simple');
    const [file_csv, setFile_csv] = useState(null);
    const [file_html, setFile_html] = useState(null);
    const [templateContent, setTemplateContent] = useState('');
    const [showTemplateEditor, setShowTemplateEditor] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);

    const [formData_simple, setFormData_simple] = useState({
        simple: true,
        sender_email: '',
        subject: '',
        template_type: 'upload' // Focus on upload templates only
    });

    const [formData_advanced, setFormData_advanced] = useState({
        simple: false,
        SERVER_URL: '',
        SERVER_PORT: '',
        SERVER_USER: '',
        SERVER_PASS: '',
        sender_email: '',
        subject: '',
        template_type: 'upload'
    });

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
        if (activeTab === 'Simple') {
            setFormData_simple((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setFormData_advanced((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleTemplateChange = (e) => {
        setTemplateContent(e.target.value);
    };

    const handleTemplateSelect = async (content, template) => {
        setTemplateContent(content);
        setSelectedTemplate(template);
        // Set form data to use the selected template content
        if (activeTab === 'Simple') {
            setFormData_simple(prev => ({
                ...prev,
                template_type: 'predefined'
            }));
        }
    };

    const handleShowTemplateSelector = () => {
        setShowTemplateSelector(true);
        setShowTemplateEditor(false);
    };

    const handleCreateFromScratch = () => {
        setTemplateContent('');
        setSelectedTemplate(null);
        setShowTemplateSelector(false);
        setShowTemplateEditor(true);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setSending(true);

        // Validation for upload template
        if (!file_html) {
            alert('Please upload an HTML template file.');
            setSending(false);
            return;
        }

        const formData = new FormData();
        const data = activeTab === 'Simple' ? formData_simple : formData_advanced;

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

        // Handle template upload
        if (file_html) {
            formData.append('html_template', file_html);
        }

        try {
            const response = await fetch('/api/SendEmails', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('Email sent successfully:', data);
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
        setTemplateContent('');
        setSelectedTemplate(null);
        setPreviewMode(false);
        setFormData_simple({
            simple: true,
            sender_email: '',
            subject: '',
            template_type: 'upload'
        });
        setFormData_advanced({
            simple: false,
            SERVER_URL: '',
            SERVER_PORT: '',
            SERVER_USER: '',
            SERVER_PASS: '',
            sender_email: '',
            subject: '',
            template_type: 'upload'
        });

        if (formref.current) {
            formref.current.reset();
        }
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false);
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
                        {/* Modern Tab Navigation */}
                        <div className="flex space-x-2 mb-8 p-2 bg-gray-100/50 rounded-2xl backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab('Simple')}
                                className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'Simple'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>Simple Mode</span>
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('Advanced')}
                                className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'Advanced'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Advanced Mode</span>
                                </span>
                            </button>
                        </div>

                        {activeTab === 'Simple' ? (
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="relative">
                                            <input
                                                type="radio"
                                                name="template_type"
                                                value="upload"
                                                checked={formData_simple.template_type === 'upload'}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData_simple.template_type === 'upload'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}>
                                                <div className="flex flex-col items-center space-y-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <span className="font-medium text-center">Upload Template</span>
                                                    <span className="text-xs text-center text-blue-600">✓ Active</span>
                                                </div>
                                            </div>
                                        </label>
                                        <label className="relative opacity-50 cursor-not-allowed">
                                            <input
                                                type="radio"
                                                name="template_type"
                                                value="predefined"
                                                disabled
                                                className="sr-only"
                                            />
                                            <div className="p-4 rounded-xl border-2 border-gray-200 text-gray-400">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                    <span className="font-medium text-center">Choose Template</span>
                                                    <span className="text-xs text-center">Under Development</span>
                                                </div>
                                            </div>
                                        </label>
                                        <label className="relative opacity-50 cursor-not-allowed">
                                            <input
                                                type="radio"
                                                name="template_type"
                                                value="create"
                                                disabled
                                                className="sr-only"
                                            />
                                            <div className="p-4 rounded-xl border-2 border-gray-200 text-gray-400">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span className="font-medium text-center">Create Custom</span>
                                                    <span className="text-xs text-center">Under Development</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    {/* <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Focus Mode:</span> Currently perfecting the upload template feature.
                                            Template selection and custom creation will be available soon!
                                        </p>
                                    </div> */}
                                </div>                                {/* Template Upload Section */}
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
                                        </p>
                                    </div>
                                </div>

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
                                            <p className="font-medium mb-2">HTML Template:</p>
                                            <p className="ml-4 mb-2">Use <code className="bg-blue-100 px-1 rounded">{"{{Receipient_name}}"}</code> for personalization</p>
                                            <a
                                                href="/sample-template.html"
                                                download
                                                className="ml-4 text-blue-600 hover:text-blue-800 underline text-xs"
                                            >
                                                📥 Download sample HTML template
                                            </a>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="font-medium mb-2 text-yellow-800">⚠️ AWS SES Sandbox Mode:</p>
                                            <div className="ml-4 text-yellow-700 text-xs space-y-1">
                                                <p>• In sandbox mode, emails can only be sent TO verified addresses</p>
                                                <p>• <strong>For testing:</strong> Verify recipient emails in AWS SES Console</p>
                                                <p>• <strong>For production:</strong> Request production access in AWS SES</p>
                                                <p>• Sender email must also be verified in AWS SES</p>
                                            </div>
                                        </div>
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
                        ) : (
                            // Advanced form would go here - simplified for now
                            <div className="text-center py-12">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Advanced Mode</h3>
                                <p className="text-gray-500">Advanced SMTP configuration coming soon...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Popups */}
                {showSuccessPopup && <Success_Popup onClose={closePopup} />}
                {showErrorPopup && <Error_Popup onClose={closePopup} />}
            </div>
        </section>
    );
};

export default EmailForm; 