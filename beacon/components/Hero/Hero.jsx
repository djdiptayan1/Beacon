import React from 'react'

const Hero = () => {
    return (
        <section
            className="relative bg-[url(https://mailer-6i6.pages.dev/HERO.jpg)] bg-cover bg-center bg-no-repeat"
        >
            <div
                className="absolute inset-0 bg-white/75 sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"
            ></div>

            <div
                className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex h-screen lg:items-center lg:px-8"
            >
                <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                    <h1 className="text-3xl font-extrabold sm:text-5xl text-blue-900">
                        Reach Your Audience

                        <strong className="block font-extrabold text-rose-700">Effortlessly.</strong>
                    </h1>

                    <p className="mt-4 max-w-lg sm:text-xl/relaxed text-blue-700 font-semibold">
                        Empower your business with our cutting-edge mass email sending platform. Connect, engage, and grow your audience with ease.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 text-center">
                        <a
                            href="#EMAIL_SEND_FORM"
                            className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                        >
                            Start Sending
                        </a>

                        <a
                            href="/tutorials"
                            className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

            </div>
        </section>
    )
}
export default Hero