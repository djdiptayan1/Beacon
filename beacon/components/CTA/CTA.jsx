import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="relative py-24 sm:py-32 bg-white border-t border-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
                    >
                        Ready to scale your reach?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300"
                    >
                        Join the businesses trusting Beacon for high-performance email delivery. No complex setups, just results.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 flex items-center justify-center gap-x-6"
                    >
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#EMAIL_SEND_FORM"
                            className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors uppercase tracking-widest"
                        >
                            Get Started
                        </motion.a>
                    </motion.div>

                    {/* Subtle highlights */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <div className="flex items-center gap-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SES Optimized</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">99.9% Delivery</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enterprise Speed</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA; 