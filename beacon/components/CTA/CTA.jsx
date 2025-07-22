import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 -z-10 h-full w-full bg-white [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto max-w-2xl"
            >
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Ready to transform your email marketing?
                    <br />
                    Start sending mass emails today.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                    Join thousands of businesses that trust Beacon for their email marketing needs.
                    Start with a free trial and see the difference for yourself.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="#features"
                        className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Get started
                    </a>
                    <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">
                        View pricing <span aria-hidden="true">→</span>
                    </a>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 flex items-center justify-center gap-x-8"
                >
                    <div className="flex items-center gap-x-2">
                        <svg className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">4.9/5 rating</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <svg className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">99.9% uptime</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <svg className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.57.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.57-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">24/7 support</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default CTA; 