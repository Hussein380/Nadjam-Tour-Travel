'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import HotelForm from '@/components/admin/HotelForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel } from '@/lib/types';
import { toast } from 'sonner';
import { getAuth } from 'firebase/auth';

export default function EditHotelPage({ params }: { params: { id: string } }) {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;
        const fetchHotel = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const token = user && (await user.getIdToken());
                const response = await fetch(`/api/hotels/${params.id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch hotel data.');
                }
                const data = await response.json();
                setHotel(data);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [params?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-4">Loading hotel data...</p>
            </div>
        )
    }

    if (!hotel) {
        return <p>Hotel not found.</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Hotel</CardTitle>
                <p className="text-sm text-gray-500">
                    Update the details for &quot;{hotel.name}&quot;.
                </p>
            </CardHeader>
            <CardContent>
                <HotelForm initialData={hotel} />
            </CardContent>
        </Card>
    );
}