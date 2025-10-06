import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EditReviewClient from './EditReviewClient';
import { reviewService } from '@/lib/firestore';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    return {
        title: 'Edit Review - Admin',
    };
}

export default async function EditReviewPage({ params }: { params: { id: string } }) {
    // Fetch the specific review directly
    const review = await reviewService.getReviewById(params.id);

    if (!review) {
        notFound();
    }

    return <EditReviewClient review={review} />;
}