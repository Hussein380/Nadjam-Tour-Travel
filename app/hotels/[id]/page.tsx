"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
SwiperCore.use([Navigation, Pagination]);
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import BookingFormModal from "@/components/BookingFormModal";

export default function HotelDetailsPage() {
    const params = useParams();
    const hotelId = params?.id;
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

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
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{hotel.description}</p>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <ul className="flex flex-wrap gap-2">
                    {hotel.amenities && hotel.amenities.map((a, i) => (
                        <li key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{a}</li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <span className="text-lg font-bold text-green-700 mr-2">${hotel.price}</span>
                <span className="text-gray-500 line-through">${hotel.originalPrice}</span>
                {hotel.discount > 0 && (
                    <span className="ml-2 text-red-500 font-semibold">-{hotel.discount}%</span>
                )}
            </div>
            <div className="mb-6">
                <span className="text-yellow-500 font-bold">★ {hotel.rating}</span>
                <span className="ml-2 text-gray-600">({hotel.reviews} reviews)</span>
            </div>

            {/* Property Highlights (optional) */}
            {hotel.propertyHighlights && hotel.propertyHighlights.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Property Highlights</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        {hotel.propertyHighlights.map((h, i) => (
                            <li key={i}>{h}</li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Leisure & Activities (optional) */}
            {hotel.leisureActivities && hotel.leisureActivities.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Leisure & Activities</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        {hotel.leisureActivities.map((a, i) => (
                            <li key={i}>{a}</li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Nearby Attractions (optional) */}
            {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Nearby Attractions</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        {hotel.nearbyAttractions.map((a, i) => (
                            <li key={i}>{a}</li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Room Types & Prices (optional) */}
            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Room Types & Prices</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Beds</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotel.roomTypes.map((room, idx) => (
                                    <tr key={idx} className="border-t border-gray-200">
                                        <td className="px-4 py-2 text-gray-900">{room.type || '-'}</td>
                                        <td className="px-4 py-2 text-gray-700">{room.beds || '-'}</td>
                                        <td className="px-4 py-2 text-green-700 font-semibold">{room.price ? `$${room.price}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* Guest Reviews (optional placeholder) */}
            {hotel.reviewsList && hotel.reviewsList.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Guest Reviews</h2>
                    {/* TODO: Render guest reviews */}
                    <div className="text-gray-500">Guest reviews coming soon...</div>
                </div>
            )}
            {/* Map/Location (optional placeholder) */}
            {hotel.mapEmbedUrl && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Location</h2>
                    {/* TODO: Render map embed */}
                    <iframe
                        src={hotel.mapEmbedUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                    ></iframe>
                </div>
            )}
            {/* Book Now Button */}
            <div className="flex justify-center mt-8">
                <Button
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold"
                    onClick={() => setBookingModalOpen(true)}
                >
                    Book Now
                </Button>
            </div>
            <BookingFormModal
                open={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                hotelName={hotel.name}
            />
        </div>
    );
} 