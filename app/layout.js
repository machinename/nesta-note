import { Inter } from "next/font/google";
import Navbar from "./components/Header";
import Footer from "./components/Footer";
import Information from "./components/Information";
import ProviderWrapper from "./providers/ProviderWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://www.nestanote.com"),
  title: 'Nesta Note',
  description: 'A note-taking app inspired by Google Keep with the ability to create notes within notes.',
  openGraph: {
    title: 'Nesta Note',
    description: 'A note-taking app inspired by Google Keep with the ability to create notes within notes.',
    url: 'https://www.nestanote.com',
    siteName: 'Nesta Note',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <ProviderWrapper>
          <Navbar />
          {children}
          <Information />
          <Footer />
        </ ProviderWrapper>
      </body>
    </html>
  );
}
