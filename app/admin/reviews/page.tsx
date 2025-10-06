'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Star,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Loader
} from 'lucide-react';
import { reviewService } from '@/lib/firestore';
import { authService } from '@/lib/auth';
import { Review } from '@/types';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        checkAuth();
        loadReviews();
    }, []);

    const checkAuth = async () => {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                router.push('/admin/login');
                return;
            }
            const isAdmin = await authService.isAdmin(user);
            if (!isAdmin) {
                router.push('/admin/login');
                return;
            }
        } catch (error) {
            router.push('/admin/login');
        }
    };

    const loadReviews = async () => {
        try {
            setLoading(true);
            const reviewsData = await reviewService.getReviews();
            setReviews(reviewsData);
            setFilteredReviews(reviewsData);
        } catch (error) {
            console.error('Error loading reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...reviews];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(review =>
                review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.comment.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(review =>
                statusFilter === 'approved' ? review.isApproved : !review.isApproved
            );
        }

        setFilteredReviews(filtered);
    }, [searchTerm, statusFilter, reviews]);

    const handleApproveReview = async (reviewId: string) => {
        try {
            await reviewService.updateReview(reviewId, { isApproved: true });
            setReviews(reviews.map(review =>
                review.id === reviewId ? { ...review, isApproved: true } : review
            ));
            toast.success('Review approved successfully');
        } catch (error) {
            toast.error('Error approving review');
        }
    };

    const handleRejectReview = async (reviewId: string) => {
        try {
            await reviewService.updateReview(reviewId, { isApproved: false });
            setReviews(reviews.map(review =>
                review.id === reviewId ? { ...review, isApproved: false } : review
            ));
            toast.success('Review rejected');
        } catch (error) {
            toast.error('Error rejecting review');
        }
    };

    const handleDeleteReview = async (reviewId: string, customerName: string) => {
        if (!confirm(`Are you sure you want to delete review from ${customerName}?`)) return;

        try {
            await reviewService.deleteReview(reviewId);
            setReviews(reviews.filter(review => review.id !== reviewId));
            toast.success('Review deleted successfully');
        } catch (error) {
            toast.error('Error deleting review');
        }
    };

    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-8 h-8 text-[#D32F2F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#001F3F] mb-2">Manage Reviews</h1>
                        <p className="text-gray-600">Approve, edit, and manage customer reviews</p>
                    </div>
                    <Link
                        href="/admin/reviews/new"
                        className="flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#B71C1C] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Review
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reviews by customer name or comment..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            >
                                <option value="all">All Reviews</option>
                                <option value="approved">Approved Only</option>
                                <option value="pending">Pending Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {filteredReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex">
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
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            review.isApproved
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                                    </div>

                                    <p className="text-gray-700 mb-4 text-lg italic">"{review.comment}"</p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-[#001F3F]">{review.customerName}</p>
                                            {review.carId && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Car ID: {review.carId}
                                                </p>
                                            )}
                                            {review.createdAt && (
                                                <p className="text-sm text-gray-500">
                                                    {new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                                    {!review.isApproved && (
                                        <button
                                            onClick={() => handleApproveReview(review.id!)}
                                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                    )}
                                    {review.isApproved && (
                                        <button
                                            onClick={() => handleRejectReview(review.id!)}
                                            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Unapprove
                                        </button>
                                    )}
                                    <Link
                                        href={`/admin/reviews/edit/${review.id}`}
                                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-center justify-center"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteReview(review.id!, review.customerName)}
                                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredReviews.length === 0 && (
                    <div className="text-center py-12">
                        <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search filters'
                                : 'Get started by adding your first review'
                            }
                        </p>
                        <Link
                            href="/admin/reviews/new"
                            className="inline-flex items-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-[#B71C1C] transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Review
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}