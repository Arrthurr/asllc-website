import type { Metadata } from 'next';
import ScrollToTop from '@/components/ScrollToTop';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Arturo Solo LLC — Working AI, built into your business',
    template: '%s | Arturo Solo LLC',
  },
  description:
    'Founder-led AI build studio for small businesses. I build working AI systems into the way your team already operates — not decks, not demos.',
  keywords: [
    'AI build studio',
    'AI Jumpstart',
    'custom AI',
    'small business automation',
    'working AI',
    'Arturo Solo',
  ],
  authors: [{ name: 'Arthur Turnbull', url: 'https://arturosolo.com' }],
  creator: 'Arturo Solo LLC',
  publisher: 'Arturo Solo LLC',
  metadataBase: new URL('https://arturosolo.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arturosolo.com',
    siteName: 'Arturo Solo LLC',
    title: 'Arturo Solo LLC — Working AI, built into your business',
    description:
      'Founder-led AI build studio for small businesses. Working systems, not decks or demos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arturo Solo LLC — Working AI, built into your business',
    description:
      'Founder-led AI build studio for small businesses. Working systems, not decks or demos.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
