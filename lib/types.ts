export interface Hotel {
    id: string;
    slug?: string;
    legacySlugs?: string[];
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
    types?: ("Budget" | "Standard" | "Luxury")[];
    propertyHighlights?: string[];
    leisureActivities?: string[];
    nearbyAttractions?: string[];
    roomTypes?: any[];
    reviewsList?: any[];
    mapEmbedUrl?: string;
}

export interface Package {
    id: string;
    slug: string;
    title: string;
    location: string;
    price: number;
    originalPrice: number;
    duration: string;
    rating: number;
    reviews: number;
    image: string;
    images?: string[];
    description: string;
    category: string;
    discount: number;
    highlights: string[];
    difficulty: string;
    groupSize: string;
    featured: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    itinerary?: { day: number; title: string; description: string }[];
    inclusions?: string[];
    exclusions?: string[];
}

export interface User {
    uid: string;
    email: string;
    role: string;
} 