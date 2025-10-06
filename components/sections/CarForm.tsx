'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Upload,
    X,
    Plus,
    Trash2,
    Save,
    ArrowLeft,
    Calculator
} from 'lucide-react';
import { carService } from '@/lib/firestore';
import { cloudinaryService } from '@/lib/cloudinary';
import { Car, CarFormData } from '@/types';
import toast from 'react-hot-toast';

interface CarFormProps {
    car?: Car;
    isEdit?: boolean;
}

export default function CarForm({ car, isEdit = false }: CarFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<CarFormData>({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        downPayment: 0, // Add default value
        mileage: 0,
        fuelType: 'petrol',
        transmission: 'automatic',
        bodyType: 'sedan',
        color: '',
        description: '',
        features: [''],
        images: [],
        status: 'available',
        isFeatured: false,
        ...car
    });

    const [newFeature, setNewFeature] = useState('');

    // Calculate down payment as percentage of price
    const calculateDownPayment = (price: number, percentage: number) => {
        return Math.round(price * (percentage / 100));
    };

    const handlePriceChange = (price: number) => {
        setFormData(prev => {
            const newPrice = price;
            // If down payment is currently 0 or not set, calculate 10% default
            const currentDownPayment = prev.downPayment || 0;
            const shouldUpdateDownPayment = currentDownPayment === 0 ||
                (prev.price > 0 && Math.round((currentDownPayment / prev.price) * 100) === 10);

            let newDownPayment = currentDownPayment;

            if (shouldUpdateDownPayment && newPrice > 0) {
                newDownPayment = calculateDownPayment(newPrice, 10);
            }

            return {
                ...prev,
                price: newPrice,
                downPayment: newDownPayment
            };
        });
    };

    const handleDownPaymentChange = (downPayment: number) => {
        setFormData(prev => ({
            ...prev,
            downPayment
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit && car?.id) {
                await carService.updateCar(car.id, formData);
                toast.success('Car updated successfully');
            } else {
                await carService.addCar(formData);
                toast.success('Car added successfully');
            }
            router.push('/admin/cars');
        } catch (error) {
            toast.error(`Error ${isEdit ? 'updating' : 'adding'} car`);
            console.error(`Error ${isEdit ? 'updating' : 'adding'} car:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        try {
            const uploadResults = await cloudinaryService.uploadImages(Array.from(files));
            const newImages = uploadResults.map(result => result.secure_url);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
            toast.success('Images uploaded successfully');
        } catch (error) {
            toast.error('Error uploading images');
            console.error('Error uploading images:', error);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    const downPaymentPercentage = formData.price > 0
        ? Math.round((formData.downPayment / formData.price) * 100)
        : 0;

    return (
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            {isEdit ? 'Edit Car' : 'Add New Car'}
                        </h1>
                        <p className="text-gray-600">
                            {isEdit ? 'Update car details' : 'Add a new car to your inventory'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Make *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.make}
                                    onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                    placeholder="e.g., BMW"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.model}
                                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                    placeholder="e.g., 3 Series"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Year *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1990"
                                    max={new Date().getFullYear() + 1}
                                    value={formData.year}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (£) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Down Payment (£)
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max={formData.price}
                                        value={formData.downPayment}
                                        onChange={(e) => handleDownPaymentChange(parseInt(e.target.value) || 0)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                    />
                                    {formData.price > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calculator className="w-4 h-4" />
                                            <span>{downPaymentPercentage}% of total price</span>
                                            {formData.downPayment > 0 && (
                                                <span className="ml-auto font-semibold">
                                                    Balance: £{(formData.price - formData.downPayment).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mileage *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.mileage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                    placeholder="e.g., Midnight Blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fuel Type *
                                </label>
                                <select
                                    required
                                    value={formData.fuelType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value as any }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                >
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transmission *
                                </label>
                                <select
                                    required
                                    value={formData.transmission}
                                    onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value as any }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                >
                                    <option value="automatic">Automatic</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Body Type *
                                </label>
                                <select
                                    required
                                    value={formData.bodyType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bodyType: e.target.value as any }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                >
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="coupe">Coupe</option>
                                    <option value="convertible">Convertible</option>
                                    <option value="estate">Estate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                >
                                    <option value="available">Available</option>
                                    <option value="sold">Sold</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Description</h2>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                            placeholder="Describe the car's features, condition, and any special details..."
                        />
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Features</h2>
                        <div className="space-y-3">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                        placeholder="Enter a feature"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                                    placeholder="Add a new feature"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Images</h2>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Images
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <span className="text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </span>
                                    <span className="text-sm text-gray-500">
                    Supports JPG, PNG, WEBP (max 10MB each)
                  </span>
                                </label>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        {formData.images.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Uploaded Images ({formData.images.length})
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Car image ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Settings</h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                className="w-4 h-4 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300 rounded"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                                Feature this car on the homepage
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#D32F2F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : (isEdit ? 'Update Car' : 'Add Car')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}