import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Hotel {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    image: string;
    images?: string[];
    amenities: string[];
    description: string;
    category: string;
    discount: number;
    featured: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    types?: string[];
    propertyHighlights?: string[];
    leisureActivities?: string[];
    nearbyAttractions?: string[];
    roomTypes?: Array<{
        type: string;
        beds: number;
        price: number;
        capacity: number;
    }>;
}

export interface Package {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    duration: string;
    difficulty: string;
    groupSize: string;
    category: string;
    location: string;
    images: string[];
    highlights: string[];
    itinerary: string[];
    inclusions: string[];
    exclusions: string[];
    featured: boolean;
    active: boolean;
    rating: number;
    reviews: number;
    createdAt: Date;
    updatedAt: Date;
    types?: string[];
}

// API functions - only the ones that actually exist
const api = {
    async fetchHotel(id: string): Promise<Hotel> {
        const res = await fetch(`/api/hotels/${id}`);
        if (!res.ok) throw new Error('Failed to fetch hotel');
        return res.json();
    },

    async fetchPackage(slug: string): Promise<Package> {
        const res = await fetch(`/api/packages/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch package');
        return res.json();
    },

    async fetchFeaturedPackages(): Promise<Package[]> {
        const res = await fetch('/api/packages?featured=true');
        if (!res.ok) throw new Error('Failed to fetch featured packages');
        return res.json();
    },

    async fetchHotelLocations(): Promise<string[]> {
        const res = await fetch('/api/hotels/locations');
        if (!res.ok) throw new Error('Failed to fetch hotel locations');
        return res.json();
    },

    async fetchPackageLocations(): Promise<string[]> {
        const res = await fetch('/api/packages/locations');
        if (!res.ok) throw new Error('Failed to fetch package locations');
        return res.json();
    }
};

// Custom hooks - only the ones that work
export function useHotel(id: string | undefined) {
    return useQuery({
        queryKey: ['hotel', id],
        queryFn: () => api.fetchHotel(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}

export function usePackage(slug: string | undefined) {
    return useQuery({
        queryKey: ['package', slug],
        queryFn: () => api.fetchPackage(slug!),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useFeaturedPackages() {
    return useQuery({
        queryKey: ['featured-packages'],
        queryFn: api.fetchFeaturedPackages,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
}

export function useHotelLocations() {
    return useQuery({
        queryKey: ['hotel-locations'],
        queryFn: api.fetchHotelLocations,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
    });
}

export function usePackageLocations() {
    return useQuery({
        queryKey: ['package-locations'],
        queryFn: api.fetchPackageLocations,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
    });
}

// Mutation hooks for admin operations
export function useCreateHotel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (hotelData: Partial<Hotel>) => {
            const res = await fetch('/api/hotels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(hotelData),
            });
            if (!res.ok) throw new Error('Failed to create hotel');
            return res.json();
        },
        onSuccess: () => {
            // Invalidate and refetch relevant queries
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
            queryClient.invalidateQueries({ queryKey: ['hotel-locations'] });
        },
    });
}

export function useUpdateHotel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...hotelData }: { id: string } & Partial<Hotel>) => {
            const res = await fetch(`/api/hotels/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(hotelData),
            });
            if (!res.ok) throw new Error('Failed to update hotel');
            return res.json();
        },
        onSuccess: (data, variables) => {
            // Update the specific hotel in cache
            queryClient.setQueryData(['hotel', variables.id], data);
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
        },
    });
}

export function useCreatePackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (packageData: Partial<Package>) => {
            const res = await fetch('/api/packages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(packageData),
            });
            if (!res.ok) throw new Error('Failed to create package');
            return res.json();
        },
        onSuccess: () => {
            // Invalidate and refetch relevant queries
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            queryClient.invalidateQueries({ queryKey: ['featured-packages'] });
            queryClient.invalidateQueries({ queryKey: ['package-locations'] });
        },
    });
}

export function useUpdatePackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...packageData }: { id: string } & Partial<Package>) => {
            const res = await fetch(`/api/packages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(packageData),
            });
            if (!res.ok) throw new Error('Failed to update package');
            return res.json();
        },
        onSuccess: (data, variables) => {
            // Update the specific package in cache
            queryClient.setQueryData(['package', data.slug], data);
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            queryClient.invalidateQueries({ queryKey: ['featured-packages'] });
        },
    });
}
