'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Hotel } from '@/lib/types';
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
import { LocationDropdown } from './LocationDropdown';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    location: z.string().min(2, 'Location is required.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    amenities: z.string().min(1, 'Please list at least one amenity.'),
    category: z.string().min(2, 'Category is required.'),
    price: z.coerce.number().min(0, 'Price must be a positive number.'),
    originalPrice: z.coerce.number().min(0, 'Original price must be a positive number.'),
    discount: z.coerce.number().min(0).max(100, 'Discount must be between 0 and 100.'),
    rating: z.coerce.number().min(0).max(5, 'Rating must be between 0 and 5.'),
    reviews: z.coerce.number().min(0, 'Reviews must be a positive number.'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    types: z.array(z.enum(['Budget', 'Standard', 'Luxury'])).min(1, 'Select at least one hotel type.'),
    propertyHighlights: z.array(z.string()).optional(),
    leisureActivities: z.string().optional(),
    nearbyAttractions: z.string().optional(),
    roomTypes: z.array(
        z.object({
            type: z.string().optional(),
            beds: z.string().optional(),
            price: z.string().optional(),
        })
    ).optional(),
    reviewsList: z.string().optional(),
    mapEmbedUrl: z.string().optional(),
});

type HotelFormValues = z.infer<typeof formSchema>;

interface HotelFormProps {
    initialData?: Hotel;
}

export default function HotelForm({ initialData }: HotelFormProps) {
    const router = useRouter();
    // Multiple image upload state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
    const [replacementUploads, setReplacementUploads] = useState<{ [idx: number]: string }>({});
    const form = useForm<HotelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            amenities: initialData.amenities.join(', '),
            types: (initialData.types?.filter((t: any) => ['Budget', 'Standard', 'Luxury'].includes(t)) as ("Budget" | "Standard" | "Luxury")[]) || [],
            propertyHighlights: initialData.propertyHighlights || [],
            leisureActivities: initialData.leisureActivities?.join(', ') || '',
            nearbyAttractions: initialData.nearbyAttractions?.join(', ') || '',
            roomTypes: Array.isArray(initialData.roomTypes) ? initialData.roomTypes : [],
            reviewsList: initialData.reviewsList ? JSON.stringify(initialData.reviewsList, null, 2) : '',
            mapEmbedUrl: initialData.mapEmbedUrl || '',
        } : {
            name: '',
            location: '',
            description: '',
            amenities: '',
            category: 'Boutique',
            price: 100,
            originalPrice: 120,
            discount: 15,
            rating: 4.5,
            reviews: 100,
            featured: false,
            active: true,
            types: [],
            propertyHighlights: [],
            leisureActivities: '',
            nearbyAttractions: '',
            roomTypes: [],
            reviewsList: '',
            mapEmbedUrl: '',
        },
    });

    // Add this effect to update the form when initialData changes
    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                amenities: initialData.amenities.join(', '),
                types: (initialData.types?.filter((t: any) => ['Budget', 'Standard', 'Luxury'].includes(t)) as ("Budget" | "Standard" | "Luxury")[]) || [],
                propertyHighlights: initialData.propertyHighlights || [],
                leisureActivities: initialData.leisureActivities?.join(', ') || '',
                nearbyAttractions: initialData.nearbyAttractions?.join(', ') || '',
                roomTypes: Array.isArray(initialData.roomTypes) ? initialData.roomTypes : [],
                reviewsList: initialData.reviewsList ? JSON.stringify(initialData.reviewsList, null, 2) : '',
                mapEmbedUrl: initialData.mapEmbedUrl || '',
            });
        }
    }, [initialData, form]);

    const { formState: { isSubmitting }, setValue } = form;

    // --- propertyHighlights dynamic field array ---
    // UseFieldArray for propertyHighlights
    const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
        control: form.control,
        name: 'propertyHighlights',
    });

    // --- roomTypes dynamic field array ---
    // UseFieldArray for roomTypes
    const { fields: roomTypeFields, append: appendRoomType, remove: removeRoomType } = useFieldArray({
        control: form.control,
        name: 'roomTypes',
    });

    const onSubmit = async (values: HotelFormValues) => {
        console.log('HotelForm onSubmit triggered', values);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('You must be logged in to perform this action.');
            const token = await user.getIdToken();

            // 1. Compress all selected images
            let uploadedImageUrls: string[] = [];
            if (imageFiles.length > 0) {
                const compressedFiles: File[] = [];
                for (const file of imageFiles) {
                    try {
                        const compressed = await imageCompression(file, {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                        });
                        console.log('Compressed image:', compressed);
                        if (compressed.size > 10 * 1024 * 1024) {
                            toast.error('One of the images is still too large after compression (max 10MB).');
                            return;
                        }
                        compressedFiles.push(compressed);
                    } catch (err) {
                        toast.error('Image compression failed.');
                        console.error('Image compression error:', err);
                        return;
                    }
                }
                // 2. Upload all images to /api/upload
                const formData = new FormData();
                compressedFiles.forEach((file, idx) => {
                    formData.append('images', file, file.name);
                });
                console.log('Uploading images to /api/upload', formData);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!uploadRes.ok) {
                    toast.error('Image upload failed.');
                    console.error('Image upload failed:', uploadRes.status, await uploadRes.text());
                    return;
                }
                const uploadJson = await uploadRes.json();
                uploadedImageUrls = uploadJson.urls || [];
                console.log('Uploaded image URLs:', uploadedImageUrls);
                if (!Array.isArray(uploadedImageUrls) || uploadedImageUrls.length !== compressedFiles.length) {
                    toast.error('Image upload failed: unexpected response.');
                    return;
                }
            }

            // 3. Submit hotel data with image URLs
            const method = initialData ? 'PUT' : 'POST';
            const url = initialData ? `/api/hotels/${initialData.id}` : '/api/hotels';
            const allImages = [...existingImages, ...uploadedImageUrls];
            const hotelPayload = {
                ...values,
                images: allImages, // Array of image URLs
                image: allImages[0] || '',
                amenities: values.amenities.split(',').map((a: string) => a.trim()),
                types: values.types,
                propertyHighlights: values.propertyHighlights,
                leisureActivities: values.leisureActivities?.split(',').map((a: string) => a.trim()) || [],
                nearbyAttractions: values.nearbyAttractions?.split(',').map((a: string) => a.trim()) || [],
                roomTypes: values.roomTypes,
                reviewsList: values.reviewsList ? JSON.parse(values.reviewsList) : [],
                mapEmbedUrl: values.mapEmbedUrl,
            };
            console.log('Sending hotelPayload to API:', hotelPayload);
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(hotelPayload),
            });
            console.log('API response:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error:', errorData);
                throw new Error(errorData.error || 'Something went wrong.');
            }
            toast.success(initialData ? 'Hotel updated successfully!' : 'Hotel created successfully!');
            router.push('/admin/hotels');
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
            console.error('onSubmit error:', err);
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

    // Remove image
    const handleRemoveImage = (idx: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    // Remove existing image
    const handleRemoveExistingImage = (idx: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    // Handle replacement image upload
    const handleReplacementUpload = (idx: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            setReplacementUploads(prev => ({ ...prev, [idx]: ev.target?.result as string }));
            setImageFiles(prev => [...prev, file]);
        };
        reader.readAsDataURL(file);
    };

    console.log('formState.errors', form.formState.errors);

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log('Validation failed:', errors);
                })}
                className="space-y-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hotel Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., The Grand Hotel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <LocationDropdown {...field} />
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
                                <Textarea rows={5} placeholder="A detailed description of the hotel..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Existing Images Swiper */}
                {existingImages.length > 0 && (
                    <div className="mb-4">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={16}
                            slidesPerView={1}
                            className="rounded-lg overflow-hidden h-56"
                        >
                            {existingImages.map((url, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative w-full h-56">
                                        {url ? (
                                            <>
                                                <Image
                                                    src={url}
                                                    alt={`Hotel image ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20"
                                                    onClick={() => handleRemoveExistingImage(idx)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
                                                {replacementUploads[idx] ? (
                                                    <Image src={replacementUploads[idx]} alt="Replacement Preview" fill className="object-cover" />
                                                ) : (
                                                    <>
                                                        <label className="cursor-pointer text-blue-600 underline">
                                                            Upload Replacement
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={e => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        handleReplacementUpload(idx, e.target.files[0]);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                {/* Multiple Image Upload Section */}
                <div>
                    <FormLabel>Hotel Images</FormLabel>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="hotel-images-upload"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor="hotel-images-upload"
                        className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 mb-4"
                    >
                        <UploadCloud size={40} className="mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, or WEBP. You can select multiple images.</p>
                    </label>
                    {/* Previews */}
                    <div className="flex flex-wrap gap-4">
                        {imagePreviews.map((src, idx) => (
                            <div key={idx} className="relative w-32 h-32 border rounded overflow-hidden">
                                <Image src={src} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    onClick={() => handleRemoveImage(idx)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amenities</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Free WiFi, Pool, Spa" {...field} />
                            </FormControl>
                            <FormDescription>
                                Please provide a comma-separated list of amenities.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Hotel Type Selection */}
                <FormField
                    control={form.control}
                    name="types"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hotel Type</FormLabel>
                            <div className="flex gap-4">
                                {(['Budget', 'Standard', 'Luxury'] as const).map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={field.value.includes(type)}
                                            onChange={() => {
                                                if (field.value.includes(type)) {
                                                    field.onChange(field.value.filter((t: typeof type) => t !== type));
                                                } else {
                                                    field.onChange([...field.value, type]);
                                                }
                                            }}
                                            className="accent-blue-600"
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                            <FormDescription>
                                Select one or more hotel types that apply.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (per night)</FormLabel>
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
                                <FormLabel>Original Price</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    The price before any discount.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Luxury, Boutique" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                <FormLabel>Number of Reviews</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex items-center space-x-8">
                    <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>
                                        Display this hotel on the homepage.
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
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Active</FormLabel>
                                    <FormDescription>
                                        Make this hotel visible on the site.
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
                </div>
                {/* --- New Optional Sections --- */}
                <div>
                    <FormField
                        control={form.control}
                        name="propertyHighlights"
                        render={() => (
                            <FormItem>
                                <FormLabel>Property Highlights (optional)</FormLabel>
                                {form.watch('propertyHighlights')?.map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <Input
                                            {...form.register(`propertyHighlights.${idx}` as const)}
                                            placeholder="e.g., Top Location"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const arr = [...form.getValues('propertyHighlights')];
                                                arr.splice(idx, 1);
                                                form.setValue('propertyHighlights', arr);
                                            }}
                                        >-</Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => form.setValue('propertyHighlights', [...(form.getValues('propertyHighlights') || []), ''])}
                                >+ Add Highlight</Button>
                                <FormDescription>
                                    Add one or more highlights for this property.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="leisureActivities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Leisure & Activities (optional)</FormLabel>
                            <FormControl>
                                <Textarea rows={2} placeholder="e.g., Yoga, Spa, Kids Playground" {...field} />
                            </FormControl>
                            <FormDescription>Comma-separated list of activities (e.g., Yoga, Spa, Kids Playground).</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nearbyAttractions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nearby Attractions (optional)</FormLabel>
                            <FormControl>
                                <Textarea rows={2} placeholder="e.g., National Park, Beach, Museum" {...field} />
                            </FormControl>
                            <FormDescription>Comma-separated list of attractions (e.g., National Park, Beach, Museum).</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* --- Room Types Section --- */}
                <div>
                    <FormLabel>Room Types & Prices (optional)</FormLabel>
                    {roomTypeFields.map((field, idx) => (
                        <div key={field.id} className="flex flex-wrap gap-2 mb-2 items-end">
                            <Input
                                {...form.register(`roomTypes.${idx}.type` as const)}
                                defaultValue={field.type ?? ''}
                                placeholder="Type (e.g., Deluxe)"
                                className="w-32"
                            />
                            <Input
                                {...form.register(`roomTypes.${idx}.beds` as const)}
                                defaultValue={field.beds ?? ''}
                                placeholder="Beds (e.g., 1 king)"
                                className="w-32"
                            />
                            <Input
                                {...form.register(`roomTypes.${idx}.price` as const)}
                                defaultValue={field.price ?? ''}
                                placeholder="Price"
                                type="number"
                                className="w-24"
                            />
                            <Button type="button" variant="outline" onClick={() => removeRoomType(idx)}>-</Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={() => appendRoomType({ type: '', beds: '', price: '' })}>+ Add Room Type</Button>
                    <FormDescription>
                        Add one or more room types for this hotel. Each entry should have a type, beds, and price.
                    </FormDescription>
                    <FormMessage />
                </div>
                <FormField
                    control={form.control}
                    name="reviewsList"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Guest Reviews (optional, JSON)</FormLabel>
                            <FormControl>
                                <Textarea rows={3} placeholder='e.g., [{"name":"John","rating":5,"comment":"Great stay!"}]' {...field} />
                            </FormControl>
                            <FormDescription>Enter an array of objects: <code>[{'{"name":"John","rating":5,"comment":"Great stay!"}'}]</code></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mapEmbedUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Map Embed URL (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Paste Google Maps embed URL here" {...field} />
                            </FormControl>
                            <FormDescription>Paste the Google Maps embed URL for this hotel location.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Hotel')}
                </Button>
                <button type="submit">Test Native Submit</button>
            </form>
        </FormProvider>
    );
}