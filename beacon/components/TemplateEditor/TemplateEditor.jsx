"use client";
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import 'react-quill/dist/quill.snow.css';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

const TemplateEditor = ({ content, onChange, previewMode }) => {
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false
        }
    }), []);

    const formats = useMemo(() => [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'align',
        'link', 'image'
    ], []);

    if (previewMode) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 block w-full"
        >
            <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                    <button
                        onClick={() => {
                            const template = `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h1 style="color: #333;">Welcome!</h1>
                                    <p>Hello {{name}},</p>
                                    <p>Thank you for joining us. We're excited to have you on board!</p>
                                    <p>Best regards,<br>Your Team</p>
                                </div>
                            `;
                            onChange(template);
                        }}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                    >
                        Basic Template
                    </button>
                    <button
                        onClick={() => {
                            const template = `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h1 style="color: #333; text-align: center;">Newsletter</h1>
                                    <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
                                        <h2>Latest Updates</h2>
                                        <p>Hello {{name}},</p>
                                        <p>Here are our latest updates:</p>
                                        <ul>
                                            <li>Update 1</li>
                                            <li>Update 2</li>
                                            <li>Update 3</li>
                                        </ul>
                                    </div>
                                    <p style="text-align: center;">© 2024 Your Company</p>
                                </div>
                            `;
                            onChange(template);
                        }}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                    >
                        Newsletter Template
                    </button>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                    Available placeholders: {'{{name}}'}, {'{{email}}'}, and any field from your Excel file
                </div>
            </div>
            <ReactQuill
                value={content}
                onChange={onChange}
                modules={modules}
                formats={formats}
                theme="snow"
                className="h-[500px]"
                preserveWhitespace
            />
        </motion.div>
    );
};

export default TemplateEditor;