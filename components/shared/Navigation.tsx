'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Browse Cars' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#001F3F]/95 backdrop-blur-sm border-b border-[#C0C0C0]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Car className="w-8 h-8 text-[#D32F2F]" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">Paul's Auto</h1>
              <p className="text-xs text-[#C0C0C0]">Car Sales</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#D32F2F] transition-colors duration-300 font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <a
              href="tel:+447868364455"
              className="bg-[#D32F2F] text-white px-6 py-2 rounded-full hover:bg-[#B71C1C] transition-colors duration-300 font-semibold"
            >
              Call Now
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#001F3F] border-t border-[#C0C0C0]/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-white hover:text-[#D32F2F] transition-colors duration-300 font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+447868364455"
                className="block w-full text-center bg-[#D32F2F] text-white px-6 py-3 rounded-full hover:bg-[#B71C1C] transition-colors duration-300 font-semibold"
              >
                Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
