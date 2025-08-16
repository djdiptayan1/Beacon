import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const Success_Popup = ({ onClose, successData }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    {/* Background Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
                        aria-hidden="true"
                        onClick={onClose}
                    ></motion.div>

                    {/* Trick for vertical centering */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative inline-block align-bottom bg-white rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-50"
                    >
                        <div>
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Title */}
                            <div className="text-center">
                                <h3
                                    className="text-2xl leading-6 font-bold text-gray-900 mb-2"
                                    id="modal-title"
                                >
                                    Mail Campaign Sent Successfully!
                                </h3>

                                <div className="mt-4">
                                    {successData ? (
                                        <div className="space-y-4">
                                            {/* Summary Cards */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {successData.summary?.successful || 0}
                                                    </div>
                                                    <div className="text-sm text-green-700 font-medium">Sent Successfully</div>
                                                </div>
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                                    <div className="text-2xl font-bold text-red-600">
                                                        {successData.summary?.failed || 0}
                                                    </div>
                                                    <div className="text-sm text-red-700 font-medium">Failed</div>
                                                </div>
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                                    <div className="text-2xl font-bold text-yellow-600">
                                                        {successData.summary?.skipped || 0}
                                                    </div>
                                                    <div className="text-sm text-yellow-700 font-medium">Skipped</div>
                                                </div>
                                            </div>

                                            {/* Success Message */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-blue-800 font-medium text-center">
                                                    {successData.message}
                                                </p>
                                            </div>

                                            {/* AWS Note */}
                                            {successData.awsNote && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0">
                                                            <svg
                                                                className="h-5 w-5 text-yellow-400"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-yellow-800">
                                                                AWS SES Note
                                                            </h4>
                                                            <p className="text-sm text-yellow-700 mt-1">
                                                                {successData.awsNote}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Results Table */}
                                            {successData.results && successData.results.length > 0 && (
                                                <div className="mt-6">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                                        Email Delivery Results
                                                    </h4>
                                                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50 sticky top-0">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Name
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Email
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Status
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {successData.results.slice(0, 10).map((result, index) => (
                                                                    <tr key={index} className="hover:bg-gray-50">
                                                                        <td className="px-4 py-2 text-sm text-gray-900">{result.name}</td>
                                                                        <td className="px-4 py-2 text-sm text-gray-600">{result.email}</td>
                                                                        <td className="px-4 py-2 text-sm">
                                                                            <span
                                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${result.status === 'success'
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : result.status === 'error'
                                                                                        ? 'bg-red-100 text-red-800'
                                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                                    }`}
                                                                            >
                                                                                {result.status === 'success'
                                                                                    ? 'ent'
                                                                                    : result.status === 'error'
                                                                                        ? 'Failed'
                                                                                        : 'Skipped'}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        {successData.results.length > 10 && (
                                                            <div className="bg-gray-50 px-4 py-2 text-center text-sm text-gray-500">
                                                                ... and {successData.results.length - 10} more results
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Your emails have been sent successfully. You can check your sent folder for
                                            confirmation.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                className="flex-1 inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                onClick={onClose}
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

Success_Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    successData: PropTypes.object,
};

export default Success_Popup;
