import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar2 from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Beacon - Simplifying Mass Mailing",
  description: "Beacon offers user-friendly, scalable mass mailing solutions designed to boost your marketing efforts and reach your audience effectively.",
  metadataBase: new URL("https://beacon.djdiptayan.in/"),
  openGraph: {
    title: "Beacon - Simplifying Mass Mailing",
    description: "Beacon offers user-friendly, scalable mass mailing solutions designed to boost your marketing efforts and reach your audience effectively.",
    url: "https://beacon.djdiptayan.in/",
    siteName: "Beacon",
    images: [
      {
        url: "/favicon.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
    ],
    apple: [
      { url: "/favicon.png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://beacon.djdiptayan.in/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar2 />
        {children}
        <Footer />
      </body>
    </html>
  );
}