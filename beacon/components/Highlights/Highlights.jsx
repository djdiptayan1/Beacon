import React from 'react';

const Highlights = () => {
    return (
        <section className="bg-gray-900 text-white">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-lg text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl">Transform Your Email Marketing</h2>

                    <p className="mt-4 text-gray-300">
                        Take your email campaigns to the next level with our powerful mass email sending platform. Reach your audience with personalized messages, and track your performance with in-depth analytics.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >

                        <h2 className="mt-4 text-xl font-bold text-white">Personalized Campaigns</h2>

                        <p className="mt-1 text-sm text-gray-300">
                            Create tailored email campaigns to engage your audience with targeted messaging, helping you achieve better results.
                        </p>
                    </div>

                    <div
                        className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >

                        <h2 className="mt-4 text-xl font-bold text-white">Effortless Automation</h2>

                        <p className="mt-1 text-sm text-gray-300">
                            Automate your email campaigns with ease, and save time while maintaining consistent communication with your audience.
                        </p>
                    </div>

                    <div
                        className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >

                        <h2 className="mt-4 text-xl font-bold text-white">Email Deliverability</h2>

                        <p className="mt-1 text-sm text-gray-300">
                            Improve your email deliverability and ensure your messages reach the inbox, not the spam folder.
                        </p>
                    </div>

                    <div
                        className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >

                        <h2 className="mt-4 text-xl font-bold text-white">Upload CVs / Excel Files</h2>
                        <p className="mt-1 text-sm text-gray-300">
                            Easily upload your CVs or Excel files to manage and organize your data. Take control of your information for seamless integration into your projects.
                        </p>
                    </div>

                    <div
                        className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
                        href="#"
                    >

                        <h2 className="mt-4 text-xl font-bold text-white">Upload HTML Templates</h2>
                        <p className="mt-1 text-sm text-gray-300">
                            Quickly upload your HTML templates to streamline your web design projects. Integrate your designs effortlessly and boost your productivity.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="#"
                        className="inline-block rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Highlights;