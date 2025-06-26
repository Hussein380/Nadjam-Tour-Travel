"use client";

import PackageForm from '@/components/admin/PackageForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewPackagePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Package</CardTitle>
                <p className="text-sm text-gray-500">
                    Fill out the form below to add a new travel package to the listings.
                </p>
            </CardHeader>
            <CardContent>
                <PackageForm />
            </CardContent>
        </Card>
    );
} 