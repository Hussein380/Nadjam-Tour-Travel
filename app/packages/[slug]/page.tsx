'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Package } from '@/lib/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Users, ShieldCheck, XCircle } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PackageBookingFormModal from '@/components/PackageBookingFormModal';

export default function PackageDetailPage() {
    const params = useParams();
    const slug = params?.slug;
    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingOpen, setBookingOpen] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchPackage = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/packages/${slug}`);
                if (!res.ok) {
                    throw new Error('Package not found.');
                }
                const data = await res.json();
                setPkg(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center">
                <div>
                    <h2 className="text-2xl font-bold text-red-500">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!pkg) {
        return <div className="text-center py-20">Package not found.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Title and breadcrumbs */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{pkg.title}</h1>
                <div className="flex items-center text-gray-500">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{pkg.location}</span>
                </div>
            </div>

            {/* Image Carousel */}
            <div className="mb-8">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="rounded-lg shadow-lg"
                >
                    {pkg.images?.map((url, idx) => (
                        <SwiperSlide key={idx}>
                            <img src={url} alt={`Package image ${idx + 1}`} className="w-full h-[500px] object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trip Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
                        </CardContent>
                    </Card>
                    {/* Itinerary Section */}
                    {pkg.itinerary && pkg.itinerary.length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Itinerary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-4 list-decimal list-inside">
                                    {pkg.itinerary.map((day, idx) => (
                                        <li key={idx} className="mb-2">
                                            <div className="font-semibold">Day {day.day}: {day.title}</div>
                                            <div className="text-gray-700 text-sm">{day.description}</div>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    )}
                    {/* Inclusions/Exclusions Section */}
                    {(pkg.inclusions && pkg.inclusions.length > 0) || (pkg.exclusions && pkg.exclusions.length > 0) ? (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>What's Included & Not Included</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="font-semibold mb-2">Inclusions</div>
                                        <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                                            {pkg.inclusions?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                            {(!pkg.inclusions || pkg.inclusions.length === 0) && <li className="text-gray-400">None specified</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-2">Exclusions</div>
                                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                                            {pkg.exclusions?.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                            {(!pkg.exclusions || pkg.exclusions.length === 0) && <li className="text-gray-400">None specified</li>}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>

                {/* Sidebar with booking details */}
                <div className="space-y-6">
                    <Card className="bg-gray-50">
                        <CardHeader>
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-3xl font-bold">${pkg.price}</span>
                                    <span className="text-gray-500">/person</span>
                                </div>
                                <span className="text-gray-500 line-through">${pkg.originalPrice}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button size="lg" className="w-full text-lg" onClick={() => { console.log('Book Now clicked'); setBookingOpen(true); }}>Book Now</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-emerald-500" /> <span>Duration: {pkg.duration}</span></div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-emerald-500" /> <span>Group Size: {pkg.groupSize}</span></div>
                            <div className="flex items-center"><Star className="w-5 h-5 mr-3 text-emerald-500" /> <span>Rating: {pkg.rating} ({pkg.reviews} reviews)</span></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Highlights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {pkg.highlights?.map((highlight, i) => (
                                    <li key={i} className="flex items-center">
                                        <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <PackageBookingFormModal
                open={bookingOpen}
                onClose={() => { console.log('Modal closed'); setBookingOpen(false); }}
                packageName={pkg.title}
            />
        </div>
    );
} 