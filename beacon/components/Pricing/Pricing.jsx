import React from 'react';
import { motion } from 'framer-motion';

const tiers = [
    {
        name: 'Starter',
        id: 'tier-starter',
        price: { monthly: '$29' },
        description: 'Perfect for small businesses and startups',
        features: [
            'Up to 1,000 emails per month',
            'Basic email templates',
            'Excel/CSV import',
            'Basic personalization',
            'Email support',
        ],
        cta: 'Get started',
        mostPopular: false,
    },
    {
        name: 'Professional',
        id: 'tier-professional',
        price: { monthly: '$79' },
        description: 'Ideal for growing businesses',
        features: [
            'Up to 10,000 emails per month',
            'Advanced email templates',
            'Excel/CSV import',
            'Advanced personalization',
            'Priority support',
            'Delivery tracking',
            'Custom SMTP support',
        ],
        cta: 'Get started',
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        id: 'tier-enterprise',
        price: { monthly: 'Custom' },
        description: 'For large organizations with custom needs',
        features: [
            'Unlimited emails',
            'Custom email templates',
            'API access',
            'Advanced personalization',
            '24/7 dedicated support',
            'Advanced analytics',
            'Custom SMTP support',
            'SLA guarantee',
            'Custom integrations',
        ],
        cta: 'Contact sales',
        mostPopular: false,
    },
];

const Pricing = () => {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-base font-semibold leading-7 text-blue-600"
                    >
                        Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
                    >
                        Choose the right plan for your business
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-6 text-lg leading-8 text-gray-600"
                    >
                        Start with our free trial and upgrade as you grow. All plans include our core features.
                    </motion.p>
                </div>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`rounded-3xl p-8 ring-1 ring-gray-200 ${tier.mostPopular ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white'
                                }`}
                        >
                            <h3
                                id={tier.id}
                                className={`text-lg font-semibold leading-8 ${tier.mostPopular ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                {tier.name}
                            </h3>
                            <p className={`mt-4 text-sm leading-6 ${tier.mostPopular ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {tier.description}
                            </p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className={`text-4xl font-bold tracking-tight ${tier.mostPopular ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {tier.price.monthly}
                                </span>
                                <span className={`text-sm font-semibold leading-6 ${tier.mostPopular ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    /month
                                </span>
                            </p>
                            <a
                                href="#"
                                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${tier.mostPopular
                                    ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                                    }`}
                            >
                                {tier.cta}
                            </a>
                            <ul
                                role="list"
                                className={`mt-8 space-y-3 text-sm leading-6 ${tier.mostPopular ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                            >
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <svg
                                            className={`h-6 w-5 flex-none ${tier.mostPopular ? 'text-white' : 'text-blue-600'
                                                }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing; 