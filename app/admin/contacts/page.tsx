'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authService } from '@/lib/auth';
import { Mail, Phone, Calendar, Check, Loader, Car, MessageSquare, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    read: boolean;
    createdAt: any;
}

interface CarInquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    carId: string;
    carDetails: {
        make: string;
        model: string;
        year: number;
        price: number;
    };
    status: string;
    read: boolean;
    createdAt: any;
}

export default function ContactsPage() {
    const router = useRouter();
    const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
    const [carInquiries, setCarInquiries] = useState<CarInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'contacts' | 'inquiries'>('contacts');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
        loadData();
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

    const loadData = async () => {
        try {
            // Load contact submissions
            const contactsQuery = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));
            const contactsSnapshot = await getDocs(contactsQuery);
            const contactsData = contactsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ContactSubmission[];
            setContactSubmissions(contactsData);

            // Load car inquiries
            const inquiriesQuery = query(collection(db, 'carInquiries'), orderBy('createdAt', 'desc'));
            const inquiriesSnapshot = await getDocs(inquiriesQuery);
            const inquiriesData = inquiriesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CarInquiry[];
            setCarInquiries(inquiriesData);

        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string, collectionName: 'contactSubmissions' | 'carInquiries') => {
        try {
            await updateDoc(doc(db, collectionName, id), {
                read: true,
                status: 'read'
            });

            if (collectionName === 'contactSubmissions') {
                setContactSubmissions(prev => prev.map(sub =>
                    sub.id === id ? { ...sub, read: true, status: 'read' } : sub
                ));
            } else {
                setCarInquiries(prev => prev.map(inquiry =>
                    inquiry.id === id ? { ...inquiry, read: true, status: 'read' } : inquiry
                ));
            }

            toast.success('Marked as read');
        } catch (error) {
            toast.error('Error updating message');
        }
    };

    const deleteMessage = async (id: string, collectionName: 'contactSubmissions' | 'carInquiries', name: string) => {
        if (!confirm(`Are you sure you want to delete the message from ${name}? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(id);
        try {
            await deleteDoc(doc(db, collectionName, id));

            if (collectionName === 'contactSubmissions') {
                setContactSubmissions(prev => prev.filter(sub => sub.id !== id));
            } else {
                setCarInquiries(prev => prev.filter(inquiry => inquiry.id !== id));
            }

            toast.success('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        } finally {
            setDeletingId(null);
        }
    };

    const deleteAllRead = async (collectionName: 'contactSubmissions' | 'carInquiries') => {
        const messages = collectionName === 'contactSubmissions' ? contactSubmissions : carInquiries;
        const readMessages = messages.filter(msg => msg.read);

        if (readMessages.length === 0) {
            toast.error('No read messages to delete');
            return;
        }

        if (!confirm(`Are you sure you want to delete all ${readMessages.length} read ${collectionName === 'contactSubmissions' ? 'contact forms' : 'car inquiries'}? This action cannot be undone.`)) {
            return;
        }

        try {
            const deletePromises = readMessages.map(msg =>
                deleteDoc(doc(db, collectionName, msg.id))
            );

            await Promise.all(deletePromises);

            if (collectionName === 'contactSubmissions') {
                setContactSubmissions(prev => prev.filter(sub => !sub.read));
            } else {
                setCarInquiries(prev => prev.filter(inquiry => !inquiry.read));
            }

            toast.success(`Deleted ${readMessages.length} read messages`);
        } catch (error) {
            console.error('Error deleting read messages:', error);
            toast.error('Failed to delete read messages');
        }
    };

    const getUnreadCount = () => {
        const contactUnread = contactSubmissions.filter(sub => !sub.read).length;
        const inquiryUnread = carInquiries.filter(inquiry => !inquiry.read).length;
        return { contactUnread, inquiryUnread };
    };

    const { contactUnread, inquiryUnread } = getUnreadCount();

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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[#001F3F] mb-2">Customer Messages</h1>
                        <p className="text-gray-600">Manage contact forms and car inquiries</p>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex gap-2">
                        {activeTab === 'contacts' && contactSubmissions.some(sub => sub.read) && (
                            <button
                                onClick={() => deleteAllRead('contactSubmissions')}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete All Read
                            </button>
                        )}
                        {activeTab === 'inquiries' && carInquiries.some(inquiry => inquiry.read) && (
                            <button
                                onClick={() => deleteAllRead('carInquiries')}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete All Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                            activeTab === 'contacts'
                                ? 'bg-[#D32F2F] text-white'
                                : 'text-gray-600 hover:text-[#D32F2F]'
                        }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span>Contact Forms</span>
                        {contactUnread > 0 && (
                            <span className="bg-white text-[#D32F2F] px-2 py-1 rounded-full text-xs font-bold">
                                {contactUnread}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                            activeTab === 'inquiries'
                                ? 'bg-[#D32F2F] text-white'
                                : 'text-gray-600 hover:text-[#D32F2F]'
                        }`}
                    >
                        <Car className="w-5 h-5" />
                        <span>Car Inquiries</span>
                        {inquiryUnread > 0 && (
                            <span className="bg-white text-[#D32F2F] px-2 py-1 rounded-full text-xs font-bold">
                                {inquiryUnread}
                            </span>
                        )}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-[#001F3F]">
                            {contactSubmissions.length + carInquiries.length}
                        </div>
                        <div className="text-gray-600 text-sm">Total Messages</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-[#D32F2F]">
                            {contactUnread + inquiryUnread}
                        </div>
                        <div className="text-gray-600 text-sm">Unread Messages</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">
                            {(contactSubmissions.length + carInquiries.length) - (contactUnread + inquiryUnread)}
                        </div>
                        <div className="text-gray-600 text-sm">Read Messages</div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'contacts' && (
                        <>
                            {contactSubmissions.map((submission, index) => (
                                <MessageCard
                                    key={submission.id}
                                    type="contact"
                                    data={submission}
                                    onMarkRead={() => markAsRead(submission.id, 'contactSubmissions')}
                                    onDelete={() => deleteMessage(submission.id, 'contactSubmissions', submission.name)}
                                    isDeleting={deletingId === submission.id}
                                    index={index}
                                />
                            ))}
                            {contactSubmissions.length === 0 && (
                                <EmptyState type="contact" />
                            )}
                        </>
                    )}

                    {activeTab === 'inquiries' && (
                        <>
                            {carInquiries.map((inquiry, index) => (
                                <MessageCard
                                    key={inquiry.id}
                                    type="inquiry"
                                    data={inquiry}
                                    onMarkRead={() => markAsRead(inquiry.id, 'carInquiries')}
                                    onDelete={() => deleteMessage(inquiry.id, 'carInquiries', inquiry.name)}
                                    isDeleting={deletingId === inquiry.id}
                                    index={index}
                                />
                            ))}
                            {carInquiries.length === 0 && (
                                <EmptyState type="inquiry" />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Message Card Component
const MessageCard = ({ type, data, onMarkRead, onDelete, isDeleting, index }: any) => {
    const isContact = type === 'contact';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                !data.read ? 'border-l-4 border-[#D32F2F]' : ''
            }`}
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-[#001F3F]">
                            {isContact ? data.subject : `${data.carDetails.make} ${data.carDetails.model}`}
                        </h3>
                        <div className="flex items-center gap-2">
                            {!data.read && (
                                <span className="bg-[#D32F2F] text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    New
                                </span>
                            )}
                            {!isContact && (
                                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    Car Inquiry
                                </span>
                            )}
                            {data.read && (
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    Read
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <span className="font-semibold text-[#001F3F]">{data.name}</span>
                    </div>

                    <p className="text-gray-700 mb-4">{data.message}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-[#D32F2F]" />
                            <span className="break-all">{data.email}</span>
                        </div>
                        {data.phone && (
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-[#D32F2F]" />
                                <span>{data.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-[#D32F2F]" />
                            <span>
                                {data.createdAt?.toDate().toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    {!isContact && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm">
                                <Car className="w-4 h-4 text-blue-500" />
                                <span>
                                    <strong>{data.carDetails.make} {data.carDetails.model}</strong>
                                    ({data.carDetails.year}) - £{data.carDetails.price?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        {!data.read && (
                            <button
                                onClick={onMarkRead}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex-1 justify-center"
                            >
                                <Check className="w-4 h-4" />
                                Mark Read
                            </button>
                        )}
                        <a
                            href={`mailto:${data.email}?subject=Re: ${isContact ? data.subject : `Your ${data.carDetails.make} ${data.carDetails.model} inquiry`}`}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1 justify-center"
                        >
                            <Mail className="w-4 h-4" />
                            Reply
                        </a>
                    </div>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Empty State Component
const EmptyState = ({ type }: { type: 'contact' | 'inquiry' }) => (
    <div className="text-center py-12">
        {type === 'contact' ? (
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        ) : (
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        )}
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No {type === 'contact' ? 'contact messages' : 'car inquiries'} yet
        </h3>
        <p className="text-gray-500">
            {type === 'contact'
                ? 'Customer contact forms will appear here'
                : 'Car inquiries from customers will appear here'
            }
        </p>
    </div>
);