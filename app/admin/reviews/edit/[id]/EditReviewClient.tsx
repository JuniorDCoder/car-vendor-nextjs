'use client';

import { Review } from '@/types';
import ReviewForm from "@/components/sections/ReviewForm";

interface EditReviewClientProps {
    review: Review;
}

export default function EditReviewClient({ review }: EditReviewClientProps) {
    return <ReviewForm review={review} isEdit />;
}