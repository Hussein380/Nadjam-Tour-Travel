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

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        location: '',
        price: 0,
        originalPrice: 0,
        duration: '',
        rating: 0,
        reviews: 0,
        image: '',
        description: '',
        category: '',
        discount: 0,
        highlights: '',
        difficulty: '',
        groupSize: '',
        featured: false,
        active: true,
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch('/api/packages?active=false');
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/packages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`,
                },
                body: JSON.stringify({
                    ...formData,
                    highlights: formData.highlights.split(',').map(h => h.trim()),
                }),
            });

            if (response.ok) {
                setIsCreateDialogOpen(false);
                resetForm();
                fetchPackages();
            } else {
                setError('Failed to create package');
            }
        } catch (error) {
            setError('Failed to create package');
        }
    };

    const handleUpdate = async (slug: string, updates: Partial<PackageType>) => {
        try {
            const response = await fetch(`/api/packages/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`,
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
        if (!confirm('Are you sure you want to delete this package?')) return;

        try {
            const response = await fetch(`/api/packages/${slug}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${await getAuthToken()}`,
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

    const resetForm = () => {
        setFormData({
            slug: '',
            title: '',
            location: '',
            price: 0,
            originalPrice: 0,
            duration: '',
            rating: 0,
            reviews: 0,
            image: '',
            description: '',
            category: '',
            discount: 0,
            highlights: '',
            difficulty: '',
            groupSize: '',
            featured: false,
            active: true,
        });
    };

    const getAuthToken = async () => {
        // This would get the Firebase auth token
        // For now, we'll need to implement this properly
        return '';
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
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Package</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Package</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="bali-paradise"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="7 Days"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                                    <Input
                                        id="originalPrice"
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="discount">Discount (%)</Label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Beach & Culture"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Input
                                        id="difficulty"
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                        placeholder="Easy"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                                <Input
                                    id="highlights"
                                    value={formData.highlights}
                                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                    placeholder="Private Beach Access, Temple Tours, Spa Treatments"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit">Create Package</Button>
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
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