'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  // Car detail pages have their own WhatsApp action bar on mobile, so hide this there
  const pathname = usePathname();
  const onCarPage = /^\/cars\/[^/]+/.test(pathname || '');
  const phoneNumber = '447412800685';
  const message = 'Hello! I\'m interested in learning more about your cars.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${onCarPage ? 'hidden lg:block bottom-6' : 'bottom-6'} right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
      <span className="sr-only">Contact us on WhatsApp</span>
    </motion.a>
  );
}
