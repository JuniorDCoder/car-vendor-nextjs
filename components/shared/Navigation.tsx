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
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#001F3F] border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-14 h-14">
                            <Image
                                src={siteConfig.logo}
                                alt={`${siteConfig.name} logo`}
                                fill
                                sizes="56px"
                                priority
                                className="object-contain rounded-full"
                            />
                        </div>
                        <div className="leading-tight">
                            <span className="block text-lg font-bold tracking-[0.08em] text-white">PREMIER</span>
                            <span className="block text-[10px] font-semibold tracking-[0.3em] text-gray-300">AUTO CENTRE</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-gray-200 hover:text-white transition-colors duration-300 font-medium relative group py-2"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#D32F2F] text-white px-5 py-2.5 rounded-md hover:bg-[#B71C1C] transition-colors duration-300 text-sm font-semibold"
                        >
                            Enquire on WhatsApp
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
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-[#D32F2F] text-white px-6 py-3 rounded-md hover:bg-[#B71C1C] transition-colors duration-300 font-semibold"
                            >
                                Enquire on WhatsApp
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
