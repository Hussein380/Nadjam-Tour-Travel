'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Hotel } from '@/types';
import { getAuth } from 'firebase/auth';
// import Image from 'next/image';
// import { UploadCloud, X } from 'lucide-react';
import imageCompression from 'browser-image-compression'; // Re-added this import


import { Button } from '@/components/ui/button';
import {
    Form,
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
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    location: z.string().min(2, 'Location is required.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    // image: z
    //     .any()
    //     .refine((file) => file instanceof File || file === undefined, {
    //         message: 'Input must be a valid image file',
    //     })
    //     .optional(),
    amenities: z.string().min(1, 'Please list at least one amenity.'),
    category: z.string().min(2, 'Category is required.'),
    price: z.coerce.number().min(0, 'Price must be a positive number.'),
    originalPrice: z.coerce.number().min(0, 'Original price must be a positive number.'),
    discount: z.coerce.number().min(0).max(100, 'Discount must be between 0 and 100.'),
    rating: z.coerce.number().min(0).max(5, 'Rating must be between 0 and 5.'),
    reviews: z.coerce.number().min(0, 'Reviews must be a positive number.'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
});

type HotelFormValues = z.infer<typeof formSchema>;

interface HotelFormProps {
    initialData?: Hotel;
}

export default function HotelForm({ initialData }: HotelFormProps) {
    const router = useRouter();
    // const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
    // const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const form = useForm<HotelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            amenities: initialData.amenities.join(', '),
            // image: undefined,
        } : {
            name: '',
            location: '',
            description: '',
            // image: undefined,
            amenities: '',
            category: 'Boutique',
            price: 100,
            originalPrice: 120,
            discount: 15,
            rating: 4.5,
            reviews: 100,
            featured: false,
            active: true,
        },
    });

    const { formState: { isSubmitting }, setValue } = form;

    const onSubmit = async (values: HotelFormValues) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('You must be logged in to perform this action.');
            const token = await user.getIdToken();

            // Removed image upload logic for now
            // let imageUrl = initialData?.image || '';
            // if (imageFile) {
            //     const uploadData = new FormData();
            //     uploadData.append('image', imageFile);
            //     const uploadRes = await fetch('/api/upload', {
            //         method: 'POST',
            //         body: uploadData,
            //     });
            //     if (!uploadRes.ok) {
            //         throw new Error('Image upload failed.');
            //     }
            //     const uploadJson = await uploadRes.json();
            //     imageUrl = uploadJson.url;
            // }

            const method = initialData ? 'PUT' : 'POST';
            const url = initialData ? `/api/hotels/${initialData.id}` : '/api/hotels';
            const hotelPayload = {
                ...values,
                // image: imageUrl, // Temporarily remove image from payload
                amenities: values.amenities.split(',').map((a: string) => a.trim()),
            };
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(hotelPayload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong.');
            }
            toast.success(initialData ? 'Hotel updated successfully!' : 'Hotel created successfully!');
            router.push('/admin/hotels');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to submit hotel form:', error);
            toast.error(error.message || 'An unexpected error occurred.');
        }
    };

    // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     const options = {
    //         maxSizeMB: 1, // Compress to max 1MB
    //         maxWidthOrHeight: 1920,
    //         useWebWorker: true,
    //     };
    //     try {
    //         const compressedBlob = await imageCompression(file, options);
    //         const compressedFile = new File([compressedBlob], file.name, { type: file.type });
    //         if (compressedFile.size > 10 * 1024 * 1024) {
    //             toast.error('Image too large to upload. Please choose a smaller image.');
    //             return;
    //         }
    //         setImageFile(compressedFile);
    //         setValue('image', compressedFile, { shouldValidate: true });
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(compressedFile);
    //     } catch (error) {
    //         console.error('Image compression failed:', error);
    //         toast.error('Could not compress image. Please try again or choose a different file.');
    //         return;
    //     }
    // };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                <FormLabel>Location</Label>
                                <FormControl>
                                    <Input placeholder="e.g., New York, USA" {...field} />
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
                            <FormLabel>Description</Label>
                            <FormControl>
                                <Textarea rows={5} placeholder="A detailed description of the hotel..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Commented out image upload for now */}
                {/* <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hotel Image</FormLabel>
                            <FormControl>
                                <div className="w-full">
                                    <Input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={e => {
                                            // handleImageChange(e);
                                            // field.onChange(e); // keep RHF in sync
                                        }}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        {imagePreview ? (
                                            <>
                                                <Image src={imagePreview} alt="Preview" fill className="object-contain rounded-lg" />
                                                <div
                                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-600"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // setImagePreview(null);
                                                        // setImageFile(undefined);
                                                        // setValue('image', undefined, { shouldValidate: true });
                                                        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                                                        if (fileInput) fileInput.value = "";
                                                    }}
                                                >
                                                    <X size={16} />
                                                </div>
                                            </>
                                        ) :
                                            <div className="text-center">
                                                <UploadCloud size={40} className="mx-auto text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400">PNG, JPG, or WEBP</p>
                                            </div>
                                        }
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amenities</Label>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (per night)</Label>
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
                                <FormLabel>Original Price</Label>
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
                                <FormLabel>Discount (%)</Label>
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
                                <FormLabel>Category</Label>
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
                                <FormLabel>Rating</Label>
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
                                <FormLabel>Number of Reviews</Label>
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
                                    <FormLabel>Featured</Label>
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
                                    <FormLabel>Active</Label>
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
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Hotel')}
                </Button>
            </form>
        </Form>
    );
} 