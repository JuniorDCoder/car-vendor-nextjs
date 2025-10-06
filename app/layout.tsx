import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import JivoChat from '@/components/shared/JivoChat';
import {Providers} from "@/app/providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Paul's Auto Car Sales - Drive Your Dream, Today",
  description: 'Premium quality used cars in London, UK. Browse our selection of luxury vehicles including BMW, Mercedes, Audi, and more. Trusted by over 135 happy customers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
