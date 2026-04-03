import React from 'react';
import { motion } from 'framer-motion';


const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden pt-20">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                {/* Brand Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-10 shadow-sm"
                >
                    <img
                        src="https://mailer-6i6.pages.dev/logo.png"
                        alt="Beacon"
                        className="h-5 w-5 rounded-md"
                    />
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        The SES Mailing Engine
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 mb-8"
                >
                    Mailing at scale,<br /> 
                    <span className="text-blue-600">simplified.</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-normal"
                >
                    A minimalist interface for Amazon SES. No bloat, no complex configurations. Just upload your data and reach your audience in seconds.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="#EMAIL_SEND_FORM"
                        className="px-8 py-4 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-xl shadow-gray-200"
                    >
                        Create Campaign
                    </motion.a>
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="#features"
                        className="px-8 py-4 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Learn More
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;