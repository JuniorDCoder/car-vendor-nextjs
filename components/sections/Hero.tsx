'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, Star } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { Car } from '@/types';

interface HeroProps {
    stats: {
        happyCustomers: number;
        soldCars: number;
        averageRating: number;
    };
    makes: string[];
    fuelTypes: string[];
    // False until homepage data has loaded, so no placeholder photo flashes first
    ready: boolean;
    // Photo uploaded by the admin (Admin → Homepage Photo)
    heroImageUrl?: string;
    // A car in stock, used as the photo when no homepage photo has been uploaded
    spotlightCar?: Car;
}

const priceOptions = [5000, 10000, 15000, 20000, 30000, 40000, 50000, 75000];

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export default function Hero({ stats, makes, fuelTypes, ready, heroImageUrl, spotlightCar }: HeroProps) {
    const router = useRouter();
    const [search, setSearch] = useState({ make: '', fuelType: '', maxPrice: '' });
    const [imageFailed, setImageFailed] = useState(false);

    // Real photos only: the admin's uploaded photo first, otherwise a car currently in stock
    const showSpotlight = !heroImageUrl && !!spotlightCar;
    const photoUrl = heroImageUrl || spotlightCar?.images?.[0];

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.entries(search).forEach(([key, value]) => value && params.set(key, value));
        const query = params.toString();
        router.push(query ? `/cars/?${query}` : '/cars/');
    };

    const selectClass =
        'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#001F3F] focus:outline-none focus:ring-1 focus:ring-[#001F3F]';

    return (
        <section className="bg-white">
            <div className="grid lg:grid-cols-12 lg:min-h-[640px] lg:h-[calc(100vh-5rem)] lg:max-h-[820px]">
                {/* Photograph */}
                <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-7 lg:order-2 bg-[#0B2A4A]">
                    {ready && photoUrl && !imageFailed ? (
                        <Image
                            key={photoUrl}
                            src={photoUrl}
                            alt={
                                showSpotlight && spotlightCar
                                    ? `${spotlightCar.year} ${spotlightCar.make} ${spotlightCar.model} in stock at ${siteConfig.name}`
                                    : `${siteConfig.name} showroom`
                            }
                            fill
                            priority
                            sizes="(min-width: 1024px) 58vw, 100vw"
                            className="object-cover"
                            onError={() => setImageFailed(true)}
                            data-testid="hero-photo"
                        />
                    ) : ready ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src={siteConfig.logo}
                                alt={siteConfig.name}
                                width={280}
                                height={280}
                                className="w-40 sm:w-56 lg:w-72 h-auto opacity-90"
                            />
                        </div>
                    ) : null}

                    {ready && (showSpotlight && spotlightCar && !imageFailed ? (
                        <motion.div {...fadeIn(0.2)} className="absolute bottom-6 left-6 right-6 sm:right-auto lg:bottom-24">
                            <Link
                                href={`/cars/${spotlightCar.id}`}
                                className="group flex items-center gap-4 rounded-md bg-white px-5 py-4 shadow-lg"
                            >
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#D32F2F]">In stock now</p>
                                    <p className="mt-0.5 font-semibold text-[#001F3F]">
                                        {spotlightCar.year} {spotlightCar.make} {spotlightCar.model}
                                    </p>
                                    {spotlightCar.price ? (
                                        <p className="text-sm text-gray-600">£{spotlightCar.price.toLocaleString()}</p>
                                    ) : null}
                                </div>
                                <ArrowRight className="h-5 w-5 text-[#001F3F] transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            {...fadeIn(0.2)}
                            className="absolute bottom-6 left-6 hidden sm:flex items-start gap-3 rounded-md bg-white px-5 py-4 shadow-lg lg:bottom-24"
                        >
                            <MapPin className="mt-0.5 h-5 w-5 text-[#D32F2F]" />
                            <div>
                                <p className="text-sm font-semibold text-[#001F3F]">Visit our showroom</p>
                                <p className="text-sm text-gray-600">St John&apos;s Rd, Meadowfield, Durham</p>
                                <p className="mt-1 text-xs text-gray-500">Open 7 days a week</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Copy */}
                <div className="lg:col-span-5 lg:order-1 bg-[#001F3F] text-white flex items-center">
                    <div className="w-full px-6 py-14 sm:px-10 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12 lg:pb-28">
                        <motion.p
                            {...fadeIn(0)}
                            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300"
                        >
                            <span className="h-px w-8 bg-[#D32F2F]" />
                            {siteConfig.location} &middot; Since 2018
                        </motion.p>

                        <motion.h1
                            {...fadeIn(0.1)}
                            className="mt-6 text-4xl sm:text-5xl xl:text-6xl font-semibold leading-[1.1] tracking-tight"
                        >
                            Quality used cars, sold the honest way.
                        </motion.h1>

                        <motion.p {...fadeIn(0.2)} className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-gray-300">
                            Every car at {siteConfig.name} is hand-selected, inspected and prepared before it
                            reaches our forecourt, so you can buy with complete confidence.
                        </motion.p>

                        <motion.div {...fadeIn(0.3)} className="mt-10 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/cars"
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D32F2F] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#B71C1C]"
                            >
                                View our stock
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-md border border-white/40 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white hover:text-[#001F3F]"
                            >
                                Book a test drive
                            </Link>
                        </motion.div>

                        <motion.dl
                            {...fadeIn(0.4)}
                            className="mt-12 grid grid-cols-3 border-t border-white/15 pt-6"
                        >
                            <div>
                                <dt className="sr-only">Customer rating</dt>
                                <dd className="flex items-center gap-1 text-2xl font-semibold">
                                    {stats.averageRating.toFixed(1)}
                                    <Star className="h-4 w-4 fill-[#F5B301] text-[#F5B301]" />
                                </dd>
                                <dd className="mt-1 text-xs text-gray-400">Customer rating</dd>
                            </div>
                            <div className="border-l border-white/15 pl-5">
                                <dt className="sr-only">Happy customers</dt>
                                <dd className="text-2xl font-semibold">{stats.happyCustomers}+</dd>
                                <dd className="mt-1 text-xs text-gray-400">Happy customers</dd>
                            </div>
                            <div className="border-l border-white/15 pl-5">
                                <dt className="sr-only">Cars sold</dt>
                                <dd className="text-2xl font-semibold">{stats.soldCars}+</dd>
                                <dd className="mt-1 text-xs text-gray-400">Cars sold</dd>
                            </div>
                        </motion.dl>
                    </div>
                </div>
            </div>

            {/* Quick search */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-0 lg:-mt-16">
                <motion.form
                    {...fadeIn(0.5)}
                    onSubmit={handleSearch}
                    className="grid gap-3 rounded-md border border-gray-200 bg-white p-5 shadow-xl shadow-gray-900/5 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:items-center lg:p-6"
                >
                    <p className="text-sm font-semibold text-[#001F3F] sm:col-span-2 lg:col-span-1 lg:pr-4">
                        Find your next car
                    </p>
                    <select
                        aria-label="Make"
                        className={selectClass}
                        value={search.make}
                        onChange={(e) => setSearch((s) => ({ ...s, make: e.target.value }))}
                    >
                        <option value="">Any make</option>
                        {makes.map((make) => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                    </select>
                    <select
                        aria-label="Fuel type"
                        className={selectClass}
                        value={search.fuelType}
                        onChange={(e) => setSearch((s) => ({ ...s, fuelType: e.target.value }))}
                    >
                        <option value="">Any fuel type</option>
                        {fuelTypes.map((fuel) => (
                            <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                    </select>
                    <select
                        aria-label="Maximum price"
                        className={selectClass}
                        value={search.maxPrice}
                        onChange={(e) => setSearch((s) => ({ ...s, maxPrice: e.target.value }))}
                    >
                        <option value="">No max price</option>
                        {priceOptions.map((price) => (
                            <option key={price} value={price}>Up to £{price.toLocaleString()}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#001F3F] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0A2E55] sm:col-span-2 lg:col-span-1"
                    >
                        <Search className="h-4 w-4" />
                        Search stock
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
