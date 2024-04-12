"use client";
import React, { useState, useRef } from 'react'
import Success_Popup from '../modules/Success_Popup';
import Error_Popup from '../modules/Error_Popup';
const SendForm = () => {

    const formref = useRef(null);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [Sending, setSending] = useState(false); // Track submission status
    const [success, setSuccess] = useState(false); // Track success status

    const [activeTab, setActiveTab] = useState('Simple');
    const [file_csv, setFile_cvs] = useState(null);
    const [file_html, setFile_html] = useState(null);
    const [formData_simple, setFormData_simple] = useState({
        simple: true,
        sender_email: '',
        subject: ''
    });

    const [formData_advanced, setFormData_advanced] = useState({
        simple: false,
        SERVER_URL: '',
        SERVER_PORT: '',
        SERVER_USER: '',
        SERVER_PASS: '',
        sender_email: '',
        subject: ''
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'csv_excel') {
            setFile_cvs(files[0]);
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


    const handleSendEmail = async (e) => {
        e.preventDefault();
        setSending(true); // Begin the sending process
        console.log(file_csv, file_html, formData_simple, formData_advanced);

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
        if (file_html) {
            formData.append('html_template', file_html);
        }

        try {
            const response = await fetch('/api/SendEmails', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Email sent successfully:', data);
                setShowSuccessPopup(true);
                setSuccess(true);
            } else {
                console.error('Error sending email:', response.status, response.statusText);
                setShowErrorPopup(true);
            }
        } catch (error) {
            console.error('Network error:', error);
            setShowErrorPopup(true);
        } finally {
            setSending(false); // End the sending process
        }

        // Reset the form state after either success or failure
        setFile_cvs(null);
        setFile_html(null);
        setFormData_simple({
            simple: true,
            sender_email: '',
            subject: ''
        });
        setFormData_advanced({
            simple: false,
            SERVER_URL: '',
            SERVER_PORT: '',
            SERVER_USER: '',
            SERVER_PASS: '',
            sender_email: '',
            subject: ''
        });

        // Also reset file inputs
        if (formref.current) {
            formref.current.reset();
        }
    };

    const closePopup = () => {
        setShowSuccessPopup(false);
        setShowErrorPopup(false);
    };

    return (
        <section className="bg-white" id="EMAIL_SEND_FORM">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt=""
                        src="https://mailer-6i6.pages.dev/email.png"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />

                    <div className="hidden lg:relative lg:block lg:p-12">
                        <div className="block text-white">
                            <img src="https://mailer-6i6.pages.dev/logo.png" alt="mailer" className="w-16 h-16" />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Welcome to Beacon 📬
                        </h2>

                        <p className="mt-4 leading-relaxed text-white/90">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
                            quibusdam aperiam voluptatum.
                        </p>
                    </div>
                </section>

                <main
                    className=" my-auto px-6 py-6 justify-center lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                >
                    <div className="">
                        <div className="relative -mt-16 block lg:hidden">
                            <div
                                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                            >
                                <img src="https://mailer-6i6.pages.dev/logo.png" alt="mailer" className="w-16 h-16" />
                            </div>

                            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                                Welcome to Beacon 📬
                            </h1>

                            <p className="mt-4 leading-relaxed text-gray-500">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
                                quibusdam aperiam voluptatum.
                            </p>
                        </div>

                        <div className="my-3">
                            <div className="p-6 rounded-lg">
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        className={`px-4 py-2 rounded-t-lg ${activeTab === 'Simple' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                                            }`}
                                        onClick={() => setActiveTab('Simple')}
                                    >
                                        Simple
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-t-lg ${activeTab === 'Advanced' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                                            }`}
                                        onClick={() => setActiveTab('Advanced')}
                                    >
                                        Advanced
                                    </button>
                                </div>

                                {activeTab === 'Simple' ? (
                                    // Simple Form
                                    <form className="space-y-6 text-black"
                                        ref={formref}
                                        onSubmit={handleSendEmail}
                                    >
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                CSV / Excel List
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                                                type="file"
                                                name="csv_excel"
                                                accept=".csv, .xls, .xlsx"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                HTML Template
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                                                type="file"
                                                name="html_template"
                                                accept=".html, .htm"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Sender's Email
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Email"
                                                type="email"
                                                name="sender_email"
                                                value={formData_simple.sender_email || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Subject
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Subject"
                                                type="text"
                                                name="subject"
                                                value={formData_simple.subject || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <button
                                                className={`block w-full px-4 py-2 ${Sending || success ? 'bg-green-500 hover:bg-green-900' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                type="submit"
                                                disabled={Sending || success}
                                                style={{ cursor: Sending || success ? 'not-allowed' : 'pointer' }}
                                            >
                                                {Sending ? 'Sending...' : success ? 'Sent!' : 'Send Emails'}
                                            </button>

                                            {/* Container for button and popup */}
                                            <div className="relative mt-4">
                                                {showSuccessPopup && (
                                                    <Success_Popup onClose={closePopup} />
                                                )}
                                                {showErrorPopup && (
                                                    <Error_Popup onClose={closePopup} />
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    // Advanced Form
                                    <form className="space-y-6 text-black"
                                        ref={formref}
                                        onSubmit={handleSendEmail}
                                    >
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                SMTP SERVER URL
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                type="text"
                                                name="SERVER_URL"
                                                value={formData_advanced.SERVER_URL || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                SMTP PORT
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                type="number"
                                                name="SERVER_PORT"
                                                value={formData_advanced.SERVER_PORT || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                SERVER USERNAME
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                type="text"
                                                name="SERVER_USER"
                                                value={formData_advanced.SERVER_USER || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                SERVER PASSWORD
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                type="password"
                                                name="SERVER_PASS"
                                                value={formData_advanced.SERVER_PASS || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                CSV / Excel List
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                type="file"
                                                name="csv_excel"
                                                accept=".csv, .xls, .xlsx"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                HTML Template
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                type="file"
                                                name="html_template"
                                                accept=".html, .htm"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Sender's Email
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Email"
                                                type="email"
                                                name="sender_email"
                                                value={formData_advanced.sender_email || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Subject
                                            </label>
                                            <input
                                                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Subject"
                                                type="text"
                                                name="subject"
                                                value={formData_advanced.subject || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <button
                                                className={`block w-full px-4 py-2 ${Sending || success ? 'bg-green-500 hover:bg-green-900' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                type="submit"
                                                disabled={Sending || success}
                                                style={{ cursor: Sending || success ? 'not-allowed' : 'pointer' }}
                                            >
                                                {Sending ? 'Sending...' : success ? 'Sent!' : 'Send Emails'}
                                            </button>

                                            {/* Container for button and popup */}
                                            <div className="relative mt-4">
                                                {showSuccessPopup && (
                                                    <Success_Popup onClose={closePopup} />
                                                )}
                                                {showErrorPopup && (
                                                    <Error_Popup onClose={closePopup} />
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div >
        </section >
    )
}

export default SendForm