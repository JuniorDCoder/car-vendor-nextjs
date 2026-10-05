'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Star,
    Shield,
    Award,
    Clock,
    Car,
    TrendingUp,
    MapPin,
    Phone,
    Mail,
    Check,
} from 'lucide-react';
import Hero from '@/components/sections/Hero';
import ScreenshotReviews from '@/components/sections/ScreenshotReviews';
import { carService, reviewService, screenshotReviewService, siteSettingsService } from '@/lib/firestore';
import { siteConfig } from '@/lib/site';
import { Car as CarType, Review, ScreenshotReview } from '@/types';

const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: 'easeOut' as const },
};

const reasons = [
    {
        icon: Shield,
        title: 'Quality assured',
        description: 'Every vehicle undergoes a 150-point inspection with full service history verification.',
        features: ['Comprehensive inspection', 'Service history check', 'Mechanical warranty'],
    },
    {
        icon: Award,
        title: 'Trusted service',
        description: 'Rated 4.9 out of 5 by our customers, with dedicated after-sales support.',
        features: ['5-star reviews', 'Dedicated support', 'No-pressure advice'],
    },
    {
        icon: Clock,
        title: 'Straightforward process',
        description: 'From viewing to driving away, we keep buying a car simple and quick.',
        features: ['Same-day viewing', 'Fast paperwork', 'Quick handover'],
    },
    {
        icon: TrendingUp,
        title: 'Fair value',
        description: 'Competitive pricing with flexible finance options available.',
        features: ['Price match promise', 'Finance options', 'Part exchange welcome'],
    },
];

function SectionHeading({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
    return (
        <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D32F2F]">
                <span className="h-px w-8 bg-[#D32F2F]" />
                {eyebrow}
            </p>
            <h2 className={`mt-4 text-3xl md:text-4xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-[#001F3F]'}`}>
                {title}
            </h2>
            {description && (
                <p className={`mt-4 max-w-2xl text-base md:text-lg ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {description}
                </p>
            )}
        </div>
    );
}

export default function Home() {
    const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
    const [allCars, setAllCars] = useState<CarType[]>([]);
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [screenshots, setScreenshots] = useState<ScreenshotReview[]>([]);
    const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>();
    const [heroReady, setHeroReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const stats = {
        happyCustomers: 135,
        soldCars: 89,
        averageRating: 4.9,
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Each source loads independently so one failure doesn't blank the whole page
        const [featuredResult, carsResult, reviewsResult, screenshotsResult, settingsResult] = await Promise.allSettled([
            carService.getFeaturedCars(),
            carService.getCars(50),
            reviewService.getReviews(),
            screenshotReviewService.getPublished(6),
            siteSettingsService.get(),
        ]);

        const available = carsResult.status === 'fulfilled'
            ? carsResult.value.cars.filter(car => car.status === 'available')
            : [];
        const featured = featuredResult.status === 'fulfilled' ? featuredResult.value : [];

        // Use featured cars if available, otherwise the latest available cars
        setFeaturedCars(featured.length > 0 ? featured.slice(0, 6) : available.slice(0, 6));
        setAllCars(available);
        if (reviewsResult.status === 'fulfilled') {
            setRecentReviews(reviewsResult.value.filter(review => review.isApproved).slice(0, 3));
        }
        if (screenshotsResult.status === 'fulfilled') setScreenshots(screenshotsResult.value);
        if (settingsResult.status === 'fulfilled') setHeroImageUrl(settingsResult.value.heroImageUrl || undefined);

        [featuredResult, carsResult, reviewsResult, screenshotsResult, settingsResult]
            .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
            .forEach(result => console.error('Error loading homepage data:', result.reason));

        setHeroReady(true);
        setLoading(false);
    };

    const makes = Array.from(new Set(allCars.map(car => car.make).filter(Boolean))).sort();
    const fuelTypes = Array.from(new Set(allCars.map(car => car.fuelType).filter(Boolean))).sort();
    const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        `Hi ${siteConfig.name}, I'm interested in the cars you have available. Could you send me more information?`
    )}`;

    return (
        <div className="pt-20">
            <Hero
                stats={stats}
                makes={makes}
                fuelTypes={fuelTypes}
                ready={heroReady}
                heroImageUrl={heroImageUrl}
                spotlightCar={featuredCars.find(car => car.images?.length) || allCars.find(car => car.images?.length)}
            />

            {/* Featured Vehicles */}
            <section className="bg-white py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...reveal} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
                        <SectionHeading
                            eyebrow="Our stock"
                            title="Featured vehicles"
                            description="Hand-picked cars, inspected and ready to drive away."
                        />
                        <Link
                            href="/cars"
                            className="inline-flex items-center gap-2 font-semibold text-[#001F3F] hover:text-[#D32F2F] transition-colors"
                        >
                            View all stock <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="rounded-md border border-gray-200">
                                    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 w-2/3 bg-gray-100 animate-pulse rounded" />
                                        <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : featuredCars.length === 0 ? (
                        <div className="rounded-md border border-dashed border-gray-300 py-16 text-center text-gray-600">
                            New stock arriving soon. <Link href="/contact" className="font-semibold text-[#D32F2F]">Get in touch</Link> to hear first.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredCars.map((car, index) => (
                                <motion.div
                                    key={car.id}
                                    {...reveal}
                                    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                                >
                                    <Link
                                        href={`/cars/${car.id}`}
                                        className="group block overflow-hidden rounded-md border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            {car.images && car.images.length > 0 ? (
                                                <Image
                                                    src={car.images[0]}
                                                    alt={`${car.year} ${car.make} ${car.model}`}
                                                    fill
                                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Car className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            {car.status !== 'available' && (
                                                <span className="absolute left-3 top-3 rounded-sm bg-[#001F3F] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                                    {car.status}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{car.year}</p>
                                            <h3 className="mt-1 text-lg font-semibold text-[#001F3F] group-hover:text-[#D32F2F] transition-colors">
                                                {car.make} {car.model}
                                            </h3>
                                            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                                {car.mileage != null && <li>{car.mileage.toLocaleString()} miles</li>}
                                                {car.fuelType && <li>{car.fuelType}</li>}
                                                {car.transmission && <li>{car.transmission}</li>}
                                            </ul>
                                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                                                <span className="text-2xl font-semibold text-[#001F3F]">
                                                    £{car.price?.toLocaleString()}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#D32F2F]">
                                                    View details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-[#F5F6F8] py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...reveal} className="mb-12">
                        <SectionHeading
                            eyebrow={`Why ${siteConfig.name}`}
                            title="Buying a car should feel straightforward."
                            description="We built our reputation on quality vehicles, clear pricing and treating every customer the way we'd want to be treated."
                        />
                    </motion.div>

                    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200 md:grid-cols-2 lg:grid-cols-4">
                        {reasons.map(({ icon: Icon, title, description, features }) => (
                            <motion.div key={title} {...reveal} className="bg-white p-8">
                                <Icon className="h-7 w-7 text-[#D32F2F]" strokeWidth={1.5} />
                                <h3 className="mt-6 text-lg font-semibold text-[#001F3F]">{title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-gray-600">{description}</p>
                                <ul className="mt-6 space-y-2">
                                    {features.map((item) => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                            <Check className="h-4 w-4 text-[#001F3F]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="bg-white py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...reveal} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
                        <SectionHeading eyebrow="Reviews" title="What our customers say" />
                        <div className="flex items-center gap-3">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-[#F5B301] text-[#F5B301]" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-[#001F3F]">{stats.averageRating}</span> average from {stats.happyCustomers}+ customers
                            </p>
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="h-56 rounded-md border border-gray-200 bg-gray-50 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                        {screenshots.length > 0 && (
                            <div className={recentReviews.length > 0 ? 'mb-10' : ''}>
                                <ScreenshotReviews reviews={screenshots} />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentReviews.map((review) => (
                                <motion.figure
                                    key={review.id}
                                    {...reveal}
                                    className="flex flex-col rounded-md border border-gray-200 p-8"
                                >
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? 'fill-[#F5B301] text-[#F5B301]' : 'fill-gray-200 text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <blockquote className="mt-5 flex-1 text-gray-700 leading-relaxed">
                                        &ldquo;{review.comment}&rdquo;
                                    </blockquote>
                                    <figcaption className="mt-6 border-t border-gray-100 pt-4 text-sm font-semibold text-[#001F3F]">
                                        {review.customerName}
                                    </figcaption>
                                </motion.figure>
                            ))}
                        </div>
                        </>
                    )}

                    <div className="mt-10">
                        <Link
                            href="/reviews"
                            className="inline-flex items-center gap-2 font-semibold text-[#001F3F] hover:text-[#D32F2F] transition-colors"
                        >
                            Read all reviews <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-[#001F3F] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid gap-12 lg:grid-cols-2 lg:items-center">
                    <motion.div {...reveal}>
                        <SectionHeading
                            dark
                            eyebrow="Visit us"
                            title="Come and see the cars in person."
                            description={`Drop in to our ${siteConfig.location} showroom or get in touch to arrange a viewing and test drive at a time that suits you.`}
                        />
                        <div className="mt-10 flex flex-col sm:flex-row gap-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D32F2F] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#B71C1C]"
                            >
                                <Phone className="h-4 w-4" />
                                Message us on WhatsApp
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white hover:text-[#001F3F]"
                            >
                                <Mail className="h-4 w-4" />
                                Send an enquiry
                            </Link>
                        </div>
                    </motion.div>

                    <motion.dl {...reveal} className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2">
                        <div className="bg-[#001F3F] p-6 sm:col-span-2">
                            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                                <MapPin className="h-4 w-4 text-[#D32F2F]" /> Showroom
                            </dt>
                            <dd className="mt-2 text-white">
                                The Car Showroom, St John&apos;s Rd, Meadowfield, Durham DH7 8XL
                            </dd>
                        </div>
                        <div className="bg-[#001F3F] p-6">
                            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                                <Clock className="h-4 w-4 text-[#D32F2F]" /> Opening hours
                            </dt>
                            <dd className="mt-2 space-y-1 text-sm text-gray-200">
                                <p>Mon – Fri: 9:00 – 18:00</p>
                                <p>Saturday: 10:00 – 17:00</p>
                                <p>Sunday: 11:00 – 16:00</p>
                            </dd>
                        </div>
                        <div className="bg-[#001F3F] p-6">
                            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                                <Car className="h-4 w-4 text-[#D32F2F]" /> Test drives
                            </dt>
                            <dd className="mt-2 text-sm text-gray-200">
                                Free test drives on all vehicles. Book ahead and we&apos;ll have the car ready.
                            </dd>
                        </div>
                    </motion.dl>
                </div>
            </section>
        </div>
    );
}
