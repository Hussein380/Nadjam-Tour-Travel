'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Star, Building2 } from 'lucide-react';
import { Hotel } from '@/lib/types';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminHotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'delete' | 'deactivate' | null;
        hotel: Hotel | null;
    }>({ open: false, type: null, hotel: null });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch all hotels, not just active
            const response = await fetch('/api/hotels');
            if (response.ok) {
                const data = await response.json();
                setHotels(data);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to fetch hotels');
                toast.error(errorData.error || 'Failed to fetch hotels');
            }
        } catch (error) {
            setError('An error occurred while fetching hotels.');
            toast.error('An error occurred while fetching hotels.');
        } finally {
            setLoading(false);
        }
    };

    const getAuthToken = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            toast.error('Authentication error. Please sign in again.');
            return null;
        }
        return user.getIdToken();
    };

    const handleUpdate = async (id: string, updates: Partial<Hotel>) => {
        // Only show confirm dialog for deactivation
        if (updates.active === false) {
            const hotel = hotels.find(h => h.id === id) || null;
            setConfirmDialog({ open: true, type: 'deactivate', hotel });
            return;
        }
        // For featured toggle or reactivation, just update
        const token = await getAuthToken();
        if (!token) return;
        try {
            const response = await fetch(`/api/hotels/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                toast.success('Hotel updated successfully!');
                fetchHotels();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to update hotel.');
            }
        } catch (error) {
            toast.error('An error occurred while updating the hotel.');
        }
    };

    const handleDelete = async (id: string) => {
        const hotel = hotels.find(h => h.id === id) || null;
        setConfirmDialog({ open: true, type: 'delete', hotel });
    };

    // ConfirmDialog handlers
    const handleConfirm = async () => {
        if (!confirmDialog.hotel) return;
        if (confirmDialog.type === 'delete') {
            // Actually delete
            const token = await getAuthToken();
            if (!token) return;
            try {
                const response = await fetch(`/api/hotels/${confirmDialog.hotel.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    toast.success('Hotel deleted successfully!');
                    fetchHotels();
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.error || 'Failed to delete hotel.');
                }
            } catch (error) {
                toast.error('An error occurred while deleting the hotel.');
            }
        } else if (confirmDialog.type === 'deactivate') {
            // Actually deactivate
            const token = await getAuthToken();
            if (!token) return;
            try {
                const response = await fetch(`/api/hotels/${confirmDialog.hotel.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ active: false }),
                });
                if (response.ok) {
                    toast.success('Hotel deactivated successfully!');
                    fetchHotels();
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.error || 'Failed to deactivate hotel.');
                }
            } catch (error) {
                toast.error('An error occurred while deactivating the hotel.');
            }
        }
        setConfirmDialog({ open: false, type: null, hotel: null });
    };
    const handleCancel = () => {
        setConfirmDialog({ open: false, type: null, hotel: null });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Manage Hotels</h2>
                    <p className="text-gray-500">A list of all hotels in your database.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/hotels/new">
                        <Plus className="mr-2 h-4 w-4" /> Add New Hotel
                    </Link>
                </Button>
            </div>

            {/* Only show error if there is a real error, not just when hotels is empty */}
            {error && hotels.length === 0 && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                    <Card key={hotel.id} className="relative flex flex-col justify-between">
                        {(hotel.images && hotel.images.length > 0) ? (
                            <div className="relative w-full h-48 bg-gray-100">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    className="rounded-t-lg overflow-hidden h-full"
                                >
                                    {hotel.images.map((url, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="relative w-full h-48">
                                                <Image
                                                    src={url}
                                                    alt={`Hotel image ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ) : (
                            hotel.image ? (
                                <div className="relative w-full h-48 bg-gray-100">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                                </div>
                            ) : null
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 mr-2">
                                    <CardTitle className="text-lg leading-tight">{hotel.name}</CardTitle>
                                    <p className="text-gray-500 text-sm mt-1">{hotel.location}</p>
                                    {hotel.description && (
                                        <p className="text-gray-700 text-sm mt-1 line-clamp-2">{hotel.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id={`featured-${hotel.id}`}
                                        checked={hotel.featured}
                                        onCheckedChange={() => handleUpdate(hotel.id, { featured: !hotel.featured, active: hotel.active })}
                                    />
                                    <label htmlFor={`featured-${hotel.id}`}>
                                        <Star className={`w-4 h-4 transition-colors ${hotel.featured ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    </label>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold">${hotel.price}</span>
                                <Badge variant={hotel.active ? 'default' : 'secondary'}>
                                    {hotel.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>Rating: {hotel.rating}/5</span>
                                <span>({hotel.reviews} reviews)</span>
                            </div>
                        </CardContent>
                        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
                            {hotel.active ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdate(hotel.id, { active: false })}
                                >
                                    Deactivate
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdate(hotel.id, { active: true })}
                                >
                                    Reactivate
                                </Button>
                            )}
                            <div className="flex items-center space-x-2">
                                <Button asChild size="icon" variant="ghost">
                                    <Link href={`/admin/hotels/edit/${hotel.id}`}>
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(hotel.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {hotels.length === 0 && !loading && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg mt-6">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                    <p className="text-gray-600">Get started by adding your first hotel.</p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/hotels/new">
                            <Plus className="mr-2 h-4 w-4" /> Add New Hotel
                        </Link>
                    </Button>
                </div>
            )}

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.type === 'delete' ? 'Delete Hotel?' : 'Deactivate Hotel?'}
                description={confirmDialog.type === 'delete'
                    ? `Are you sure you want to permanently delete "${confirmDialog.hotel?.name}"? This action cannot be undone.`
                    : `Are you sure you want to deactivate "${confirmDialog.hotel?.name}"? The hotel will no longer be visible to users.`}
                confirmText={confirmDialog.type === 'delete' ? 'Delete' : 'Deactivate'}
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
} 