const Navbar = () => {
    return (
        <header className="bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm fixed z-50 w-screen">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <a className="block text-teal-600" href="/">
                            <span className="sr-only">Home</span>
                            <img className="h-16" src=" https://mailer-6i6.pages.dev/logo.png" alt="Logo" />
                        </a>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm text-white font-extrabold">
                                <li>
                                    <a className="transition hover:text-blue-500" href="/"> Home </a>
                                </li>

                                <li>
                                    <a className="transition hover:text-blue-500" href="/tutorials"> Tutorials </a>
                                </li>

                                <li>
                                    <a className="transition hover:text-blue-500" href="#EMAIL_SEND_FORM"> Get Started </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
