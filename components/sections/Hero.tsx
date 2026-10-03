'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, BadgeCheck, CreditCard, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/lib/site';

interface HeroProps {
    stats: {
        happyCustomers: number;
        soldCars: number;
        averageRating: number;
        availableCars: number;
    };
}

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number = 0) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, delay: 0.15 * i, ease: easeOut },
    }),
};

const promises = [
    { icon: ShieldCheck, label: '150-point inspection' },
    { icon: BadgeCheck, label: 'Warranty options' },
    { icon: CreditCard, label: 'Finance & part exchange' },
];

export default function Hero({ stats }: HeroProps) {
    const { scrollY } = useScroll();
    const imageY = useTransform(scrollY, [0, 600], [0, 120]);
    const contentY = useTransform(scrollY, [0, 600], [0, -60]);
    const contentOpacity = useTransform(scrollY, [0, 450], [1, 0]);

    const statItems = [
        { value: `${stats.happyCustomers}+`, label: 'Happy Customers' },
        { value: `${stats.soldCars}+`, label: 'Cars Sold' },
        { value: stats.averageRating.toFixed(1), label: 'Customer Rating', star: true },
        { value: `${stats.availableCars}+`, label: 'Available Now' },
    ];

    return (
        <section className="relative isolate min-h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-[#001F3F]">
            {/* Background photograph with slow zoom + parallax */}
            <motion.div className="absolute inset-0 -z-20" style={{ y: imageY }}>
                <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.4, ease: easeOut }}
                >
                    <Image
                        src={siteConfig.heroImage}
                        alt="Luxury car at the Premier Auto Centre showroom"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-[70%_center]"
                    />
                </motion.div>
            </motion.div>

            {/* Colour grading: brand navy from the left, deep shadow at the top, soft fade into the page below */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#001F3F] via-[#001F3F]/85 to-[#001F3F]/20" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#000d1a]/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 -z-10 bg-gradient-to-t from-[#001F3F] to-transparent" />

            {/* Brand accents echoing the logo's speed lines and red ring */}
            <div className="pointer-events-none absolute -left-40 top-1/3 h-[32rem] w-[32rem] -z-10 rounded-full bg-[#D32F2F]/20 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
                <motion.span
                    className="absolute right-[8%] top-[22%] h-px w-64 bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent"
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.9 }}
                    transition={{ duration: 1.4, delay: 0.6 }}
                />
                <motion.span
                    className="absolute right-[14%] top-[26%] h-px w-40 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.7 }}
                    transition={{ duration: 1.4, delay: 0.8 }}
                />
            </div>

            {/* Main content */}
            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative flex-1 flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-20"
            >
                <motion.div initial="hidden" animate="visible" className="max-w-2xl">
                    <motion.div
                        variants={fadeUp}
                        custom={0}
                        className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 backdrop-blur-md"
                    >
                        <Image
                            src={siteConfig.logo}
                            alt=""
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                        <span className="text-xs sm:text-sm font-medium tracking-wide text-white/90">
                            {siteConfig.location}&apos;s trusted dealership since 2018
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white"
                    >
                        Drive Your Dream,
                        <span className="block bg-gradient-to-r from-[#FF4D4D] via-[#D32F2F] to-[#ff8a80] bg-clip-text text-transparent">
                            Today.
                        </span>
                    </motion.h1>

                    <motion.div variants={fadeUp} custom={2} className="mt-6 flex items-center gap-4">
                        <span className="h-px w-12 bg-[#D32F2F]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C0C0C0]">
                            {siteConfig.name}
                        </span>
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        custom={3}
                        className="mt-6 text-lg sm:text-xl leading-relaxed text-[#C0C0C0] max-w-xl"
                    >
                        Hand-picked, premium used cars in {siteConfig.location}. From executive saloons to family
                        SUVs, every vehicle is inspected, prepared and backed by people who care.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        className="mt-10 flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/cars"
                            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#D32F2F] px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_40px_-10px_rgba(211,47,47,0.8)] transition-all duration-300 hover:bg-[#B71C1C] hover:-translate-y-0.5"
                        >
                            <span className="relative z-10">Browse Our Collection</span>
                            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            <span className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/15"
                        >
                            Book a Test Drive
                        </Link>
                    </motion.div>

                    <motion.ul
                        variants={fadeUp}
                        custom={5}
                        className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
                    >
                        {promises.map(({ icon: Icon, label }) => (
                            <li key={label} className="flex items-center gap-2 text-sm text-white/80">
                                <Icon className="h-4 w-4 text-[#D32F2F]" />
                                {label}
                            </li>
                        ))}
                    </motion.ul>
                </motion.div>
            </motion.div>

            {/* Stats bar — glass panel anchored to the bottom of the hero */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.9, ease: easeOut }}
                className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl md:divide-x">
                    {statItems.map((stat) => (
                        <div key={stat.label} className="px-6 py-5 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-1.5">
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                                {stat.star && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
                            </div>
                            <div className="mt-1 text-xs font-medium uppercase tracking-widest text-[#C0C0C0]">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <motion.div
                    className="mt-6 hidden sm:flex justify-center"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown className="h-6 w-6 text-white/50" aria-hidden />
                </motion.div>
            </motion.div>

            {/* Curved edge that flows seamlessly into the white section below */}
            <svg
                className="absolute inset-x-0 bottom-0 h-12 sm:h-16 w-full text-white"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                aria-hidden
            >
                <path fill="currentColor" d="M0,80 L0,48 C240,8 480,0 720,16 C960,32 1200,64 1440,40 L1440,80 Z" />
            </svg>
        </section>
    );
}
