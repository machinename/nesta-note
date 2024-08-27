'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import {Information} from "./components/information";
import { AppProvider } from "./context/app_provider";
const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   // metadataBase: new URL(baseUrl),
//   title: 'Note File - By Machine Name',
//   description: 'Note File Description',
//   openGraph: {
//     title: 'Note File - By Machine Name',
//     description: 'Note File Description',
//     url: 'https://www.note.mobile',
//     siteName: 'Note File',
//     locale: 'en_US',
//     type: 'website',
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}>
        <AppProvider>
          <Navbar />
          {children}
          <Information />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
