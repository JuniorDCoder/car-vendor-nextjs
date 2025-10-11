'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Save, ArrowLeft, Loader, Calendar } from 'lucide-react';
import { reviewService } from '@/lib/firestore';
import { carService } from '@/lib/firestore';
import { Review, Car } from '@/types';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    review?: Review;
    isEdit?: boolean;
}

export default function ReviewForm({ review, isEdit = false }: ReviewFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState<Car[]>([]);
    const [formData, setFormData] = useState({
        customerName: '',
        rating: 5,
        comment: '',
        carId: '',
        isApproved: true,
        createdAt: new Date().toISOString().split('T')[0], // Default to today
    });

    useEffect(() => {
        loadCars();
        if (review) {
            // Handle createdAt date conversion safely
            let reviewDate = new Date().toISOString().split('T')[0];

            if (review.createdAt) {
                try {
                    // Check if it's a Firestore Timestamp (has toDate method)
                    if (review.createdAt && typeof review.createdAt === 'object' && 'toDate' in review.createdAt) {
                        const date = (review.createdAt as any).toDate();
                        reviewDate = date.toISOString().split('T')[0];
                    }
                    // Check if it's already a Date object
                    else if (review.createdAt instanceof Date) {
                        reviewDate = review.createdAt.toISOString().split('T')[0];
                    }
                    // Check if it's a string that can be converted to Date
                    else if (typeof review.createdAt === 'string') {
                        const date = new Date(review.createdAt);
                        if (!isNaN(date.getTime())) {
                            reviewDate = date.toISOString().split('T')[0];
                        }
                    }
                    // Handle number timestamp
                    else if (typeof review.createdAt === 'number') {
                        const date = new Date(review.createdAt);
                        reviewDate = date.toISOString().split('T')[0];
                    }
                } catch (error) {
                    console.error('Error parsing createdAt date:', error);
                    // Fallback to current date if parsing fails
                    reviewDate = new Date().toISOString().split('T')[0];
                }
            }

            setFormData({
                customerName: review.customerName,
                rating: review.rating,
                comment: review.comment,
                carId: review.carId || '',
                isApproved: review.isApproved,
                createdAt: reviewDate,
            });
        }
    }, [review]);

    const loadCars = async () => {
        try {
            const { cars: carsData } = await carService.getCars(50);
            setCars(carsData);
        } catch (error) {
            console.error('Error loading cars:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const reviewData = {
                customerName: formData.customerName,
                rating: formData.rating,
                comment: formData.comment,
                carId: formData.carId || null,
                isApproved: formData.isApproved,
                createdAt: new Date(formData.createdAt), // Use the selected date
            };

            if (isEdit && review?.id) {
                await reviewService.updateReview(review.id, reviewData);
                toast.success('Review updated successfully');
            } else {
                await reviewService.addReview(reviewData);
                toast.success('Review added successfully');
            }
            router.push('/admin/reviews');
        } catch (error) {
            toast.error(`Error ${isEdit ? 'updating' : 'adding'} review`);
            console.error(`Error ${isEdit ? 'updating' : 'adding'} review:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[#001F3F] hover:text-[#D32F2F] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-[#001F3F]">
                            {isEdit ? 'Edit Review' : 'Add New Review'}
                        </h1>
                        <p className="text-gray-600">
                            {isEdit ? 'Update review details' : 'Create a new customer review'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Customer Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            placeholder="Enter customer name"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating *
                        </label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, rating }))}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            rating <= formData.rating
                                                ? 'fill-[#D32F2F] text-[#D32F2F]'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Creation Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Review Date *
                            </div>
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.createdAt}
                            onChange={(e) => setFormData(prev => ({ ...prev, createdAt: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Set the date when this review was created
                        </p>
                    </div>

                    {/* Car Selection (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Associated Car (Optional)
                        </label>
                        <select
                            value={formData.carId}
                            onChange={(e) => setFormData(prev => ({ ...prev, carId: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                        >
                            <option value="">No specific car</option>
                            {cars.map(car => (
                                <option key={car.id} value={car.id}>
                                    {car.make} {car.model} ({car.year})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Comment *
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={formData.comment}
                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            placeholder="Enter the review comment..."
                        />
                    </div>

                    {/* Approval Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isApproved"
                            checked={formData.isApproved}
                            onChange={(e) => setFormData(prev => ({ ...prev, isApproved: e.target.checked }))}
                            className="w-4 h-4 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300 rounded"
                        />
                        <label htmlFor="isApproved" className="text-sm font-medium text-gray-700">
                            Approve this review (visible to public)
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? 'Saving...' : (isEdit ? 'Update Review' : 'Add Review')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}