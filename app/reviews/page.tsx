'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import { Star, Loader, MessageCircle } from 'lucide-react';
import { reviewService } from '@/lib/firestore';
import { Review } from '@/types';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const reviewsData = await reviewService.getReviews();
            // Only show approved reviews to the public
            const approvedReviews = reviewsData.filter(review => review.isApproved);
            setReviews(approvedReviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-[#D32F2F] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#001F3F] to-[#003366] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Customer <span className="text-[#D32F2F]">Reviews</span>
                        </h1>
                        <p className="text-xl text-[#C0C0C0] mb-4">
                            Hear what our satisfied customers have to say about their experience
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-lg">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-[#C0C0C0]">
                {reviews.length} Verified Reviews
              </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Reviews Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {reviews.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                    >
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                {/* Rating */}
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${
                                                i < review.rating
                                                    ? 'fill-[#D32F2F] text-[#D32F2F]'
                                                    : 'fill-gray-300 text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                                    "{review.comment}"
                                </p>

                                {/* Customer Info */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-[#001F3F] text-lg">
                                            {review.customerName}
                                        </p>
                                        {review.createdAt && (
                                            <p className="text-gray-500 text-sm mt-1">
                                                {new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    {review.carId && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Verified Purchase</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                        <p className="text-gray-500">
                            Check back later to see what our customers are saying!
                        </p>
                    </div>
                )}

                {/* Stats Section */}
                {reviews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-16 bg-gradient-to-r from-[#001F3F] to-[#003366] rounded-2xl p-8 text-white text-center"
                    >
                        <h2 className="text-3xl font-bold mb-4">Join Our Happy Customers</h2>
                        <p className="text-xl text-[#C0C0C0] mb-6">
                            Over 135 satisfied customers and counting
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div>
                                <div className="text-3xl font-bold text-[#D32F2F]">{reviews.length}+</div>
                                <div className="text-[#C0C0C0]">Verified Reviews</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#D32F2F]">4.9/5</div>
                                <div className="text-[#C0C0C0]">Average Rating</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#D32F2F]">135+</div>
                                <div className="text-[#C0C0C0]">Happy Customers</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}