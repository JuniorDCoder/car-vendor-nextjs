import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import JivoChat from '@/components/shared/JivoChat';
import {Providers} from "@/app/providers";
import Script from "next/script";
import { siteConfig } from "@/lib/site";

const inter = Inter({ subsets: ['latin'] });

const description =
  'Premier Auto Centre — premium quality used cars in Durham, UK. Browse our hand-picked selection of BMW, Mercedes, Audi and more. Trusted by over 135 happy customers.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000'),
  title: {
    default: `${siteConfig.name} - Drive Your Dream, Today`,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  applicationName: siteConfig.name,
  openGraph: {
    title: `${siteConfig.name} - Drive Your Dream, Today`,
    description,
    siteName: siteConfig.name,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: siteConfig.name }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Drive Your Dream, Today`,
    description,
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      	{/* Google Ads Tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17634261946"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17634261946');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
            <Providers>{children}</Providers>
        </main>
        <Footer />
        <WhatsAppButton />
        <JivoChat />
      </body>
    </html>
  );
}
