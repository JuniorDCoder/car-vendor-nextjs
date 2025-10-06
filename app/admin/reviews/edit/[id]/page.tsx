import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EditReviewClient from './EditReviewClient';
import { reviewService } from '@/lib/firestore';


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    return {
        title: 'Edit Review - Admin',
    };
}

// Generate static paths for all reviews
export async function generateStaticParams() {
    try {
        const reviews = await reviewService.getReviews();
        return reviews.map((review) => ({
            id: review.id!,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

export default async function EditReviewPage({ params }: { params: { id: string } }) {
    const reviews = await reviewService.getReviews();
    const review = reviews.find(r => r.id === params.id);

    if (!review) {
        notFound();
    }

    return <EditReviewClient review={review} />;
}