'use client'

import { Inter } from "next/font/google";
import Head from 'next/head'; 
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Information from "./components/Information";
import { AppProvider } from "./context/AppProvider";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}>
        <Head>
          <title>Nesta Note - By Machine Name</title>
        </Head>
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