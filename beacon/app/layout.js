import Head from 'next/head';
import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar2 from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Beacon - Simplifying Mass Mailing",
  description: "Beacon offers user-friendly, scalable mass mailing solutions designed to boost your marketing efforts and reach your audience effectively.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://mailer-6i6.pages.dev/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://mailer-6i6.pages.dev/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://mailer-6i6.pages.dev/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="https://mailer-6i6.pages.dev/logo.png" />
        <meta property="og:url" content="https://beacon.djdiptayan.in/" />
        <meta property="og:site_name" content="Beacon" />
        <link rel="canonical" href="https://beacon.djdiptayan.in/" />
      </Head>
      <body className={inter.className}>
        <Navbar2 />
        {children}
        <Footer />
      </body>
    </html>
  );
}
