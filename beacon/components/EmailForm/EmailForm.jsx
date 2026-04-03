"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Success_Popup from '../modules/Success_Popup';
import Error_Popup from '../modules/Error_Popup';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EmailForm = () => {
    const formref = useRef(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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

        // Validation for files
        if (!file_csv) {
            setErrorMessage('Please upload an Excel or CSV file containing your recipients.');
            setShowErrorPopup(true);
            return;
        }

        // Validation for template content
        if (formData_simple.template_type === 'html' && !file_html) {
            setErrorMessage('Please upload an HTML template file.');
            setShowErrorPopup(true);
            return;
        }

        if (formData_simple.template_type === 'text' && (!textContent.trim() || textContent === '<p><br></p>')) {
            setErrorMessage('Please write your email content in the rich text editor.');
            setShowErrorPopup(true);
            return;
        }

        setSending(true);

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

                // Reset form state on success
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
            } else {
                console.error('Error sending email:', data);
                // Show detailed error information
                let msg = data.message || 'Unknown error occurred';
                if (data.awsNote) {
                    msg += '\n\n' + data.awsNote;
                }
                if (data.summary) {
                    msg += `\n\nSummary: ${data.summary.successful} sent, ${data.summary.failed} failed, ${data.summary.skipped} skipped`;
                }
                setErrorMessage(msg);
                setShowErrorPopup(true);
            }
        } catch (error) {
            console.error('Network error:', error);
            setErrorMessage('Network error: Unable to connect to the server. Please check your internet connection.');
            setShowErrorPopup(true);
        } finally {
            setSending(false);
        }
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false);
        setErrorMessage('');
        setSuccessData(null); // Clear success data when closing
    };

    return (
        <section className="relative bg-white py-24 sm:py-32 overflow-hidden" id="EMAIL_SEND_FORM">
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-6 flex justify-center"
                    >
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
                            Campaign Builder
                        </span>
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6"
                    >
                        Ready to reach your audience?
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto"
                    >
                        Configure your campaign below. We&apos;ll handle the personalization and delivery via your SES environment.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="mx-auto max-w-4xl"
                >
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 lg:p-12">
                        <form className="space-y-10" ref={formref} onSubmit={handleSendEmail}>
                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    1. Audience Data
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        name="csv_excel"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                    />
                                    <div className={`
                                        flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-all duration-300
                                        ${file_csv ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 group-hover:border-gray-300 bg-gray-50/50'}
                                    `}>
                                        <div className={`p-4 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${file_csv ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-400 shadow-sm'}`}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {file_csv ? file_csv.name : 'Click to upload your Excel or CSV'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Ensure columns &quot;Name&quot; and &quot;Email&quot; are present.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Template Section */}
                            <div className="space-y-6">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    2. Email Content
                                </label>

                                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleInputChange({ target: { name: 'template_type', value: 'html' } })}
                                        className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${formData_simple.template_type === 'html' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        HTML File
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleInputChange({ target: { name: 'template_type', value: 'text' } })}
                                        className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${formData_simple.template_type === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Rich Text
                                    </motion.button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {formData_simple.template_type === 'html' ? (
                                        <motion.div
                                            key="html-upload"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            className="relative group"
                                        >
                                            <input
                                                type="file"
                                                name="html_template"
                                                accept=".html,.htm"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                required
                                            />
                                            <div className={`
                                                flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300
                                                ${file_html ? 'border-purple-500 bg-purple-50/30' : 'border-gray-200 group-hover:border-gray-300 bg-gray-50/50'}
                                            `}>
                                                <div className={`p-4 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${file_html ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-400 shadow-sm'}`}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {file_html ? file_html.name : 'Upload your HTML template'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="rich-text"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                            className="space-y-4"
                                        >
                                            {isQuillLoaded && (
                                                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50/30">
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={textContent}
                                                        onChange={setTextContent}
                                                        modules={quillModules}
                                                        formats={quillFormats}
                                                        placeholder="Write your message here. Use {{Recipient_name}} for personalization."
                                                        style={{ height: '300px' }}
                                                        className="rich-text-editor"
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="p-4 bg-gray-50 rounded-xl flex items-start space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <span className="font-bold text-gray-700">Pro-tip:</span> Use <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-blue-600 font-mono">{"{{Recipient_name}}"}</code> anywhere in your message to automatically personalize emails with your contact names.
                                    </p>
                                </div>
                            </div>

                            {/* Campaign Details */}
                            <div className="space-y-6">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                                    3. Campaign Identity
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                            Sender Address
                                        </label>
                                        <input
                                            type="email"
                                            name="sender_email"
                                            value={formData_simple.sender_email}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
                                            placeholder="verified-sender@yourdomain.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                                            Subject Line
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData_simple.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-gray-900 font-medium placeholder-gray-400"
                                            placeholder="Your compelling subject line"
                                            required
                                        />
                                    </div>
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
                                            <p className="text-xs">• Use <code className="bg-blue-100 px-1 rounded">{"{{Recipient_name}}"}</code> for personalization</p>
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
                            <div className="pt-10">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={sending}
                                    className={`w-full relative inline-flex items-center justify-center px-8 py-5 text-sm font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 ${sending
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                        : success 
                                            ? 'bg-green-600 text-white shadow-xl shadow-green-100'
                                            : 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200'
                                        }`}
                                >
                                    <span className="relative flex items-center space-x-3">
                                        {sending ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Deploying Campaign...</span>
                                            </>
                                        ) : success ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Campaign Dispatched</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                <span>Launch Campaign</span>
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </div>

                        </form>
                    </div>
                </motion.div>

                {/* Popups */}
                {showSuccessPopup && <Success_Popup onClose={closePopup} successData={successData} />}
                {showErrorPopup && <Error_Popup onClose={closePopup} message={errorMessage} />}
            </div>
        </section>
    );
};

export default EmailForm; 