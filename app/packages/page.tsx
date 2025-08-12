"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { usePackageLocations } from "@/hooks/useApi";
import { Search, Filter, MapPin, Calendar, Users, Star, Globe, Award, Compass, Package } from "lucide-react";
import Link from "next/link";

export default function PackagesPage() {
  const [locations, setLocations] = useState<string[]>([]); // keep for dropdown
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    duration: "all",
    priceRange: "all",
    difficulty: "all",
    groupSize: "all",
    location: "all", // NEW: location filter
  });
  const ITEMS_PER_PAGE = 6;

  // Use React Query hook for locations only
  const { data: packageLocations = [] } = usePackageLocations();

  // React Query: Infinite Query for packages
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery<any[], Error>({
    queryKey: ["packages", filters],
    queryFn: async ({ pageParam }) => {
      let url = `/api/packages?active=true&limit=${ITEMS_PER_PAGE}`;
      if (typeof pageParam === 'string') {
        url += `&startAfter=${encodeURIComponent(pageParam)}`;
      }
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.location && filters.location !== "all") url += `&location=${encodeURIComponent(filters.location)}`;
      if (filters.category && filters.category !== "all") url += `&category=${encodeURIComponent(filters.category)}`;
      if (filters.difficulty && filters.difficulty !== "all") url += `&difficulty=${encodeURIComponent(filters.difficulty)}`;
      // Add more filters as needed
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < ITEMS_PER_PAGE) return undefined;
      return lastPage[lastPage.length - 1].createdAt;
    },
    initialPageParam: undefined,
  });

  // Combine all packages from pages
  const packages = useMemo(() =>
    data?.pages ? data.pages.flat() : [],
    [data]
  );

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPackageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  // Update locations when React Query data is available
  useEffect(() => {
    if (packageLocations.length > 0) {
      setLocations(packageLocations);
    }
  }, [packageLocations]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Generate filter lists from the main package data (original working logic)
  const categoryList = useMemo(() => {
    const categories = new Set<string>();
    packages.forEach(pkg => {
      if (pkg.category) {
        categories.add(pkg.category);
      }
    });
    return ["all", ...Array.from(categories).sort()];
  }, [packages]);

  const difficultyList = useMemo(() => {
    const difficulties = new Set<string>();
    packages.forEach(pkg => {
      if (pkg.difficulty) {
        difficulties.add(pkg.difficulty);
      }
    });
    return ["all", ...Array.from(difficulties).sort()];
  }, [packages]);

  const durationList = useMemo(() => {
    const durations = new Set<string>();
    packages.forEach(pkg => {
      if (pkg.duration) {
        durations.add(pkg.duration);
      }
    });
    return ["all", ...Array.from(durations).sort()];
  }, [packages]);

  const groupSizeList = useMemo(() => {
    const groupSizes = new Set<string>();
    packages.forEach(pkg => {
      if (pkg.groupSize) {
        groupSizes.add(pkg.groupSize);
      }
    });
    return ["all", ...Array.from(groupSizes).sort()];
  }, [packages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error.message}</p>
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
          <div className="absolute top-1/2 right-1/4 w-28 h-28 border border-white/20 rounded-full" />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 opacity-5">
          <Compass className="absolute top-24 left-1/4 w-8 h-8 text-white rotate-12" />
          <MapPin className="absolute bottom-36 right-1/4 w-6 h-6 text-white" />
          <Globe className="absolute top-1/3 right-1/5 w-7 h-7 text-white rotate-45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="text-center w-full max-w-5xl mx-auto pt-8 sm:pt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 sm:mb-8 tracking-wide leading-tight mt-4 sm:mt-6">
              <span className="block">Extraordinary</span>
              <span className="block font-normal">Travel Packages</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto font-light leading-relaxed px-4">
              Discover our carefully curated travel experiences that combine adventure, culture, and luxury to create
              unforgettable memories
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto px-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
                Explore Packages
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-medium bg-transparent"
              >
                Custom Package
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search by package name */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search packages..."
                    className="pl-12 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                  />
                </div>
                {/* Group Size Dropdown */}
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Select value={filters.groupSize} onValueChange={(value) => updateFilter("groupSize", value)}>
                    <SelectTrigger className="pl-12 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Group Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="solo">Solo Travel</SelectItem>
                      <SelectItem value="couple">Couple (2)</SelectItem>
                      <SelectItem value="small">Small Group (3-6)</SelectItem>
                      <SelectItem value="large">Large Group (7+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Search Button */}
                <Button className="h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg font-semibold">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter Packages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                    <Select
                      value={filters.category}
                      onValueChange={value => updateFilter('category', value)}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryList.map(category => (
                          <SelectItem key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Location Dropdown (dynamic) */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Location</h3>
                    <Select
                      value={filters.location}
                      onValueChange={value => updateFilter('location', value)}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Duration */}
                  <div>
                    <h3 className="font-semibold mb-2 mt-4">Duration</h3>
                    {durationList.map(duration => (
                      <div
                        key={duration}
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.duration === duration ? "bg-emerald-50 border border-emerald-200" : ""}`}
                        onClick={() => updateFilter("duration", duration)}
                      >
                        <span className="capitalize">{duration}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 mt-4">Group Size</h3>
                    {groupSizeList.map(groupSize => (
                      <div
                        key={groupSize}
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.groupSize === groupSize ? "bg-emerald-50 border border-emerald-200" : ""}`}
                        onClick={() => updateFilter("groupSize", groupSize)}
                      >
                        <span className="capitalize">{groupSize}</span>
                      </div>
                    ))}
                  </div>
                  {/* Difficulty */}
                  <div>
                    <h3 className="font-semibold mb-2 mt-4">Difficulty</h3>
                    {difficultyList.map(difficulty => (
                      <div
                        key={difficulty}
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${filters.difficulty === difficulty ? "bg-emerald-50 border border-emerald-200" : ""}`}
                        onClick={() => updateFilter("difficulty", difficulty)}
                      >
                        <span className="capitalize">{difficulty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Packages Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-light text-gray-900">Travel Packages</h2>
                  <p className="text-gray-600 mt-1">{packages.length} packages available</p>
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
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {packages.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map((pkg, index) => (
                      <Card
                        key={pkg.id}
                        className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                        ref={index === packages.length - 1 ? lastPackageRef : undefined}
                      >
                        <div className="relative h-64 overflow-hidden">
                          {pkg.images && pkg.images.length > 0 ? (
                            <Swiper
                              modules={[Navigation, Pagination]}
                              navigation
                              pagination={{ clickable: true }}
                              spaceBetween={16}
                              slidesPerView={1}
                              className="rounded-t-lg overflow-hidden h-full"
                            >
                              {pkg.images.map((url: string, idx: number) => (
                                <SwiperSlide key={idx}>
                                  <div className="relative w-full h-64">
                                    <img
                                      src={url}
                                      alt={`Package image ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          ) : (
                            <img
                              src={pkg.image || "/placeholder.svg"}
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-500 text-white font-medium">{pkg.discount}% OFF</Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 text-gray-900">
                              {pkg.duration}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-emerald-500 text-white">{pkg.category}</Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                {pkg.title}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{pkg.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-medium">{pkg.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({pkg.reviews})</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{pkg.description}</p>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Package Highlights:</h4>
                            <div className="flex flex-wrap gap-1">
                              {pkg.highlights.slice(0, 3).map((highlight: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                              {pkg.highlights.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{pkg.highlights.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>👥 {pkg.groupSize}</span>
                              <span>📊 {pkg.difficulty}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                              <span className="text-2xl font-bold text-blue-600">${pkg.price}</span>
                              <span className="text-sm text-gray-500">per person</span>
                            </div>
                            <Button asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white">
                              {/* Assuming pkg.slug is available */}
                              <Link href={`/packages/${pkg.slug}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Load More */}
                  {isFetchingNextPage && (
                    <div className="text-center mt-12">
                      <p className="text-gray-600">Loading more packages...</p>
                    </div>
                  )}
                  {!hasNextPage && (
                    <div className="text-center mt-12">
                      <p className="text-gray-600">No more packages to load.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">Why Choose Our Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our expertly crafted travel packages
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Curation</h3>
              <p className="text-gray-600">
                Every package is carefully designed by travel experts with years of destination knowledge and
                experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">All-Inclusive Value</h3>
              <p className="text-gray-600">
                Our packages include accommodations, meals, activities, and transportation for hassle-free travel.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Experiences</h3>
              <p className="text-gray-600">
                Connect with local culture through authentic experiences and activities you won't find elsewhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
