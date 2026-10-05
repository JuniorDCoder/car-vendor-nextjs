'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ImagePlus, Loader, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cloudinaryService } from '@/lib/cloudinary';
import { siteSettingsService } from '@/lib/firestore';
import { SiteSettings } from '@/types';

const MAX_FILE_SIZE_MB = 10;

export default function SiteSettingsAdmin() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        siteSettingsService
            .get()
            .then(setSettings)
            .catch((error) => {
                console.error('Error loading settings:', error);
                toast.error('Failed to load settings');
            })
            .finally(() => setLoading(false));
    }, []);

    const uploadHeroImage = async (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith('image/') || file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error(`Please choose an image up to ${MAX_FILE_SIZE_MB}MB`);
            return;
        }
        try {
            setSaving(true);
            const [result] = await cloudinaryService.uploadImages([file]);
            const update = { heroImageUrl: result.secure_url, heroImagePublicId: result.public_id };
            await siteSettingsService.update(update);
            setSettings((current) => ({ ...current, ...update }));
            toast.success('Homepage photo updated');
        } catch (error) {
            console.error('Error uploading homepage photo:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setSaving(false);
            if (fileInput.current) fileInput.current.value = '';
        }
    };

    const removeHeroImage = async () => {
        if (!confirm('Remove the homepage photo? The homepage will show a photo of a car in stock instead.')) return;
        try {
            setSaving(true);
            await siteSettingsService.update({ heroImageUrl: '', heroImagePublicId: '' });
            setSettings((current) => ({ ...current, heroImageUrl: '', heroImagePublicId: '' }));
            toast.success('Homepage photo removed');
        } catch (error) {
            console.error('Error removing homepage photo:', error);
            toast.error('Could not remove the photo');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/admin" className="inline-flex items-center text-sm text-[#001F3F] hover:text-[#D32F2F] mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
                </Link>

                <h1 className="text-3xl font-bold text-[#001F3F]">Homepage Photo</h1>
                <p className="text-gray-600 mt-1 mb-8">
                    The large photo at the top of the homepage. A real photo of your showroom, forecourt or a car on site works best.
                    Use a landscape image at least 1600px wide.
                </p>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    {loading ? (
                        <div className="py-12 text-center text-gray-500">
                            <Loader className="w-6 h-6 mx-auto animate-spin text-[#D32F2F]" />
                        </div>
                    ) : (
                        <>
                            <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-gray-100">
                                {settings.heroImageUrl ? (
                                    <Image
                                        src={settings.heroImageUrl}
                                        alt="Current homepage photo"
                                        fill
                                        sizes="(min-width: 768px) 720px, 100vw"
                                        className="object-cover"
                                        data-testid="hero-preview"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-gray-500">
                                        No photo uploaded. The homepage currently shows a photo of one of your cars in stock.
                                    </div>
                                )}
                                {saving && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                        <Loader className="w-8 h-8 animate-spin text-[#D32F2F]" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => fileInput.current?.click()}
                                    className="inline-flex items-center gap-2 rounded-md bg-[#D32F2F] px-5 py-2.5 font-semibold text-white hover:bg-[#B71C1C] disabled:opacity-50"
                                >
                                    <ImagePlus className="w-4 h-4" />
                                    {settings.heroImageUrl ? 'Replace photo' : 'Upload photo'}
                                </button>
                                {settings.heroImageUrl && (
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={removeHeroImage}
                                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/*"
                                hidden
                                data-testid="hero-input"
                                onChange={(e) => uploadHeroImage(e.target.files?.[0])}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
