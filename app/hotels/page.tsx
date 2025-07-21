'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star, Users, Wifi, Car, Utensils, Waves, Search, Filter, Heart, Building2 } from "lucide-react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BookingFormModal from '@/components/BookingFormModal';
import { Hotel } from '@/lib/types';
import Link from "next/link";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [lastHotelCreatedAt, setLastHotelCreatedAt] = useState<Date | null>(null);
  type Filters = {
    search: string;
    amenities: string[];
    location: string;
    hotelTypes: string[];
  };
  const [filters, setFilters] = useState<Filters>({
    search: "",
    amenities: [],
    location: "",
    hotelTypes: [],
  });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHotelName, setSelectedHotelName] = useState<string | null>(null);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const LIMIT = 12;

  // Debounced search and location input states
  const [searchInput, setSearchInput] = useState(filters.search);
  const [locationInput, setLocationInput] = useState(filters.location);

  // Debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (filters.search !== searchInput) {
        setFilters(prev => ({ ...prev, search: searchInput }));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Debounce for location
  useEffect(() => {
    const handler = setTimeout(() => {
      if (filters.location !== locationInput) {
        setFilters(prev => ({ ...prev, location: locationInput }));
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [locationInput]);

  // Fetch hotels (initial and paginated)
  const fetchHotels = useCallback(async (reset = false) => {
    setLoading(true);
    setError("");
    try {
      let url = `/api/hotels?active=true&limit=${LIMIT}`;
      if (!reset && lastHotelCreatedAt) {
        url += `&startAfter=${encodeURIComponent(lastHotelCreatedAt.toISOString())}`;
      }
      // Add filter params to API call
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.amenities.length) url += `&amenities=${filters.amenities.join(',')}`;
      if (filters.hotelTypes.length) url += `&hotelTypes=${filters.hotelTypes.join(',')}`;
      if (filters.location) url += `&location=${encodeURIComponent(filters.location)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch hotels");
      const data = await res.json();
      if (reset) {
        setHotels(data);
      } else {
        setHotels(prev => [...prev, ...data]);
      }
      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      if (data.length > 0) {
        setLastHotelCreatedAt(new Date(data[data.length - 1].createdAt));
      }
    } catch (err) {
      setError("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  }, [lastHotelCreatedAt, filters]);

  // Initial fetch and reset on filters change
  useEffect(() => {
    setHotels([]);
    setLastHotelCreatedAt(null);
    setHasMore(true);
    fetchHotels(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Infinite scroll observer
  const lastHotelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchHotels();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchHotels]
  );

  // Calculate dynamic filter data
  const filterData: Record<string, any> = useMemo(() => {
    const allAmenities = hotels.reduce((acc, hotel) => {
      hotel.amenities.forEach(amenity => {
        acc[amenity] = (acc[amenity] || 0) + 1;
      });
      return acc;
    }, {});
    return { allAmenities };
  }, [hotels]);

  // Filter hotels based on current filters
  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      // Search filter
      if (filters.search && !hotel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !hotel.location.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          hotel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      // Location filter
      if (filters.location && !hotel.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      // Hotel type filter
      if (filters.hotelTypes.length > 0) {
        if (!hotel.types || !Array.isArray(hotel.types) || !filters.hotelTypes.some(type => hotel.types && hotel.types.includes(type))) {
          return false;
        }
      }
      return true;
    });
  }, [hotels, filters]);

  // Paginate filtered hotels
  useEffect(() => {
    const startIndex = 0;
    const endIndex = LIMIT; // Use LIMIT for pagination effect
    // setDisplayedHotels(filteredHotels.slice(startIndex, endIndex)); // This line is no longer needed
    // setHasMore(endIndex < filteredHotels.length); // This line is no longer needed
  }, [filteredHotels]); // This useEffect is no longer needed

  // Reset page when filters change
  useEffect(() => {
    // setPage(1); // This line is no longer needed
  }, [filters]);

  const loadMore = () => {
    // setPage(prev => prev + 1); // This line is no longer needed
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full" />
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full" />
          <div className="absolute bottom-32 left-1/3 w-40 h-40 border border-white/20 rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="text-center w-full max-w-5xl mx-auto pt-8 sm:pt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 sm:mb-8 tracking-wide leading-tight mt-4 sm:mt-6">
              <span className="block">Exceptional</span>
              <span className="block font-normal">Accommodations</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto font-light leading-relaxed px-4">
              Discover handpicked hotels, lodges, and resorts that redefine luxury and comfort across Kenya's most
              stunning destinations
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto px-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
                Explore Hotels
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-medium bg-transparent"
              >
                Special Offers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Where are you going?"
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Check-in"
                    type="date"
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Check-out"
                    type="date"
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Select>
                    <SelectTrigger className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg font-semibold">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter Hotels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Search Hotels</h3>
                    <Input
                      placeholder="Search hotel names..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Amenities Dropdown Filter */}
                  <div className="relative mb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full border rounded px-3 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring"
                        onClick={() => setShowAmenitiesDropdown((prev: boolean) => !prev)}
                      >
                        {filters.amenities.length > 0 ? `${filters.amenities.length} selected` : 'Select amenities'}
                      </button>
                      {showAmenitiesDropdown && (
                        <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                          {Object.keys(filterData.allAmenities).map((amenity) => (
                            <label key={amenity} className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => toggleAmenity(amenity)}
                                className="mr-2 rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{amenity}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hotel Type Filter */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Hotel Type</h3>
                    <div className="space-y-2">
                      {['Budget', 'Standard', 'Luxury'].map(type => (
                        <div
                          key={type}
                          className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.hotelTypes.includes(type) ? "bg-blue-50 border border-blue-200" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={filters.hotelTypes.includes(type)}
                            onChange={() => {
                              setFilters(prev => ({
                                ...prev,
                                hotelTypes: prev.hotelTypes.includes(type)
                                  ? prev.hotelTypes.filter(t => t !== type)
                                  : [...prev.hotelTypes, type],
                              }));
                            }}
                            className="mr-3 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hotels Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-light text-gray-900">Featured Hotels</h2>
                  <p className="text-gray-600 mt-1">{filteredHotels.length} properties found</p>
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hotels.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filters.location
                      ? `No hotels found for location "${filters.location}".`
                      : 'No hotels found'}
                  </h3>
                  <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel, idx) => {
                      const card = (
                        <Link key={hotel.id} href={`/hotels/${hotel.id}`} className="block group focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer">
                            <div className="relative h-64 overflow-hidden">
                              {hotel.images && hotel.images.length > 0 ? (
                                <>
                                  <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    spaceBetween={16}
                                    slidesPerView={1}
                                    className="rounded-t-lg overflow-hidden h-full"
                                  >
                                    {hotel.images.map((url, idx) => (
                                      <SwiperSlide key={idx}>
                                        <div className="relative w-full h-64">
                                          <Image
                                            src={url}
                                            alt={`Hotel image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                      </SwiperSlide>
                                    ))}
                                  </Swiper>
                                  {hotel.images.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-20 select-none pointer-events-none">
                                      Swipe or click arrows to see more
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Image
                                  src={hotel.image || "/placeholder.svg"}
                                  alt={hotel.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-red-500 text-white font-medium">{hotel.discount}% OFF</Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                                  tabIndex={-1}
                                  type="button"
                                  onClick={e => e.preventDefault()}
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="absolute bottom-4 left-4">
                                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                                  {hotel.category}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {hotel.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{hotel.location}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center mb-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    <span className="font-medium">{hotel.rating}</span>
                                    <span className="text-sm text-gray-500 ml-1">({hotel.reviews})</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{hotel.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {hotel.amenities.slice(0, 4).map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                                {hotel.amenities.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{hotel.amenities.length - 4} more
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 line-through">${hotel.originalPrice}</span>
                                  <span className="text-2xl font-bold text-gray-900">${hotel.price}</span>
                                  <span className="text-sm text-gray-500">per night</span>
                                </div>
                                <Button
                                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
                                  tabIndex={0}
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    window.location.href = `/hotels/${hotel.id}`;
                                  }}
                                >
                                  View More
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                      if (hotels.length === idx + 1) {
                        return (
                          <div ref={lastHotelRef} key={hotel.id}>
                            {card}
                          </div>
                        );
                      } else {
                        return (
                          <div key={hotel.id}>{card}</div>
                        );
                      }
                    })}
                  </div>
                  {loading && (
                    <div className="flex justify-center mt-8">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {!hasMore && hotels.length > 0 && (
                    <div className="text-center mt-8 text-gray-500">No more hotels to load.</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">Why Book With Nadjam Travel</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our curated selection and personalized service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Price Guarantee</h3>
              <p className="text-gray-600">
                Find a lower price? We'll match it and give you an additional 5% off your booking.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Handpicked Properties</h3>
              <p className="text-gray-600">
                Every hotel is personally inspected by our team to ensure exceptional quality and service.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our travel experts are available around the clock to assist with your booking and travel needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BookingFormModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        hotelName={selectedHotelName || ''}
      />
    </div>
  )
}
