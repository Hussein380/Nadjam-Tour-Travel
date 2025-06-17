'use client';

import HotelForm from '@/components/admin/HotelForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewHotelPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Hotel</CardTitle>
                <p className="text-sm text-gray-500">
                    Fill out the form below to add a new hotel to the listings.
                </p>
            </CardHeader>
            <CardContent>
                <HotelForm />
            </CardContent>
        </Card>
    );
} 