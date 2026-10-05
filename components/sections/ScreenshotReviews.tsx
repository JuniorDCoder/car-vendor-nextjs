'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ScreenshotReview } from '@/types';

interface ScreenshotReviewsProps {
    reviews: ScreenshotReview[];
    // Masonry columns at the largest breakpoint
    columns?: 3 | 4;
}

// Masonry gallery of customer review screenshots, with a full-screen viewer on click
export default function ScreenshotReviews({ reviews, columns = 3 }: ScreenshotReviewsProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const close = useCallback(() => setOpenIndex(null), []);
    const step = useCallback(
        (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + reviews.length) % reviews.length)),
        [reviews.length]
    );

    useEffect(() => {
        if (openIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [openIndex, close, step]);

    if (reviews.length === 0) return null;

    const open = openIndex !== null ? reviews[openIndex] : null;

    return (
        <>
            <div
                className={`columns-1 sm:columns-2 gap-5 ${columns === 4 ? 'lg:columns-3 xl:columns-4' : 'lg:columns-3'}`}
                data-testid="screenshot-gallery"
            >
                {reviews.map((review, index) => (
                    <figure key={review.id} className="mb-5 break-inside-avoid">
                        <button
                            type="button"
                            onClick={() => setOpenIndex(index)}
                            className="block w-full overflow-hidden rounded-md border border-gray-200 bg-white text-left transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D32F2F]"
                            aria-label={`View review ${review.caption ? `from ${review.caption}` : index + 1} full size`}
                        >
                            <Image
                                src={review.imageUrl}
                                alt={review.caption ? `Customer review: ${review.caption}` : 'Customer review screenshot'}
                                width={review.width || 800}
                                height={review.height || 1400}
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                className="h-auto w-full"
                            />
                        </button>
                        {review.caption && (
                            <figcaption className="mt-2 text-sm font-medium text-gray-700">{review.caption}</figcaption>
                        )}
                    </figure>
                ))}
            </div>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Customer review"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
                    onClick={close}
                >
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {reviews.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); step(-1); }}
                                aria-label="Previous review"
                                className="absolute left-2 sm:left-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                            >
                                <ChevronLeft className="h-7 w-7" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); step(1); }}
                                aria-label="Next review"
                                className="absolute right-2 sm:right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                            >
                                <ChevronRight className="h-7 w-7" />
                            </button>
                        </>
                    )}
                    <figure className="flex max-h-full max-w-3xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={open.imageUrl}
                            alt={open.caption ? `Customer review: ${open.caption}` : 'Customer review screenshot'}
                            className="max-h-[85vh] w-auto rounded-md object-contain"
                        />
                        {open.caption && <figcaption className="mt-3 text-sm text-white/90">{open.caption}</figcaption>}
                    </figure>
                </div>
            )}
        </>
    );
}
