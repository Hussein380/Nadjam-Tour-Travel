"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useHotel, useHotelBySlug } from "@/hooks/useApi";
import { looksLikeFirestoreId } from "@/lib/slug";

export default function HotelDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const slugParam = params?.slug as string;
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    const isLegacyId = looksLikeFirestoreId(slugParam);

    const {
        data: hotelBySlug,
        isLoading: slugLoading,
        isError: slugError,
        error: slugErrorDetail,
    } = useHotelBySlug(!isLegacyId ? slugParam : undefined);

    const {
        data: hotelById,
        isLoading: idLoading,
        isError: idError,
        error: idErrorDetail,
    } = useHotel(isLegacyId ? slugParam : undefined);

    const hotel = hotelBySlug ?? hotelById;
    const isLoading = slugLoading || idLoading;
    const loadError = slugError ? slugErrorDetail : idErrorDetail;

    useEffect(() => {
        if (!hotel) return;
        if (isLegacyId && hotel.slug) {
            router.replace(`/hotels/${hotel.slug}`, { scroll: false });
        } else if (!isLegacyId && hotel.slug && hotel.slug !== slugParam) {
            router.replace(`/hotels/${hotel.slug}`, { scroll: false });
        }
    }, [hotel, isLegacyId, router, slugParam]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                {loadError?.message || "Hotel not found."}
            </div>
        );
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
                        {hotel.images.map((url: string, idx: number) => (
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
                    {hotel.amenities && hotel.amenities.map((a: string, i: number) => (
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
                        {hotel.propertyHighlights.map((h: string, i: number) => (
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
                        {hotel.leisureActivities.map((a: string, i: number) => (
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
                        {hotel.nearbyAttractions.map((a: string, i: number) => (
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
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Capacity</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotel.roomTypes.map((room: any, i: number) => (
                                    <tr key={i} className="border-t border-gray-200">
                                        <td className="px-4 py-2 text-sm text-gray-700">{room.type}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700">{room.beds}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700">{room.capacity}</td>
                                        <td className="px-4 py-2 text-sm text-gray-700">${room.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Booking Button */}
            <div className="mb-8">
                <Button
                    onClick={() => {
                        setBookingModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
                >
                    Book Now
                </Button>
            </div>

            {/* Debug info */}
            <div className="mb-4 text-sm text-gray-500">
                Debug: bookingModalOpen = {bookingModalOpen.toString()}
            </div>

            {/* Booking Modal */}
            {bookingModalOpen && (
                <BookingFormModal
                    open={bookingModalOpen}
                    onClose={() => {
                        setBookingModalOpen(false);
                    }}
                    hotelName={hotel.name}
                />
            )}
        </div>
    );
}

