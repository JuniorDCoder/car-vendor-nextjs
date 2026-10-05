'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Loader, MessageCircle, ArrowRight } from 'lucide-react';
import { reviewService, screenshotReviewService } from '@/lib/firestore';
import ScreenshotReviews from '@/components/sections/ScreenshotReviews';
import { Review, ScreenshotReview } from '@/types';

// Firestore returns Timestamps; older code paths may hold plain Dates
function formatReviewDate(value: unknown): string | null {
    if (!value) return null;
    const date =
        value instanceof Date
            ? value
            : typeof (value as { seconds?: number }).seconds === 'number'
                ? new Date((value as { seconds: number }).seconds * 1000)
                : null;
    return date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [screenshots, setScreenshots] = useState<ScreenshotReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [written, images] = await Promise.allSettled([
                reviewService.getReviews(),
                screenshotReviewService.getPublished(),
            ]);
            if (written.status === 'fulfilled') {
                // Only show approved reviews to the public
                setReviews(written.value.filter((review) => review.isApproved));
            } else {
                console.error('Error loading reviews:', written.reason);
            }
            if (images.status === 'fulfilled') {
                setScreenshots(images.value);
            } else {
                console.error('Error loading screenshot reviews:', images.reason);
            }
            setLoading(false);
        };
        load();
    }, []);

    const total = reviews.length + screenshots.length;

    return (
        <div className="pt-20 min-h-screen bg-white">
            <section className="bg-[#001F3F] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
                        <span className="h-px w-8 bg-[#D32F2F]" />
                        Reviews
                    </p>
                    <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">What our customers say</h1>
                    <div className="mt-6 flex flex-wrap items-center gap-3 text-gray-300">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-[#F5B301] text-[#F5B301]" />
                            ))}
                        </div>
                        <span>4.9 average from 135+ happy customers</span>
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="py-24 text-center">
                    <Loader className="w-10 h-10 text-[#D32F2F] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading reviews...</p>
                </div>
            ) : total === 0 ? (
                <div className="py-24 text-center">
                    <MessageCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No reviews yet</h2>
                    <p className="text-gray-500">Check back soon to see what our customers are saying.</p>
                </div>
            ) : (
                <>
                    {screenshots.length > 0 && (
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#001F3F]">
                                Messages from our customers
                            </h2>
                            <p className="mt-2 mb-10 text-gray-600">
                                Real messages and reviews we&apos;ve received. Tap any one to view it full size.
                            </p>
                            <ScreenshotReviews reviews={screenshots} columns={4} />
                        </section>
                    )}

                    {reviews.length > 0 && (
                        <section className={screenshots.length > 0 ? 'bg-[#F5F6F8]' : ''}>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                                <h2 className="mb-10 text-2xl md:text-3xl font-semibold tracking-tight text-[#001F3F]">
                                    Written reviews
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reviews.map((review) => {
                                        const date = formatReviewDate(review.createdAt);
                                        return (
                                            <figure key={review.id} className="flex flex-col rounded-md border border-gray-200 bg-white p-8">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? 'fill-[#F5B301] text-[#F5B301]' : 'fill-gray-200 text-gray-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <blockquote className="mt-5 flex-1 leading-relaxed text-gray-700">
                                                    &ldquo;{review.comment}&rdquo;
                                                </blockquote>
                                                <figcaption className="mt-6 border-t border-gray-100 pt-4">
                                                    <p className="text-sm font-semibold text-[#001F3F]">{review.customerName}</p>
                                                    {date && <p className="mt-0.5 text-xs text-gray-500">{date}</p>}
                                                </figcaption>
                                            </figure>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            <section className="bg-[#001F3F] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Ready to find your next car?</h2>
                        <p className="mt-2 text-gray-300">Join over 135 happy customers who bought with confidence.</p>
                    </div>
                    <Link
                        href="/cars"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D32F2F] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#B71C1C]"
                    >
                        View our stock <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
