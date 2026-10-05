'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/site';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Fuel,
    Gauge,
    Loader,
    Mail,
    MapPin,
    MessageCircle,
    Settings,
    ShieldCheck,
    Star,
} from 'lucide-react';
import { reviewService } from '@/lib/firestore';
import { Car, Review } from '@/types';
import toast from 'react-hot-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CarDetailClientProps {
    car: Car;
}

const capitalise = (value?: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : '—');

// Firestore returns Timestamps; older code paths may hold plain Dates
function formatReviewDate(value: unknown): string | null {
    if (!value) return null;
    const date =
        value instanceof Date
            ? value
            : typeof (value as { seconds?: number }).seconds === 'number'
                ? new Date((value as { seconds: number }).seconds * 1000)
                : null;
    return date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
}

const statusStyles: Record<Car['status'], string> = {
    available: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
    pending: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
    sold: 'bg-red-500/15 text-red-300 ring-red-400/30',
};

export default function CarDetailClient({ car }: CarDetailClientProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [notificationsSupported, setNotificationsSupported] = useState(false);

    const images = car.images || [];
    const carName = `${car.make} ${car.model}`;
    const isAvailable = car.status === 'available';

    useEffect(() => {
        loadReviews();

        setNotificationsSupported('Notification' in window);
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [car.id]);

    const loadReviews = async () => {
        try {
            setLoadingReviews(true);
            setReviews(await reviewService.getReviewsByCarId(car.id!));
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { icon: '/favicon.ico', badge: '/favicon.ico', ...options });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'carInquiries'), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                carId: car.id,
                carDetails: { make: car.make, model: car.model, year: car.year, price: car.price },
                status: 'new',
                read: false,
                createdAt: serverTimestamp(),
            });

            console.log('New car inquiry:', { car: carName, customer: formData.name, email: formData.email });
            if (notificationsSupported) {
                sendBrowserNotification('Enquiry sent', { body: `We'll contact you about the ${carName}` });
            }

            toast.success('Enquiry sent! We will contact you shortly.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error sending inquiry:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const whatsappUrl = (message: string) =>
        `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    const paymentLink = whatsappUrl(
        `Hello! I'm interested in the ${carName} (${car.year}) for £${car.price?.toLocaleString()}.\n\nI would like to proceed with payment. Could you please provide me with the payment details and process?\n\nThank you!`
    );
    const enquiryLink = whatsappUrl(
        `Hello! I'm interested in the ${car.year} ${carName} listed at £${car.price?.toLocaleString()}. Is it still available?`
    );

    const showImage = (index: number) => setSelectedImage((index + images.length) % images.length);

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    const keySpecs = [
        { icon: Calendar, label: 'Year', value: String(car.year) },
        { icon: Gauge, label: 'Mileage', value: car.mileage != null ? `${car.mileage.toLocaleString()} mi` : '—' },
        { icon: Fuel, label: 'Fuel', value: capitalise(car.fuelType) },
        { icon: Settings, label: 'Gearbox', value: capitalise(car.transmission) },
    ];

    const specRows = [
        ['Make', car.make],
        ['Model', car.model],
        ['Year', String(car.year)],
        ['Mileage', car.mileage != null ? `${car.mileage.toLocaleString()} miles` : '—'],
        ['Fuel type', capitalise(car.fuelType)],
        ['Transmission', capitalise(car.transmission)],
        ['Body type', capitalise(car.bodyType)],
        ['Colour', car.color || '—'],
    ];

    const inputClass =
        'w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#001F3F] focus:outline-none focus:ring-1 focus:ring-[#001F3F]';

    return (
        <div className="pt-20 min-h-screen bg-[#F3F5F8] pb-24 lg:pb-0">
            {/* Top: dark steel-navy band echoing the logo badge */}
            <section className="bg-[#0B1A2E] text-white border-b-2 border-[#D32F2F]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:pb-14">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
                        <Link href="/cars" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" /> All cars
                        </Link>
                        <span aria-hidden>/</span>
                        <span className="truncate text-slate-200">{car.year} {carName}</span>
                    </nav>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        {/* Gallery */}
                        <div className="lg:col-span-7">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#13253D] ring-1 ring-white/10">
                                {images.length > 0 ? (
                                    <Image
                                        src={images[selectedImage]}
                                        alt={`${car.year} ${carName}, photo ${selectedImage + 1}`}
                                        fill
                                        priority
                                        sizes="(min-width: 1024px) 58vw, 100vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-400">No photos available</div>
                                )}

                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => showImage(selectedImage - 1)}
                                            aria-label="Previous photo"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => showImage(selectedImage + 1)}
                                            aria-label="Next photo"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                        <span className="absolute bottom-3 right-3 rounded-sm bg-black/60 px-2 py-1 text-xs font-medium">
                                            {selectedImage + 1} / {images.length}
                                        </span>
                                    </>
                                )}
                                {car.isFeatured && (
                                    <span className="absolute left-3 top-3 rounded-sm bg-[#D32F2F] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedImage(index)}
                                            aria-label={`Show photo ${index + 1}`}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-sm transition ${
                                                selectedImage === index
                                                    ? 'ring-2 ring-[#D32F2F]'
                                                    : 'opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <Image src={image} alt="" fill sizes="96px" className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-5 flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className={`rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${statusStyles[car.status] || statusStyles.available}`}>
                                    {capitalise(car.status)}
                                </span>
                                <span className="text-sm text-slate-400">{capitalise(car.bodyType)} · {car.color}</span>
                            </div>

                            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                                {carName}
                            </h1>
                            <p className="mt-1 text-slate-400">{car.year}</p>

                            <div className="mt-6 border-t border-white/10 pt-6">
                                <p className="text-sm text-slate-400">Price</p>
                                <p className="text-4xl sm:text-5xl font-semibold">£{car.price?.toLocaleString()}</p>
                                {car.downPayment && car.downPayment > 0 ? (
                                    <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10 text-sm">
                                        <div className="bg-[#13253D] p-3">
                                            <p className="text-slate-400">Deposit</p>
                                            <p className="mt-0.5 font-semibold">
                                                £{car.downPayment.toLocaleString()}{' '}
                                                <span className="font-normal text-slate-400">
                                                    ({Math.round((car.downPayment / car.price) * 100)}%)
                                                </span>
                                            </p>
                                        </div>
                                        <div className="bg-[#13253D] p-3">
                                            <p className="text-slate-400">Balance on delivery</p>
                                            <p className="mt-0.5 font-semibold">£{(car.price - car.downPayment).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-px overflow-hidden rounded-md bg-white/10">
                                {keySpecs.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-[#13253D] p-3">
                                        <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <Icon className="h-3.5 w-3.5 text-[#D32F2F]" /> {label}
                                        </dt>
                                        <dd className="mt-1 text-sm font-semibold">{value}</dd>
                                    </div>
                                ))}
                            </dl>

                            {isAvailable ? (
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <a
                                        href={paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D32F2F] px-5 py-3.5 font-semibold transition-colors hover:bg-[#B71C1C]"
                                    >
                                        <CreditCard className="h-5 w-5" /> Reserve this car
                                    </a>
                                    <a
                                        href={enquiryLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3.5 font-semibold transition-colors hover:bg-white hover:text-[#0B1A2E]"
                                    >
                                        <MessageCircle className="h-5 w-5" /> WhatsApp us
                                    </a>
                                </div>
                            ) : (
                                <div className="mt-6 rounded-md bg-white/5 p-4 ring-1 ring-white/10">
                                    <p className="font-semibold">
                                        {car.status === 'sold' ? 'This vehicle has been sold' : 'This vehicle is reserved'}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        We may have something similar. <Link href="/cars" className="text-white underline underline-offset-2">Browse our stock</Link> or get in touch.
                                    </p>
                                </div>
                            )}

                            <ul className="mt-6 space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#D32F2F]" /> 150-point inspection and history check</li>
                                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#D32F2F]" /> View and test drive at our {siteConfig.location} showroom</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="rounded-md border border-gray-200 bg-white p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-[#001F3F]">Specification</h2>
                        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                            {specRows.map(([label, value]) => (
                                <div key={label} className="flex justify-between border-b border-gray-100 py-3 text-sm">
                                    <dt className="text-gray-500">{label}</dt>
                                    <dd className="font-medium text-[#001F3F]">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {car.description && (
                        <section className="rounded-md border border-gray-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-[#001F3F]">About this car</h2>
                            <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">{car.description}</p>
                        </section>
                    )}

                    {car.features && car.features.length > 0 && (
                        <section className="rounded-md border border-gray-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-[#001F3F]">Features</h2>
                            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                {car.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D32F2F]" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {(loadingReviews || reviews.length > 0) && (
                        <section className="rounded-md border border-gray-200 bg-white p-6 sm:p-8">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold text-[#001F3F]">Reviews for this car</h2>
                                {reviews.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-[#F5B301] text-[#F5B301]' : 'fill-gray-200 text-gray-200'}`} />
                                            ))}
                                        </div>
                                        {reviews.length} review{reviews.length > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                            {loadingReviews ? (
                                <div className="py-8 text-center">
                                    <Loader className="mx-auto h-6 w-6 animate-spin text-[#D32F2F]" />
                                </div>
                            ) : (
                                <div className="mt-5 divide-y divide-gray-100">
                                    {reviews.map((review) => (
                                        <figure key={review.id} className="py-5 first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-[#F5B301] text-[#F5B301]' : 'fill-gray-200 text-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">{formatReviewDate(review.createdAt)}</span>
                                            </div>
                                            <blockquote className="mt-2 text-gray-700">&ldquo;{review.comment}&rdquo;</blockquote>
                                            <figcaption className="mt-2 text-sm font-semibold text-[#001F3F]">{review.customerName}</figcaption>
                                        </figure>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* Enquiry */}
                <aside id="enquire">
                    <div className="sticky top-24 overflow-hidden rounded-md border border-gray-200 bg-white">
                        <div className="bg-[#001F3F] px-6 py-5 text-white">
                            <h2 className="text-lg font-semibold">Enquire about this car</h2>
                            <p className="mt-1 text-sm text-slate-300">We usually reply within a few hours.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3 p-6">
                            <input
                                type="text"
                                required
                                aria-label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputClass}
                                placeholder="Full name *"
                            />
                            <input
                                type="email"
                                required
                                aria-label="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={inputClass}
                                placeholder="Email address *"
                            />
                            <input
                                type="tel"
                                aria-label="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={inputClass}
                                placeholder="Phone number"
                            />
                            <textarea
                                required
                                rows={4}
                                aria-label="Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className={inputClass}
                                placeholder={`I'm interested in the ${carName}. Is it available for a viewing?`}
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#D32F2F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#B71C1C] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? <Loader className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                                {submitting ? 'Sending…' : 'Send enquiry'}
                            </button>
                        </form>
                        <div className="space-y-2 border-t border-gray-100 px-6 py-5 text-sm text-gray-600">
                            <a href={enquiryLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D32F2F]">
                                <MessageCircle className="h-4 w-4 text-[#D32F2F]" /> WhatsApp +{siteConfig.whatsappNumber}
                            </a>
                            <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-2 hover:text-[#D32F2F]">
                                <Mail className="h-4 w-4 text-[#D32F2F]" /> {siteConfig.contactEmail}
                            </a>
                            <p className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#D32F2F]" /> Mon–Fri 9–6 · Sat 10–5 · Sun 11–4
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile action bar */}
            {isAvailable && (
                <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-white/10 bg-[#0B1A2E] px-4 py-3 text-white lg:hidden">
                    <div>
                        <p className="text-xs text-slate-400">{car.year} {carName}</p>
                        <p className="text-lg font-semibold">£{car.price?.toLocaleString()}</p>
                    </div>
                    <a
                        href={enquiryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-[#D32F2F] px-5 py-3 text-sm font-semibold"
                    >
                        <MessageCircle className="h-4 w-4" /> WhatsApp us
                    </a>
                </div>
            )}
        </div>
    );
}
