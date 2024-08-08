import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  // metadataBase: new URL(baseUrl),
  title: "Note Web Project Title",
  description: "Note Web Project Description",
  openGraph: {
    title: 'Note Web Project Title',
    description: 'Note Web Project Description',
    url: 'https://www.note.mobile',
    siteName: 'Note Web Project Site Name',
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
      <body
        className={inter.className}>
        <Navbar />
        <div style={{
          height: '100vh',
          minHeight: '600px',
          display: 'flex',
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {children}
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
