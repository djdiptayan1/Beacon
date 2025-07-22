import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        content: "Beacon has revolutionized how we handle our email campaigns. The Excel integration is seamless, and the personalization features are exactly what we needed.",
        author: {
            name: "Sarah Johnson",
            role: "Marketing Director",
            company: "TechCorp Inc.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        content: "The platform is incredibly user-friendly. We were able to send personalized emails to our entire customer base in minutes. Highly recommended!",
        author: {
            name: "Michael Chen",
            role: "Customer Success Manager",
            company: "GrowthStart",
            image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        content: "The delivery tracking and analytics features have helped us optimize our email campaigns. We've seen a significant improvement in our open rates.",
        author: {
            name: "Emily Rodriguez",
            role: "Digital Marketing Specialist",
            company: "BrandBoost",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
];

const Testimonials = () => {
    return (
        <section className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-semibold leading-8 tracking-tight text-blue-600"
                    >
                        Testimonials
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                    >
                        Loved by businesses worldwide
                    </motion.p>
                </div>
                <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <div className="-mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.author.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200"
                            >
                                <div className="flex items-center gap-x-4">
                                    <img
                                        className="h-12 w-12 rounded-full bg-gray-50"
                                        src={testimonial.author.image}
                                        alt={testimonial.author.name}
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                                            {testimonial.author.name}
                                        </h3>
                                        <div className="text-sm leading-6 text-gray-600">
                                            {testimonial.author.role} at {testimonial.author.company}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-6 text-lg leading-7 text-gray-600">
                                    "{testimonial.content}"
                                </p>
                                <div className="mt-6 flex items-center gap-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="h-5 w-5 text-yellow-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 