'use client';

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star, Users, Wifi, Car, Utensils, Waves, Search, Filter, Heart, Building2 } from "lucide-react"
import Image from "next/image"

export default function HotelsPage() {
  const [allHotels, setAllHotels] = useState([]);
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: "all",
    amenities: [],
    location: ""
  });

  const ITEMS_PER_PAGE = 6;

  // Fetch all hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels?active=true");
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const data = await res.json();
        setAllHotels(data);
      } catch (err) {
        setError("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Calculate dynamic filter data
  const filterData = useMemo(() => {
    const categories = allHotels.reduce((acc, hotel) => {
      const category = hotel.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const priceRanges = allHotels.reduce((acc, hotel) => {
      let range = "all";
      if (hotel.price < 100) range = "0-100";
      else if (hotel.price < 200) range = "100-200";
      else if (hotel.price < 300) range = "200-300";
      else range = "300+";
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});

    const allAmenities = allHotels.reduce((acc, hotel) => {
      hotel.amenities.forEach(amenity => {
        acc[amenity] = (acc[amenity] || 0) + 1;
      });
      return acc;
    }, {});

    return { categories, priceRanges, allAmenities };
  }, [allHotels]);

  // Filter hotels based on current filters
  const filteredHotels = useMemo(() => {
    return allHotels.filter(hotel => {
      // Search filter
      if (filters.search && !hotel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !hotel.location.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category !== "all" && hotel.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== "all") {
        if (filters.priceRange === "0-100" && hotel.price >= 100) return false;
        if (filters.priceRange === "100-200" && (hotel.price < 100 || hotel.price >= 200)) return false;
        if (filters.priceRange === "200-300" && (hotel.price < 200 || hotel.price >= 300)) return false;
        if (filters.priceRange === "300+" && hotel.price < 300) return false;
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

      return true;
    });
  }, [allHotels, filters]);

  // Paginate filtered hotels
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    setDisplayedHotels(filteredHotels.slice(startIndex, endIndex));
    setHasMore(endIndex < filteredHotels.length);
  }, [filteredHotels, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (loading) {
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
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
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
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      <div
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.category === "all" ? "bg-blue-50 border border-blue-200" : ""
                          }`}
                        onClick={() => updateFilter("category", "all")}
                      >
                        <span className="text-sm text-gray-700">All Hotels</span>
                        <Badge variant="secondary" className="text-xs">
                          {allHotels.length}
                        </Badge>
                      </div>
                      {Object.entries(filterData.categories).map(([category, count]) => (
                        <div
                          key={category}
                          className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.category === category ? "bg-blue-50 border border-blue-200" : ""
                            }`}
                          onClick={() => updateFilter("category", category)}
                        >
                          <span className="text-sm text-gray-700">{category}</span>
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Price Range (per night)</h3>
                    <div className="space-y-2">
                      {Object.entries(filterData.priceRanges).map(([range, count]) => (
                        <div
                          key={range}
                          className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.priceRange === range ? "bg-blue-50 border border-blue-200" : ""
                            }`}
                          onClick={() => updateFilter("priceRange", range)}
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            checked={filters.priceRange === range}
                            onChange={() => updateFilter("priceRange", range)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">
                            {range === "all" ? "All Prices" :
                              range === "0-100" ? "Under $100" :
                                range === "100-200" ? "$100 - $200" :
                                  range === "200-300" ? "$200 - $300" : "$300+"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
                    <div className="space-y-2">
                      {Object.entries(filterData.allAmenities).slice(0, 8).map(([amenity, count]) => (
                        <div
                          key={amenity}
                          className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.amenities.includes(amenity) ? "bg-blue-50 border border-blue-200" : ""
                            }`}
                          onClick={() => toggleAmenity(amenity)}
                        >
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="mr-3 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{amenity}</span>
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

              {displayedHotels.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                  <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedHotels.map((hotel) => (
                      <Card
                        key={hotel.id}
                        className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={hotel.image || "/placeholder.svg"}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-500 text-white font-medium">{hotel.discount}% OFF</Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
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

                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{hotel.description}</p>

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
                            <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="text-center mt-12">
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-8 py-3 text-lg"
                        onClick={loadMore}
                      >
                        Load More Hotels
                      </Button>
                    </div>
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
    </div>
  )
}
