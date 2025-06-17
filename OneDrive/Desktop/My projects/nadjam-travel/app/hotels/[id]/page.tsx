"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Navigation, Pagination]);

export default function HotelDetailsPage() {
    const params = useParams();
    const hotelId = params?.id;
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!hotelId) return;
        const fetchHotel = async () => {
            try {
                const res = await fetch(`/api/hotels/${hotelId}`);
                if (!res.ok) throw new Error("Failed to fetch hotel");
                const data = await res.json();
                setHotel(data);
            } catch (err) {
                setError("Failed to load hotel");
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [hotelId]);

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }
    if (error || !hotel) {
        return <div className="flex items-center justify-center h-64 text-red-500">{error || "Hotel not found."}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
            <p className="mb-2 text-gray-600">{hotel.location}</p>
            {/* Image Gallery */}
            <div className="mb-8">
                {hotel.images && hotel.images.length > 0 ? (
                    <Swiper
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={16}
                        slidesPerView={1}
                        className="rounded-lg overflow-hidden"
                    >
                        {hotel.images.map((url, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="relative w-full h-80">
                                    <Image
                                        src={url}
                                        alt={`Hotel image ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 700px"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                        No images available
                    </div>
                )}
            </div>
            {/* Hotel Info */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{hotel.description}</p>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <ul className="flex flex-wrap gap-2">
                    {hotel.amenities && hotel.amenities.map((a, i) => (
                        <li key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{a}</li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <span className="text-lg font-bold text-green-700 mr-2">${hotel.price}</span>
                <span className="text-gray-500 line-through">${hotel.originalPrice}</span>
                {hotel.discount > 0 && (
                    <span className="ml-2 text-red-500 font-semibold">-{hotel.discount}%</span>
                )}
            </div>
            <div className="mb-4">
                <span className="text-yellow-500 font-bold">★ {hotel.rating}</span>
                <span className="ml-2 text-gray-600">({hotel.reviews} reviews)</span>
            </div>
        </div>
    );
} 