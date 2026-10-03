'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/lib/site';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Browse Cars' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    // WhatsApp message template
    const whatsappMessage = encodeURIComponent(
        `Hi ${siteConfig.name}! I'm interested in learning more about your available cars.`
    );
    const whatsappNumber = siteConfig.whatsappNumber; // Phone number without + or spaces
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#001F3F]/95 backdrop-blur-sm border-b border-[#C0C0C0]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="relative w-14 h-14 rounded-full ring-2 ring-[#D32F2F]/40 shadow-lg shadow-black/30"
                        >
                            <Image
                                src={siteConfig.logo}
                                alt={`${siteConfig.name} logo`}
                                fill
                                sizes="56px"
                                priority
                                className="object-contain rounded-full"
                            />
                        </motion.div>
                        <div className="leading-tight">
                            <span className="block text-xl font-extrabold tracking-wide text-white">PREMIER</span>
                            <span className="block text-[11px] font-semibold tracking-[0.25em] text-[#D32F2F]">AUTO CENTRE</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-white hover:text-[#FF5A5A] transition-colors duration-300 font-medium relative group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#10B981] text-white px-6 py-2 rounded-full hover:bg-[#059669] transition-colors duration-300 font-semibold"
                        >
                            WhatsApp Us
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
                                    className="block text-white hover:text-[#FF5A5A] transition-colors duration-300 font-medium py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-[#10B981] text-white px-6 py-3 rounded-full hover:bg-[#059669] transition-colors duration-300 font-semibold"
                            >
                                WhatsApp Us
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
