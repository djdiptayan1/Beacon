import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TemplateSelector = ({ onSelectTemplate, selectedTemplate }) => {
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const templates = [
        {
            id: 'newsletter',
            name: 'Newsletter',
            description: 'Perfect for regular updates, news, and company announcements',
            icon: '📰',
            color: 'blue',
            features: ['Clean design', 'Social links', 'Unsubscribe footer', 'Mobile responsive']
        },
        {
            id: 'welcome',
            name: 'Welcome Email',
            description: 'Warm welcome message for new users or subscribers',
            icon: '👋',
            color: 'green',
            features: ['Step-by-step guide', 'Support links', 'Getting started', 'Friendly tone']
        },
        {
            id: 'product-launch',
            name: 'Product Launch',
            description: 'Announce new products with excitement and features',
            icon: '🚀',
            color: 'purple',
            features: ['Eye-catching design', 'Feature highlights', 'Strong CTA', 'Product showcase']
        },
        {
            id: 'event-invitation',
            name: 'Event Invitation',
            description: 'Professional invitations for events, webinars, and meetings',
            icon: '🎉',
            color: 'pink',
            features: ['Event details', 'RSVP button', 'Agenda layout', 'Location info']
        },
        {
            id: 'promotional',
            name: 'Promotional Sale',
            description: 'High-converting sales and promotional campaigns',
            icon: '🔥',
            color: 'red',
            features: ['Urgency elements', 'Discount badges', 'Countdown timer', 'Product grid']
        }
    ];

    const getColorClasses = (color, isSelected = false) => {
        const colors = {
            blue: isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 text-gray-600',
            green: isSelected
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300 text-gray-600',
            purple: isSelected
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300 text-gray-600',
            pink: isSelected
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-gray-200 hover:border-pink-300 text-gray-600',
            red: isSelected
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-red-300 text-gray-600'
        };
        return colors[color] || colors.blue;
    };

    const loadTemplate = async (templateId) => {
        try {
            const response = await fetch(`/templates/${templateId}.html`);
            const content = await response.text();
            return content;
        } catch (error) {
            console.error('Error loading template:', error);
            return null;
        }
    };

    const handleTemplateSelect = async (template) => {
        const content = await loadTemplate(template.id);
        if (content) {
            onSelectTemplate(content, template);
        }
    };

    const handlePreview = async (template) => {
        const content = await loadTemplate(template.id);
        if (content) {
            setPreviewTemplate({ ...template, content });
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h3>
                <p className="text-gray-600">Select from our professionally designed email templates</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${getColorClasses(template.color, selectedTemplate?.id === template.id)
                            }`}
                        onClick={() => handleTemplateSelect(template)}
                    >
                        {/* Template Icon */}
                        <div className="text-4xl mb-4 text-center">
                            {template.icon}
                        </div>

                        {/* Template Info */}
                        {/* <div className="text-center mb-4">
                            <h4 className="text-lg font-semibold mb-2">{template.name}</h4>
                            <p className="text-sm opacity-80 mb-4">{template.description}</p>
                        </div> */}

                        {/* Features */}
                        {/* <div className="space-y-2 mb-6">
                            {template.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center text-xs opacity-70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-2"></div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div> */}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTemplateSelect(template);
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium bg-white border border-current rounded-lg hover:bg-current hover:text-white transition-colors duration-200"
                            >
                                Use Template
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(template);
                                }}
                                className="px-4 py-2 text-sm font-medium bg-current text-white rounded-lg hover:opacity-80 transition-opacity duration-200"
                            >
                                Preview
                            </button>
                        </div>

                        {/* Selected Badge */}
                        {selectedTemplate?.id === template.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-current rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Custom Template Option */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-gray-400 transition-colors duration-300"
            >
                <div className="text-4xl mb-4">✨</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Template</h4>
                <p className="text-gray-600 mb-4">Want something unique? Create your own custom template from scratch.</p>
                <button
                    onClick={() => onSelectTemplate('', { id: 'custom', name: 'Custom Template' })}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                    Start from Scratch
                </button>
            </motion.div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-semibold">Preview: {previewTemplate.name}</h3>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-auto max-h-[70vh]">
                            <div
                                className="border rounded-lg overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                            />
                        </div>
                        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleTemplateSelect(previewTemplate);
                                    setPreviewTemplate(null);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Use This Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateSelector;
