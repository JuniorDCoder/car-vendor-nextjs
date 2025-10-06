'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import AOS from 'aos';
import {
    ArrowRight,
    Star,
    CheckCircle,
    Award,
    Users,
    Shield,
    Clock,
    Car,
    TrendingUp,
    MapPin,
    Phone,
    Mail,
    ArrowDown
} from 'lucide-react';
import { carService } from '@/lib/firestore';
import { reviewService } from '@/lib/firestore';
import { Car as CarType, Review } from '@/types';

export default function Home() {
    const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({
        happyCustomers: 135,
        soldCars: 89,
        averageRating: 4.9,
        availableCars: 24
    });
    const [loading, setLoading] = useState(true);

    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 1.2]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
        });
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [featuredCarsData, allCarsData, reviewsData] = await Promise.all([
                carService.getFeaturedCars(),
                carService.getCars(6), // Get first 6 cars as fallback
                reviewService.getReviews()
            ]);

            // Use featured cars if available, otherwise use first 6 available cars
            const carsToShow = featuredCarsData.length > 0
                ? featuredCarsData
                : allCarsData.cars.filter(car => car.status === 'available').slice(0, 6);

            setFeaturedCars(carsToShow);
            setRecentReviews(reviewsData.slice(0, 3));

            setStats(prev => ({
                ...prev,
                availableCars: allCarsData.cars.filter(car => car.status === 'available').length
            }));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const floatingAnimation = {
        y: [0, -20, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <div className="pt-20">
            {/* Hero Section with Parallax */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#001a33]">
                {/* Animated Background Elements */}
                <motion.div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"
                    style={{ opacity, scale }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#001F3F]/80 to-[#003366]/60" />

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-20 left-10 w-20 h-20 bg-[#D32F2F]/20 rounded-full blur-xl"
                    animate={floatingAnimation}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-16 h-16 bg-[#D32F2F]/30 rounded-full blur-lg"
                    animate={floatingAnimation}
                    transition={{ delay: 1 }}
                />

                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-6">
                            <motion.span
                                className="inline-block bg-[#D32F2F]/20 text-[#D32F2F] px-4 py-2 rounded-full text-sm font-semibold border border-[#D32F2F]/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                🏆 Trusted Car Dealership Since 2018
                            </motion.span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                        >
                            Drive Your
                            <motion.span
                                className="block text-[#D32F2F] bg-gradient-to-r from-[#D32F2F] to-[#FF6B6B] bg-clip-text text-transparent"
                                whileHover={{ scale: 1.02 }}
                            >
                                Dream Car
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl text-[#C0C0C0] mb-8 max-w-3xl mx-auto leading-relaxed"
                        >
                            Discover premium quality used cars in London. From luxury sedans to family SUVs,
                            we help you find the perfect vehicle with complete peace of mind.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row md:gap-4 gap-7 justify-center items-center mb-12"
                        >
                            <Link
                                href="/cars"
                                className="group relative bg-[#D32F2F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B71C1C] transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center space-x-2 overflow-hidden"
                            >
                                <span className="relative z-10">Browse Our Collection</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Link>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/contact"
                                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                                >
                                    Book a Test Drive
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
                        >
                            {[
                                { number: `${stats.happyCustomers}+`, label: 'Happy Customers' },
                                { number: `${stats.soldCars}+`, label: 'Cars Sold' },
                                { number: stats.averageRating, label: 'Star Rating', icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> },
                                { number: `${stats.availableCars}+`, label: 'Available Now' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                        <div className="text-2xl font-bold text-[#D32F2F]">{stat.number}</div>
                                        {stat.icon}
                                    </div>
                                    <div className="text-xs text-[#C0C0C0]">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-white/70 text-sm">Scroll to explore</span>
                        <ArrowDown className="w-5 h-5 text-white/70" />
                    </div>
                </motion.div>
            </section>

            {/* Featured Vehicles Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.span
                            className="inline-block text-[#D32F2F] font-semibold mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            🚗 PREMIUM COLLECTION
                        </motion.span>
                        <h2 className="text-4xl md:text-6xl font-bold text-[#001F3F] mb-4">
                            Featured <span className="text-[#D32F2F]">Vehicles</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Hand-picked luxury vehicles meticulously inspected and ready for their next adventure
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-200 rounded-2xl h-96 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {featuredCars.map((car, index) => (
                                <motion.div
                                    key={car.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                >
                                    <Link href={`/cars/${car.id}`}>
                                        <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                                            <div className="relative h-64 overflow-hidden">
                                                {car.images && car.images.length > 0 ? (
                                                    <Image
                                                        src={car.images[0]}
                                                        alt={`${car.make} ${car.model}`}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <Car className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                                                    car.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}>
                                                    {car.status}
                                                </div>

                                                {/* Featured Badge */}
                                                {car.isFeatured && (
                                                    <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        Featured
                                                    </div>
                                                )}

                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-2xl font-bold text-[#001F3F] mb-2 group-hover:text-[#D32F2F] transition-colors">
                                                    {car.make} {car.model}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    {car.year} • {car.mileage?.toLocaleString()} miles • {car.fuelType}
                                                </p>

                                                {/* Quick Specs */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm text-gray-500">{car.transmission}</span>
                                                    <span className="text-sm text-gray-500">{car.bodyType}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-[#D32F2F]">
                            £{car.price?.toLocaleString()}
                          </span>
                                                    <motion.span
                                                        className="text-[#001F3F] group-hover:text-[#D32F2F] transition-colors flex items-center"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/cars"
                            className="inline-block bg-gradient-to-r from-[#001F3F] to-[#003366] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            Explore Full Inventory
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-gradient-to-br from-[#001F3F] to-[#003366] text-white relative overflow-hidden">
                {/* Animated Background */}
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 80%, #D32F2F 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 20%, #D32F2F 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 80%, #D32F2F 0%, transparent 50%)',
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">
                            Why Choose <span className="text-[#D32F2F]">Paul's Auto?</span>
                        </h2>
                        <p className="text-lg text-[#C0C0C0] max-w-2xl mx-auto">
                            Experience the difference with our commitment to quality, transparency, and customer satisfaction
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="w-12 h-12" />,
                                title: 'Quality Assured',
                                description: 'Every vehicle undergoes 150-point inspection with full service history verification',
                                features: ['Comprehensive Inspection', 'Service History Check', 'Mechanical Warranty']
                            },
                            {
                                icon: <Award className="w-12 h-12" />,
                                title: 'Trusted Service',
                                description: 'Rated 4.9/5 by our customers with dedicated after-sales support',
                                features: ['5-Star Reviews', 'Dedicated Support', 'Customer Satisfaction']
                            },
                            {
                                icon: <Clock className="w-12 h-12" />,
                                title: 'Quick Process',
                                description: 'From viewing to driving away, we make car buying simple and fast',
                                features: ['Same Day Viewing', 'Fast Paperwork', 'Quick Handover']
                            },
                            {
                                icon: <TrendingUp className="w-12 h-12" />,
                                title: 'Best Value',
                                description: 'Competitive pricing with flexible finance options available',
                                features: ['Price Match Promise', 'Finance Options', 'Part Exchange']
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/10 hover:border-white/20"
                            >
                                <motion.div
                                    className="text-[#D32F2F] mb-6"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-[#C0C0C0] mb-6 leading-relaxed">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-[#C0C0C0]">
                                            <CheckCircle className="w-4 h-4 text-[#D32F2F] mr-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-[#001F3F] mb-4">
                            Loved by <span className="text-[#D32F2F]">Customers</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Don't just take our word for it - hear what our customers have to say
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg h-64 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {recentReviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < review.rating
                                                        ? 'fill-[#D32F2F] text-[#D32F2F]'
                                                        : 'fill-gray-300 text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{review.comment}"</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-[#001F3F]">{review.customerName}</p>
                                        {review.carId && (
                                            <span className="text-sm text-gray-500">
                        {featuredCars.find(c => c.id === review.carId)?.make}
                      </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/reviews"
                            className="inline-block bg-[#D32F2F] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#B71C1C] transition-all duration-300 hover:shadow-2xl hover:scale-105"
                        >
                            Read All Testimonials
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#001F3F] to-[#003366] text-white relative overflow-hidden">
                {/* Animated Background */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'radial-gradient(circle at 0% 0%, #D32F2F 0%, transparent 50%)',
                            'radial-gradient(circle at 100% 100%, #D32F2F 0%, transparent 50%)',
                            'radial-gradient(circle at 0% 0%, #D32F2F 0%, transparent 50%)',
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <motion.span
                            className="inline-block text-[#D32F2F] font-semibold mb-4 text-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            🚀 READY TO GET STARTED?
                        </motion.span>

                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Find Your Perfect Car Today
                        </h2>

                        <p className="text-xl text-[#C0C0C0] mb-8 max-w-2xl mx-auto leading-relaxed">
                            Visit our showroom in London or schedule a virtual tour. Our team is ready to help you drive away in your dream car.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <a
                                    href="https://wa.me/447868364455?text=Hi%2C%20I'm%20interested%20in%20learning%20more%20about%20the%20cars%20available%20on%20your%20platform.%20Could%20you%20please%20provide%20me%20with%20more%20information%3F"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#10B981] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#059669] transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center space-x-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>Discuss With Us</span>
                                </a>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/contact"
                                    className="bg-white text-[#001F3F] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 border-2 border-white hover:shadow-2xl flex items-center space-x-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>Send Message</span>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Quick Info */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            {[
                                { icon: <MapPin className="w-6 h-6" />, text: 'The Car Showroom, St John\'s Rd, Meadowfield, Durham DH7 8XL, United Kingdom' },
                                { icon: <Clock className="w-6 h-6" />, text: 'Mon-Sat: 9AM-6PM' },
                                { icon: <Car className="w-6 h-6" />, text: 'Free Test Drives' },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center justify-center space-x-2 text-[#C0C0C0]"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {item.icon}
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}