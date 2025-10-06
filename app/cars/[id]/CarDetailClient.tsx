'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import {
    ArrowLeft,
    Phone,
    MessageCircle,
    Mail,
    Calendar,
    Gauge,
    Fuel,
    Settings,
    Palette,
    CheckCircle,
    Star,
    Loader,
    Shield,
    MapPin
} from 'lucide-react';
import { reviewService } from '@/lib/firestore';
import { Car, Review } from '@/types';
import toast from 'react-hot-toast';
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "@/lib/firebase";

interface CarDetailClientProps {
    car: Car;
}

export default function CarDetailClient({ car }: CarDetailClientProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const [notificationsSupported, setNotificationsSupported] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
        loadReviews();

        // Check notifications support
        setNotificationsSupported('Notification' in window);

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [car.id]);

    const loadReviews = async () => {
        try {
            setLoadingReviews(true);
            const reviewsData = await reviewService.getReviewsByCarId(car.id!);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error loading reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    };

    const sendCarInquiryNotification = () => {
        console.log('🚗 New car inquiry:', {
            car: `${car.make} ${car.model}`,
            customer: formData.name,
            email: formData.email
        });

        // Browser notification for admin
        sendBrowserNotification('🚗 New Car Inquiry', {
            body: `${formData.name} is interested in ${car.make} ${car.model}`,
            tag: 'car-inquiry'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Store car inquiry in Firestore
            await addDoc(collection(db, 'carInquiries'), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                carId: car.id,
                carDetails: {
                    make: car.make,
                    model: car.model,
                    year: car.year,
                    price: car.price,
                },
                status: 'new',
                read: false,
                createdAt: serverTimestamp(),
            });

            // 2. Send notifications
            sendCarInquiryNotification();

            // 3. Browser notification for user
            if (notificationsSupported) {
                sendBrowserNotification('Inquiry Sent!', {
                    body: `We'll contact you about the ${car.make} ${car.model}`,
                });
            }

            toast.success('Inquiry sent successfully! We will contact you shortly.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error sending inquiry:', error);
            toast.error('Failed to send inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    href="/cars"
                    className="inline-flex items-center text-[#001F3F] hover:text-[#D32F2F] transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to All Cars
                </Link>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Image Gallery */}
                    <div data-aos="fade-right">
                        <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
                            {car.images && car.images.length > 0 ? (
                                <Image
                                    src={car.images[selectedImage]}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">No Image Available</span>
                                </div>
                            )}
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                                car.status === 'available' ? 'bg-green-500' :
                                    car.status === 'pending' ? 'bg-yellow-500' :
                                        'bg-red-500'
                            }`}>
                                {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
                            </div>
                            {/* Featured Badge */}
                            {car.isFeatured && (
                                <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Featured
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {car.images && car.images.length > 1 && (
                            <div className="grid grid-cols-3 gap-4">
                                {car.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                                            selectedImage === index
                                                ? 'ring-4 ring-[#D32F2F] transform scale-105'
                                                : 'hover:ring-2 hover:ring-gray-300'
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${car.make} ${car.model} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Car Details */}
                    <div data-aos="fade-left">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-[#001F3F] mb-2">
                                        {car.make} {car.model}
                                    </h1>
                                    <p className="text-xl text-gray-600">{car.year}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <p className="text-5xl font-bold text-[#D32F2F] mb-6">
                                £{car.price?.toLocaleString()}
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="w-6 h-6 text-[#D32F2F]" />
                                    <div>
                                        <p className="text-sm text-gray-600">Year</p>
                                        <p className="font-semibold text-[#001F3F]">{car.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Gauge className="w-6 h-6 text-[#D32F2F]" />
                                    <div>
                                        <p className="text-sm text-gray-600">Mileage</p>
                                        <p className="font-semibold text-[#001F3F]">{car.mileage?.toLocaleString()} mi</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Fuel className="w-6 h-6 text-[#D32F2F]" />
                                    <div>
                                        <p className="text-sm text-gray-600">Fuel Type</p>
                                        <p className="font-semibold text-[#001F3F]">
                                            {car.fuelType?.charAt(0).toUpperCase() + car.fuelType?.slice(1)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Settings className="w-6 h-6 text-[#D32F2F]" />
                                    <div>
                                        <p className="text-sm text-gray-600">Transmission</p>
                                        <p className="font-semibold text-[#001F3F]">
                                            {car.transmission?.charAt(0).toUpperCase() + car.transmission?.slice(1)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Palette className="w-6 h-6 text-[#D32F2F]" />
                                    <div>
                                        <p className="text-sm text-gray-600">Color</p>
                                        <p className="font-semibold text-[#001F3F]">{car.color}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <CarIcon className="w-6 h-6 text-[#D32F2F]" />
                                    <div>
                                        <p className="text-sm text-gray-600">Body Type</p>
                                        <p className="font-semibold text-[#001F3F]">
                                            {car.bodyType?.charAt(0).toUpperCase() + car.bodyType?.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-blue-700">Full Service History</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-blue-700">Available for Viewing</span>
                                </div>
                            </div>

                            {/* Contact Buttons - Only show for available cars */}
                            {car.status === 'available' && (
                                <div className="flex gap-3">
                                    <a
                                        href="tel:+447868364455"
                                        className="flex-1 bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors flex items-center justify-center"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        Call Now
                                    </a>
                                    <a
                                        href={`https://wa.me/447868364455?text=I'm interested in the ${car.make} ${car.model} (${car.year}) - £${car.price?.toLocaleString()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        WhatsApp
                                    </a>
                                </div>
                            )}

                            {/* Sold/Pending Message */}
                            {car.status !== 'available' && (
                                <div className={`text-center p-4 rounded-lg ${
                                    car.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    <p className="font-semibold">
                                        {car.status === 'sold'
                                            ? 'This vehicle has been sold'
                                            : 'This vehicle is currently pending sale'
                                        }
                                    </p>
                                    <p className="text-sm mt-1">
                                        Contact us for similar vehicles
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
                            <h2 className="text-3xl font-bold text-[#001F3F] mb-4">Vehicle Description</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{car.description}</p>
                        </div>

                        {/* Features */}
                        {car.features && car.features.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
                                <h2 className="text-3xl font-bold text-[#001F3F] mb-6">Key Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {car.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <CheckCircle className="w-5 h-5 text-[#D32F2F] flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-[#001F3F]">Customer Reviews</h2>
                                {reviews.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < Math.round(averageRating)
                                                            ? 'fill-[#D32F2F] text-[#D32F2F]'
                                                            : 'fill-gray-300 text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600">({reviews.length} reviews)</span>
                                    </div>
                                )}
                            </div>

                            {loadingReviews ? (
                                <div className="text-center py-8">
                                    <Loader className="w-8 h-8 text-[#D32F2F] animate-spin mx-auto mb-2" />
                                    <p className="text-gray-600">Loading reviews...</p>
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                            <div className="flex items-center mb-2">
                                                <div className="flex mr-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${
                                                                i < review.rating
                                                                    ? 'fill-[#D32F2F] text-[#D32F2F]'
                                                                    : 'fill-gray-300 text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">
                          {review.createdAt && new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                        </span>
                                            </div>
                                            <p className="text-gray-700 mb-2 italic">"{review.comment}"</p>
                                            <p className="font-semibold text-[#001F3F]">{review.customerName}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No reviews yet for this vehicle.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24" data-aos="fade-left">
                            <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Contact Us</h2>
                            <p className="text-gray-600 mb-6">
                                Interested in this vehicle? Send us a message and we'll get back to you as soon as possible.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                        placeholder="Your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                        placeholder={`I'm interested in the ${car.make} ${car.model}. Please contact me with more information...`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || car.status !== 'available'}
                                    className="w-full bg-[#D32F2F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#B71C1C] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5 mr-2" />
                                            {car.status === 'available' ? 'Send Inquiry' : 'Contact Us'}
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Quick Contact Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-[#001F3F] mb-3">Quick Contact</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>📞 <a href="tel:+447868364455" className="hover:text-[#D32F2F]">+44 7868 364455</a></p>
                                    <p>📧 <a href="mailto:info@paulsautocarsales.uk" className="hover:text-[#D32F2F]">info@paulsautocarsales.uk</a></p>
                                    <p>🕒 Mon-Sat: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CarIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
        </svg>
    );
}