'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Package as PackageType } from '@/lib/types';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@radix-ui/react-label';

const formSchema = z.object({
    slug: z.string().min(2, 'Slug must be at least 2 characters.'),
    title: z.string().min(2, 'Title is required.'),
    location: z.string().min(2, 'Location is required.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    amenities: z.string().optional(), // Not in PackageType, but for future use
    category: z.string().min(2, 'Category is required.'),
    price: z.coerce.number().min(0, 'Price must be a positive number.'),
    originalPrice: z.coerce.number().min(0, 'Original price must be a positive number.'),
    discount: z.coerce.number().min(0).max(100, 'Discount must be between 0 and 100.'),
    rating: z.coerce.number().min(0).max(5, 'Rating must be between 0 and 5.'),
    reviews: z.coerce.number().min(0, 'Reviews must be a positive number.'),
    duration: z.string().min(1, 'Duration is required.'),
    highlights: z.string().min(1, 'Please list at least one highlight.'),
    difficulty: z.string().min(1, 'Difficulty is required.'),
    groupSize: z.string().min(1, 'Group size is required.'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    itinerary: z.array(z.object({ day: z.number(), title: z.string(), description: z.string() })).optional(),
    inclusions: z.string().optional(),
    exclusions: z.string().optional(),
});

type PackageFormValues = z.infer<typeof formSchema>;

interface PackageFormProps {
    initialData?: PackageType;
}

export default function PackageForm({ initialData }: PackageFormProps) {
    const router = useRouter();
    // Multiple image upload state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || (initialData?.image ? [initialData.image] : []));
    const [replacementUploads, setReplacementUploads] = useState<{ [idx: number]: string }>({});
    const form = useForm<PackageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            highlights: (initialData.highlights || []).join(', '),
            inclusions: (initialData.inclusions || []).join(', '),
            exclusions: (initialData.exclusions || []).join(', '),
            itinerary: initialData.itinerary || [],
        } : {
            slug: '',
            title: '',
            location: '',
            description: '',
            amenities: '',
            category: '',
            price: 0,
            originalPrice: 0,
            discount: 0,
            rating: 0,
            reviews: 0,
            duration: '',
            highlights: '',
            difficulty: '',
            groupSize: '',
            featured: false,
            active: true,
            itinerary: [],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                highlights: (initialData.highlights || []).join(', '),
                inclusions: (initialData.inclusions || []).join(', '),
                exclusions: (initialData.exclusions || []).join(', '),
                itinerary: initialData.itinerary || [],
            });
            setExistingImages(initialData.images || (initialData.image ? [initialData.image] : []));
        }
    }, [initialData, form]);

    const { formState: { isSubmitting }, setValue } = form;

    const onSubmit = async (values: PackageFormValues) => {
        try {
            // Require at least one image, just like hotels
            if (existingImages.length + imageFiles.length === 0) {
                toast.error('Please upload at least one image for the package.');
                return;
            }
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('You must be logged in to perform this action.');
            const token = await user.getIdToken();

            // 1. Compress and upload new images (use /api/upload like hotels)
            let uploadedImageUrls: string[] = [...existingImages];
            if (imageFiles.length > 0) {
                const compressedFiles: File[] = [];
                for (const file of imageFiles) {
                    try {
                        const compressed = await imageCompression(file, {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1200,
                            useWebWorker: true,
                        });
                        if (compressed.size > 10 * 1024 * 1024) {
                            toast.error('One of the images is still too large after compression (max 10MB).');
                            return;
                        }
                        compressedFiles.push(compressed);
                    } catch (err) {
                        toast.error('Image compression failed.');
                        return;
                    }
                }
                // Upload all images to /api/upload
                const formData = new FormData();
                compressedFiles.forEach((file, idx) => {
                    formData.append('images', file, file.name);
                });
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!uploadRes.ok) {
                    toast.error('Image upload failed.');
                    return;
                }
                const uploadJson = await uploadRes.json();
                uploadedImageUrls = [...existingImages, ...(uploadJson.urls || [])];
                if (!Array.isArray(uploadedImageUrls) || uploadedImageUrls.length !== (existingImages.length + compressedFiles.length)) {
                    toast.error('Image upload failed: unexpected response.');
                    return;
                }
            }

            // 2. Submit package data with image URLs
            const method = initialData ? 'PUT' : 'POST';
            const url = initialData ? `/api/packages/${initialData.slug}` : '/api/packages';
            const packagePayload = {
                ...values,
                images: uploadedImageUrls, // Array of image URLs
                highlights: values.highlights.split(',').map((h: string) => h.trim()),
                active: values.active,
                featured: values.featured,
                inclusions: values.inclusions ? values.inclusions.split(',').map((i: string) => i.trim()) : undefined,
                exclusions: values.exclusions ? values.exclusions.split(',').map((e: string) => e.trim()) : undefined,
                itinerary: values.itinerary && values.itinerary.length > 0 ? values.itinerary : undefined,
            };
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(packagePayload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong.');
            }
            toast.success(initialData ? 'Package updated successfully!' : 'Package created successfully!');
            router.push('/admin/packages');
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
        }
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(prev => [...prev, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreviews(prev => [...prev, ev.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Remove image from preview and upload list
    const handleRemoveImage = (idx: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    // Remove existing image
    const handleRemoveExistingImage = (idx: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., bali-paradise" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Bali Paradise" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Bali, Indonesia" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 7 Days" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea rows={5} placeholder="A detailed description of the package..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Beach & Culture" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difficulty</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Easy" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Original Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="groupSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Group Size</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 10-20" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reviews"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reviews</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Highlights (comma-separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Private Beach Access, Temple Tours, Spa Treatments" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="itinerary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Itinerary (optional)</FormLabel>
                            <div className="space-y-4 mb-4">
                                {(form.watch('itinerary') || []).map((day, idx) => (
                                    <div key={idx} className="border rounded p-3 bg-gray-50">
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                type="number"
                                                min={1}
                                                className="w-20"
                                                value={day.day}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value, 10);
                                                    const arr = [...(form.getValues('itinerary') || [])];
                                                    arr[idx].day = isNaN(val) ? 1 : val;
                                                    form.setValue('itinerary', arr);
                                                }}
                                                placeholder="Day"
                                            />
                                            <Input
                                                className="flex-1"
                                                value={day.title}
                                                onChange={e => {
                                                    const arr = [...(form.getValues('itinerary') || [])];
                                                    arr[idx].title = e.target.value;
                                                    form.setValue('itinerary', arr);
                                                }}
                                                placeholder="Title"
                                            />
                                            <Button type="button" variant="destructive" size="icon" onClick={() => {
                                                const arr = [...(form.getValues('itinerary') || [])];
                                                arr.splice(idx, 1);
                                                form.setValue('itinerary', arr);
                                            }}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={day.description}
                                            onChange={e => {
                                                const arr = [...(form.getValues('itinerary') || [])];
                                                arr[idx].description = e.target.value;
                                                form.setValue('itinerary', arr);
                                            }}
                                            placeholder="Description"
                                            rows={2}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const arr = [...(form.getValues('itinerary') || [])];
                                        arr.push({ day: arr.length + 1, title: '', description: '' });
                                        form.setValue('itinerary', arr);
                                    }}
                                >
                                    Add Day
                                </Button>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="inclusions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Inclusions (optional)</FormLabel>
                            <FormControl>
                                <Textarea rows={2} placeholder="e.g., Flights, Hotel, Meals" {...field} />
                            </FormControl>
                            <FormDescription>Comma-separated list of what's included.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="exclusions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exclusions (optional)</FormLabel>
                            <FormControl>
                                <Textarea rows={2} placeholder="e.g., Visa fees, Insurance" {...field} />
                            </FormControl>
                            <FormDescription>Comma-separated list of what's not included.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Image Upload Section */}
                <div>
                    <FormLabel>Images</FormLabel>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {existingImages.map((url, idx) => (
                            <div key={idx} className="relative w-32 h-24">
                                <Image src={url} alt={`Existing image ${idx + 1}`} fill className="object-cover rounded" />
                                <button type="button" className="absolute top-1 right-1 bg-white rounded-full p-1 shadow" onClick={() => handleRemoveExistingImage(idx)}>
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                        {imagePreviews.map((src, idx) => (
                            <div key={idx} className="relative w-32 h-24">
                                <Image src={src} alt={`Preview image ${idx + 1}`} fill className="object-cover rounded" />
                                <button type="button" className="absolute top-1 right-1 bg-white rounded-full p-1 shadow" onClick={() => handleRemoveImage(idx)}>
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center w-32 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                            <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Add Images</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Active</FormLabel>
                                <FormDescription>
                                    Make this package visible on the site.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Featured</FormLabel>
                                <FormDescription>
                                    Feature this package on the homepage.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Package')}
                </Button>
            </form>
        </FormProvider>
    );
} 