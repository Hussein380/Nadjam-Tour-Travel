'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Star, Package } from 'lucide-react';
import { Package as PackageType } from '@/lib/types';
import PackageForm from '@/components/admin/PackageForm';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch('/api/packages');
            if (response.ok) {
                const data = await response.json();
                setPackages(data);
            } else {
                setError('Failed to fetch packages');
            }
        } catch (error) {
            setError('Failed to fetch packages');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (slug: string, updates: Partial<PackageType>) => {
        const token = await getAuthToken();
        if (!token) return;
        try {
            const response = await fetch(`/api/packages/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                fetchPackages();
            } else {
                setError('Failed to update package');
            }
        } catch (error) {
            setError('Failed to update package');
        }
    };

    const handleDelete = async (slug: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this package?');
        if (!confirmDelete) return;
        const token = await getAuthToken();
        if (!token) return;
        try {
            const response = await fetch(`/api/packages/${slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchPackages();
            } else {
                setError('Failed to delete package');
            }
        } catch (error) {
            setError('Failed to delete package');
        }
    };

    const handleToggleFeatured = async (pkg: PackageType) => {
        await handleUpdate(pkg.slug, { featured: !pkg.featured });
    };

    const handleToggleActive = async (pkg: PackageType) => {
        await handleUpdate(pkg.slug, { active: !pkg.active });
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Packages</h1>
                    <p className="text-gray-600 mt-2">
                        Create, edit, and manage travel packages
                    </p>
                </div>
                <Button asChild className="flex items-center space-x-2">
                    <Link href="/admin/packages/new">
                        <Plus className="w-4 h-4" />
                        <span>Add Package</span>
                    </Link>
                </Button>
                {/* Edit Dialog */}
                <Dialog open={!!editingPackage} onOpenChange={(open) => { if (!open) setEditingPackage(null); }}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Package</DialogTitle>
                        </DialogHeader>
                        {editingPackage && <PackageForm initialData={editingPackage} />}
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <Card key={pkg.id} className="relative">
                        {/* Images Carousel */}
                        {(pkg.images && pkg.images.length > 0) ? (
                            <div className="relative w-full h-48 bg-gray-100">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    className="rounded-t-lg overflow-hidden h-full"
                                >
                                    {pkg.images.map((url, idx) => (
                                        <SwiperSlide key={idx}>
                                            <div className="relative w-full h-48">
                                                <img
                                                    src={url}
                                                    alt={`Package image ${idx + 1}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ) : (
                            pkg.image ? (
                                <div className="relative w-full h-48 bg-gray-100">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="object-cover w-full h-full rounded-t-lg"
                                    />
                                </div>
                            ) : null
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{pkg.title}</CardTitle>
                                    <p className="text-gray-600 text-sm">{pkg.location}</p>
                                    <p className="text-gray-500 text-xs">{pkg.duration}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={pkg.featured}
                                        onCheckedChange={() => handleToggleFeatured(pkg)}
                                    />
                                    <Star className={`w-4 h-4 ${pkg.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {pkg.description}
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">${pkg.price}</span>
                                    <Badge variant={pkg.active ? 'default' : 'secondary'}>
                                        {pkg.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Rating:</span>
                                    <span className="font-semibold">{pkg.rating}/5</span>
                                    <span className="text-sm text-gray-600">({pkg.reviews} reviews)</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-xs">{pkg.category}</Badge>
                                    <Badge variant="outline" className="text-xs">{pkg.difficulty}</Badge>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleToggleActive(pkg)}
                                    >
                                        {pkg.active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingPackage(pkg)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(pkg.slug)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {packages.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                    <p className="text-gray-600">Get started by adding your first travel package.</p>
                </div>
            )}
        </div>
    );
} 