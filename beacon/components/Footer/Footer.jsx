const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <a href="/" className="text-sm font-semibold text-gray-400 hover:text-gray-500 transition-colors">
                        Home
                    </a>
                    <a href="/tutorials" className="text-sm font-semibold text-gray-400 hover:text-gray-500 transition-colors">
                        Tutorials
                    </a>
                    <a href="#EMAIL_SEND_FORM" className="text-sm font-semibold text-gray-400 hover:text-gray-500 transition-colors">
                        Launch
                    </a>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                        <img src="https://mailer-6i6.pages.dev/logo.png" alt="Beacon" className="w-6 h-6 rounded" />
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Beacon</span>
                    </div>
                    <p className="text-center text-xs leading-5 text-gray-500 md:text-left">
                        &copy; 2026 Beacon SES Engine. Built by <a href="https://www.djdiptayan.in/" target="_blank" className="text-gray-900 hover:underline">Diptayan Jash</a>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer