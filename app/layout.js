import Header from "./components/Header";
import Information from "./components/Information";
import ProviderWrapper from "./providers/ProviderWrapper";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.nestanote.com"),
  title: 'Nesta Note',
  description: 'An easy to use note-taking app with the ability to create notes within notes.',
  openGraph: {
    title: 'Nesta Note',
    description: 'An easy to note-taking app with the ability to create notes within notes.',
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
      <body>
        <ProviderWrapper>
          <Header />
          {children}
          <Information />
        </ ProviderWrapper>
        <footer>
          <p>&copy; {new Date().getFullYear()} Machine Name. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
