'use client';

import { DragEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Eye,
    EyeOff,
    GripVertical,
    ImagePlus,
    Loader,
    Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cloudinaryService } from '@/lib/cloudinary';
import { screenshotReviewService } from '@/lib/firestore';
import { ScreenshotReview } from '@/types';

const MAX_FILE_SIZE_MB = 10;

export default function ScreenshotReviewsAdmin() {
    const [items, setItems] = useState<ScreenshotReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
    const [savingOrder, setSavingOrder] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropActive, setDropActive] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            setLoading(true);
            setItems(await screenshotReviewService.getAll());
        } catch (error) {
            console.error('Error loading screenshot reviews:', error);
            toast.error('Failed to load screenshot reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const files = Array.from(fileList);
        const valid = files.filter((file) => file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
        if (valid.length < files.length) {
            toast.error(`Skipped ${files.length - valid.length} file(s): only images up to ${MAX_FILE_SIZE_MB}MB are allowed`);
        }
        if (valid.length === 0) return;

        try {
            setUploading({ done: 0, total: valid.length });
            const uploaded: Omit<ScreenshotReview, 'id' | 'order' | 'createdAt'>[] = [];
            // One at a time so the progress count is accurate and a large batch doesn't time out
            for (const file of valid) {
                const [result] = await cloudinaryService.uploadImages([file]);
                uploaded.push({
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    caption: '',
                    isPublished: true,
                });
                setUploading({ done: uploaded.length, total: valid.length });
            }

            const nextOrder = items.length ? Math.max(...items.map((item) => item.order)) + 1 : 0;
            await screenshotReviewService.addMany(uploaded, nextOrder);
            toast.success(`${uploaded.length} review${uploaded.length > 1 ? 's' : ''} added`);
            await load();
        } catch (error) {
            console.error('Error uploading screenshot reviews:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(null);
            if (fileInput.current) fileInput.current.value = '';
        }
    };

    const saveOrder = async (next: ScreenshotReview[]) => {
        const previous = items;
        setItems(next.map((item, index) => ({ ...item, order: index })));
        try {
            setSavingOrder(true);
            await screenshotReviewService.reorder(next.map((item) => item.id!));
            toast.success('Order saved');
        } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Could not save the new order');
            setItems(previous);
        } finally {
            setSavingOrder(false);
        }
    };

    const move = (from: number, to: number) => {
        if (to < 0 || to >= items.length || from === to) return;
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        saveOrder(next);
    };

    const togglePublished = async (item: ScreenshotReview) => {
        try {
            await screenshotReviewService.update(item.id!, { isPublished: !item.isPublished });
            setItems((current) => current.map((i) => (i.id === item.id ? { ...i, isPublished: !i.isPublished } : i)));
            toast.success(item.isPublished ? 'Hidden from the website' : 'Now showing on the website');
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error('Could not update this review');
        }
    };

    const saveCaption = async (item: ScreenshotReview, caption: string) => {
        if ((item.caption || '') === caption.trim()) return;
        try {
            await screenshotReviewService.update(item.id!, { caption: caption.trim() });
            setItems((current) => current.map((i) => (i.id === item.id ? { ...i, caption: caption.trim() } : i)));
            toast.success('Caption saved');
        } catch (error) {
            console.error('Error saving caption:', error);
            toast.error('Could not save the caption');
        }
    };

    const remove = async (item: ScreenshotReview) => {
        if (!confirm('Delete this review screenshot? This cannot be undone.')) return;
        try {
            await screenshotReviewService.delete(item.id!);
            const remaining = items.filter((i) => i.id !== item.id);
            setItems(remaining);
            await screenshotReviewService.reorder(remaining.map((i) => i.id!));
            toast.success('Review deleted');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Could not delete this review');
        }
    };

    const onDropZone = (e: DragEvent) => {
        e.preventDefault();
        setDropActive(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/admin/reviews" className="inline-flex items-center text-sm text-[#001F3F] hover:text-[#D32F2F] mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to reviews
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#001F3F]">Screenshot Reviews</h1>
                        <p className="text-gray-600 mt-1">
                            Upload screenshots of real customer messages. They appear on the Reviews page and homepage in the order shown here.
                        </p>
                    </div>
                    {savingOrder && (
                        <span className="inline-flex items-center text-sm text-gray-500">
                            <Loader className="w-4 h-4 mr-2 animate-spin" /> Saving order…
                        </span>
                    )}
                </div>

                {/* Upload */}
                <div
                    onDragOver={(e) => {
                        if (e.dataTransfer.types.includes('Files')) {
                            e.preventDefault();
                            setDropActive(true);
                        }
                    }}
                    onDragLeave={() => setDropActive(false)}
                    onDrop={onDropZone}
                    className={`mb-10 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        dropActive ? 'border-[#D32F2F] bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3 text-[#001F3F]">
                            <Loader className="w-8 h-8 animate-spin text-[#D32F2F]" />
                            <p className="font-semibold">Uploading {uploading.done} of {uploading.total}…</p>
                        </div>
                    ) : (
                        <>
                            <ImagePlus className="w-10 h-10 mx-auto text-[#D32F2F]" />
                            <p className="mt-3 font-semibold text-[#001F3F]">Drag screenshots here, or</p>
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#D32F2F] px-5 py-2.5 font-semibold text-white hover:bg-[#B71C1C]"
                            >
                                Choose images
                            </button>
                            <p className="mt-3 text-sm text-gray-500">PNG or JPG, up to {MAX_FILE_SIZE_MB}MB each. You can select several at once.</p>
                        </>
                    )}
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        data-testid="screenshot-input"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        <Loader className="w-8 h-8 mx-auto mb-3 animate-spin text-[#D32F2F]" /> Loading…
                    </div>
                ) : items.length === 0 ? (
                    <p className="py-16 text-center text-gray-500">No screenshot reviews yet. Upload your first one above.</p>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-gray-500">Drag cards or use the arrows to change the order. Changes save automatically.</p>
                        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="screenshot-list">
                            {items.map((item, index) => (
                                <li
                                    key={item.id}
                                    draggable
                                    onDragStart={() => setDragIndex(index)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (dragIndex !== null) move(dragIndex, index);
                                        setDragIndex(null);
                                    }}
                                    onDragEnd={() => setDragIndex(null)}
                                    data-testid="screenshot-item"
                                    data-id={item.id}
                                    className={`flex flex-col rounded-lg border bg-white shadow-sm transition-opacity ${
                                        dragIndex === index ? 'opacity-50' : ''
                                    } ${item.isPublished ? 'border-gray-200' : 'border-dashed border-gray-300'}`}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
                                        <span className="flex items-center gap-1 text-sm font-semibold text-[#001F3F] cursor-grab">
                                            <GripVertical className="w-4 h-4 text-gray-400" />#{index + 1}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-label="Move up"
                                                onClick={() => move(index, index - 1)}
                                                disabled={index === 0 || savingOrder}
                                                className="rounded p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Move down"
                                                onClick={() => move(index, index + 1)}
                                                disabled={index === items.length - 1 || savingOrder}
                                                className="rounded p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`relative h-72 bg-gray-50 ${item.isPublished ? '' : 'opacity-50'}`}>
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.caption || `Customer review ${index + 1}`}
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="object-contain p-2"
                                        />
                                    </div>

                                    <div className="space-y-3 p-3">
                                        <input
                                            type="text"
                                            defaultValue={item.caption}
                                            placeholder="Caption (optional), e.g. Sarah, Audi A4"
                                            onBlur={(e) => saveCaption(item, e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#001F3F] focus:outline-none"
                                        />
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => togglePublished(item)}
                                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
                                                    item.isPublished
                                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                {item.isPublished ? 'Showing' : 'Hidden'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => remove(item)}
                                                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </>
                )}
            </div>
        </div>
    );
}
