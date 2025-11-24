"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Award, Globe, Heart, ArrowRight, Phone, ChevronLeft, ChevronRight, Sparkles, MessageSquare, ShieldCheck, Clock, CheckCircle2, Plane, Hotel, Compass } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useFeaturedPackages } from "@/hooks/useApi";
// import { ChatBot } from "@/components/ChatBot"

// Hero images for carousel
const heroImages = [
  {
    src: "/images/safari-migration.jpg",
    title: "African Safari Adventures",
    subtitle: "Witness the Great Migration in Maasai Mara",
  },
  {
    src: "/images/cheetah-close.jpg",
    title: "Wildlife Encounters",
    subtitle: "Get up close with Africa's magnificent predators",
  },
  {
    src: "/images/luxury-lodge.jpg",
    title: "Luxury Eco Retreats",
    subtitle: "Sustainable luxury in pristine wilderness",
  },
  {
    src: "/images/campfire-lodge.jpg",
    title: "Authentic Safari Experiences",
    subtitle: "Evening campfires under African stars",
  },
  {
    src: "/images/safari-wedding.jpg",
    title: "Destination Weddings",
    subtitle: "Say 'I do' in Africa's most romantic settings",
  },
  {
    src: "/images/luxury-dining.jpg",
    title: "Fine Safari Dining",
    subtitle: "Gourmet cuisine with breathtaking views",
  },
  {
    src: "/images/tropical-resort.jpg",
    title: "Beach & Resort Escapes",
    subtitle: "Tropical paradise with world-class amenities",
  },
]

const stats = [
  { number: "100+", label: "Happy Travelers" },
  { number: "50+", label: "Destinations" },
  { number: "2", label: "Years Experience" },
  { number: "98%", label: "Satisfaction Rate" },
]

const aiHighlights = [
  {
    title: "Hotel shortlists that match your taste",
    description: "Share your budget or vibe and receive 2‑3 vetted stays with real pricing.",
  },
  {
    title: "Made-for-you safari plans",
    description: "Nadjam AI pieces together transport, guides, and daily highlights in minutes.",
  },
  {
    title: "Instant answers in English & Swahili",
    description: "Clarify visas, Hajj prep, or family travel details any hour of the day.",
  },
]

const aiShowcase = {
  scenario: "“We’re two friends looking for a 4-night safari plus a beach reset under $1,200 each.”",
  response: [
    "Maasai Mara – Lite fly-in package at Keekorok Lodge with dawn game drives.",
    "Diani wrap-up – Two nights at Waterlovers Beach Retreat with airport transfers.",
    "WhatsApp-ready quote and flexible payment link sent instantly.",
  ],
  promise: [
    "Answers come from Nadjam’s verified inventory.",
    "Switch between English and Swahili mid-chat.",
    "Hand off to a human advisor whenever you’re ready to book.",
  ],
}

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Use React Query hook instead of useEffect + fetch
  const { data: featuredPackages = [], isLoading: loadingFeatured, error: featuredError } = useFeaturedPackages();

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Preload only the first hero image to avoid delaying initial render
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setImagesLoaded(true)
    img.onerror = () => setImagesLoaded(true)
    img.src = heroImages[0].src
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const openAIChat = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-nadjam-chat"))
    }
  }, [])

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Background Image Carousel */}
        {imagesLoaded && (
          <div className="absolute inset-0 w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  fill
                  className="object-cover w-full h-full"
                  priority={index === 0}
                  quality={85}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Navigation Arrows - Hidden on mobile */}
        {imagesLoaded && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 hidden sm:block"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light text-white mb-4 sm:mb-6 tracking-wide leading-tight">
            <span className="block">Discover Africa's</span>
            <span className="block font-normal">Greatest Adventures</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 font-light leading-relaxed max-w-2xl mx-auto px-2">
            {imagesLoaded
              ? heroImages[currentImageIndex].subtitle
              : "Experience the world's most incredible destinations"}
          </p>

          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Meet your necessity with excellence. From African safaris to luxury eco-lodges, we create unforgettable
            journeys that connect you with nature's most spectacular wonders.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 flex-wrap">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-none bg-transparent"
            >
              <Link href="/packages">
                <Compass className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Explore Adventures
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-none bg-transparent"
            >
              <Link href="/flights">
                <Plane className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Search Flights
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-none bg-transparent"
            >
              <Link href="/hotels">
                <Hotel className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Hotels
              </Link>
            </Button>
          </div>
        </div>

        {/* Carousel Indicators */}
        {imagesLoaded && (
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white w-6 sm:w-8" : "bg-white/50 hover:bg-white/75"
                  }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 uppercase tracking-wide px-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nadjam AI Section CTA */}
      <section className="py-16 sm:py-20 bg-[#fdf8f3] w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-stretch">
          <div className="space-y-7">
            <Badge className="bg-amber-100 text-amber-800 text-xs uppercase tracking-[0.2em] w-fit px-4 py-1 rounded-full">
              Nadjam AI Concierge
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 leading-snug">
              Real travel pros, now assisted by Nadjam AI.
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Ask about hotels, multi-city itineraries, Hajj & Umrah, or last-minute getaways. Nadjam AI searches our
              verified inventory, shapes a plan, and loops in a human advisor the moment you need them.
            </p>
            <div className="space-y-4">
              {aiHighlights.map((item) => (
                <div key={item.title} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                size="lg"
                onClick={openAIChat}
                className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800 px-7 py-3 rounded-none"
              >
                Talk to Nadjam AI
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-7 py-3 rounded-none"
              >
                <a
                  href="https://wa.me/254725996394"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <svg
                    viewBox="0 0 32 32"
                    className="w-4 h-4"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M16.04 2.01c-7.24 0-13.2 5.77-13.2 12.87 0 2.63.87 5.07 2.33 7.06L2 30l8.3-2.73a13.8 13.8 0 0 0 5.74 1.22c7.25 0 13.21-5.78 13.21-12.88 0-7.1-5.94-12.87-13.21-12.87Zm7.72 17.33c-.33.93-1.63 1.8-2.24 1.85-.57.05-1.28.08-2.07-.13-.48-.13-1.1-.36-1.9-.7-3.36-1.45-5.54-4.82-5.71-5.05-.16-.23-1.36-1.8-1.36-3.43 0-1.62.86-2.41 1.16-2.74.33-.34.71-.43.95-.43.24 0 .48 0 .69.01.22.01.52-.08.81.62.33.8 1.12 2.75 1.22 2.95.1.2.16.44.03.67-.13.23-.2.38-.4.58-.2.2-.42.45-.6.6-.2.17-.41.35-.18.68.23.34 1.02 1.7 2.19 2.75 1.51 1.35 2.78 1.77 3.17 1.97.39.2.62.17.85-.1.23-.27.98-1.15 1.24-1.54.26-.39.52-.33.86-.2.34.12 2.16 1.02 2.53 1.2.37.18.62.27.71.42.1.15.1.88-.23 1.81Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
              Responds instantly • Available 24/7 • English & Swahili
            </p>
          </div>
          <div className="space-y-5">
            <Card className="h-full border-0 shadow-xl bg-white">
              <CardContent className="p-6 space-y-5">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Sample chat</p>
                <p className="text-lg text-gray-900 leading-relaxed">{aiShowcase.scenario}</p>
                <div className="rounded-2xl bg-amber-50/90 border border-amber-100 p-5 space-y-2">
                  <p className="text-sm font-semibold text-amber-900 uppercase tracking-wide">Nadjam AI suggests</p>
                  <ul className="space-y-1 text-sm text-amber-900 leading-relaxed">
                    {aiShowcase.response.map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  {aiShowcase.promise.map((line) => (
                    <div
                      key={line}
                      className="flex items-start space-x-3 text-sm text-gray-700 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2"></span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 bg-white/80">
              <CardContent className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed">
                  “I asked Nadjam AI to plan a honeymoon with beach + safari. Within ten minutes I had hotel options,
                  a budget, and a WhatsApp link to confirm. It felt like chatting with a real planner.”
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-4">— Aisha & Malik, Nairobi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 sm:mb-6 px-2">
              Why Choose Nadjam Travel
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-4">
              Experience in creating extraordinary travel experiences, we're your trusted partner
              for adventures that exceed expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-gray-900">Expert Guides</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our certified local guides bring destinations to life with insider knowledge, ensuring authentic
                experiences and unforgettable memories.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-gray-900">wide Kenyan Network</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Access to exclusive destinations and premium accommodations in Kenya, from luxury safari lodges to
                eco-friendly retreats.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-gray-900">Personalized Service</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                24/7 support and customized itineraries tailored to your preferences, ensuring every detail of your
                journey is perfect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 sm:py-20 bg-white w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 sm:mb-6 px-2">
              Featured Adventures
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-light px-4">
              Handpicked experiences that showcase Kenya's most incredible destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {loadingFeatured ? (
              <div className="col-span-full text-center text-gray-500 py-8">Loading featured packages...</div>
            ) : featuredPackages.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">No featured packages found.</div>
            ) : (
              featuredPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md w-full"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 w-full">
                    {(pkg.images && pkg.images.length > 0) ? (
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={16}
                        slidesPerView={1}
                        className="rounded-t-lg overflow-hidden h-full"
                      >
                        {pkg.images.map((url, idx) => (
                          <SwiperSlide key={idx}>
                            <div className="relative w-full h-48 sm:h-56 md:h-64">
                              <img
                                src={url}
                                alt={`Package image ${idx + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <img
                        src={(pkg.images && pkg.images.length > 0 ? pkg.images[0] : "/placeholder.svg")}
                        alt={pkg.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white text-gray-900 font-normal text-xs sm:text-sm">
                      {pkg.duration}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2 px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl font-light">{pkg.title}</CardTitle>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{pkg.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">{pkg.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs sm:text-sm">{pkg.rating}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-light text-gray-900">${pkg.price}</span>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 rounded-none text-sm sm:text-base">
                      <Link href={`/packages/${pkg.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-none"
            >
              <Link href="/packages">
                View All Adventures
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gray-900 text-white w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 px-2">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-gray-300 font-light leading-relaxed px-4">
            Let us create a personalized journey that exceeds your wildest dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-none"
            >
              <Link href="/packages">Start Planning</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-none bg-transparent"
            >
              <Link href="tel:+254706686349">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Call Us Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      {/* <ChatBot /> */}
    </div>
  )
}
