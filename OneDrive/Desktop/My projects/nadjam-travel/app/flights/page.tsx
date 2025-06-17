import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plane, Calendar, Clock, Users, Search, Star, TrendingUp, Shield, Headphones } from "lucide-react"

const popularRoutes = [
  {
    id: 1,
    from: "Nairobi",
    fromCode: "NBO",
    to: "Dubai",
    toCode: "DXB",
    price: 450,
    originalPrice: 580,
    duration: "4h 30m",
    airline: "Emirates",
    logo: "/placeholder.svg?height=40&width=40",
    stops: "Direct",
    discount: 22,
    rating: 4.8,
    deals: "Best Price",
  },
  {
    id: 2,
    from: "Mombasa",
    fromCode: "MBA",
    to: "Istanbul",
    toCode: "IST",
    price: 520,
    originalPrice: 680,
    duration: "6h 15m",
    airline: "Turkish Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    stops: "Direct",
    discount: 24,
    rating: 4.7,
    deals: "Popular",
  },
  {
    id: 3,
    from: "Nairobi",
    fromCode: "NBO",
    to: "London",
    toCode: "LHR",
    price: 680,
    originalPrice: 850,
    duration: "8h 45m",
    airline: "Kenya Airways",
    logo: "/placeholder.svg?height=40&width=40",
    stops: "Direct",
    discount: 20,
    rating: 4.6,
    deals: "Recommended",
  },
  {
    id: 4,
    from: "Nairobi",
    fromCode: "NBO",
    to: "Amsterdam",
    toCode: "AMS",
    price: 590,
    originalPrice: 750,
    duration: "8h 20m",
    airline: "KLM",
    logo: "/placeholder.svg?height=40&width=40",
    stops: "Direct",
    discount: 21,
    rating: 4.5,
    deals: "Great Deal",
  },
  {
    id: 5,
    from: "Mombasa",
    fromCode: "MBA",
    to: "Doha",
    toCode: "DOH",
    price: 420,
    originalPrice: 550,
    duration: "5h 10m",
    airline: "Qatar Airways",
    logo: "/placeholder.svg?height=40&width=40",
    stops: "Direct",
    discount: 24,
    rating: 4.9,
    deals: "Premium",
  },
  {
    id: 6,
    from: "Nairobi",
    fromCode: "NBO",
    to: "Paris",
    toCode: "CDG",
    price: 720,
    originalPrice: 920,
    duration: "9h 30m",
    airline: "Air France",
    logo: "/placeholder.svg?height=40&width=40",
    stops: "Direct",
    discount: 22,
    rating: 4.4,
    deals: "Limited Time",
  },
]

const flightClasses = [
  { name: "Economy", description: "Comfortable and affordable", popular: true },
  { name: "Premium Economy", description: "Extra space and comfort", popular: false },
  { name: "Business", description: "Premium service and amenities", popular: false },
  { name: "First Class", description: "Ultimate luxury experience", popular: false },
]

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 w-24 h-24 border border-white/20 rounded-full" />
          <div className="absolute top-32 right-24 w-32 h-32 border border-white/20 rounded-full" />
          <div className="absolute bottom-24 left-1/4 w-28 h-28 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 border border-white/20 rounded-full" />
        </div>

        {/* Floating Plane Icons */}
        <div className="absolute inset-0 opacity-5">
          <Plane className="absolute top-20 left-1/4 w-8 h-8 text-white rotate-45" />
          <Plane className="absolute bottom-32 right-1/4 w-6 h-6 text-white -rotate-12" />
          <Plane className="absolute top-1/3 right-1/5 w-7 h-7 text-white rotate-12" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="text-center w-full max-w-5xl mx-auto pt-8 sm:pt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 sm:mb-8 tracking-wide leading-tight mt-4 sm:mt-6">
              <span className="block">Book Your</span>
              <span className="block font-normal">Perfect Flight</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto font-light leading-relaxed px-4">
              Discover the best flight deals worldwide with our extensive network of trusted airlines and exclusive
              partnerships
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto px-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
                Search Flights
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-medium bg-transparent"
              >
                Flight Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Flight Search Section */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <Tabs defaultValue="roundtrip" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                  <TabsTrigger value="roundtrip" className="text-sm sm:text-base">
                    Round Trip
                  </TabsTrigger>
                  <TabsTrigger value="oneway" className="text-sm sm:text-base">
                    One Way
                  </TabsTrigger>
                  <TabsTrigger value="multicity" className="text-sm sm:text-base">
                    Multi City
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="roundtrip" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="From"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90" />
                      <Input
                        placeholder="To"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Departure"
                        type="date"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Return"
                        type="date"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Select>
                        <SelectTrigger className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                          <SelectItem value="4">4+ Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium text-lg">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="oneway" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="From"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90" />
                      <Input
                        placeholder="To"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Departure"
                        type="date"
                        className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Select>
                        <SelectTrigger className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                          <SelectItem value="4">4+ Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium text-lg">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="multicity">
                  <div className="text-center py-8">
                    <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Multi-City Booking</h3>
                    <p className="text-gray-600 mb-4">Plan complex itineraries with multiple destinations</p>
                    <Button variant="outline">Coming Soon</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flight Classes */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">Choose Your Travel Class</h2>
            <p className="text-gray-600">Select the perfect class for your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {flightClasses.map((flightClass, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  flightClass.popular ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <CardContent className="p-6 text-center">
                  {flightClass.popular && <Badge className="mb-3 bg-indigo-500">Most Popular</Badge>}
                  <h3 className="text-lg font-semibold mb-2">{flightClass.name}</h3>
                  <p className="text-sm text-gray-600">{flightClass.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">Popular Routes</h2>
              <p className="text-lg text-gray-600">Discover our most booked destinations with exclusive deals</p>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Best Price</SelectItem>
                <SelectItem value="duration">Shortest Flight</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route) => (
              <Card
                key={route.id}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plane className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{route.airline}</p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs text-gray-500">{route.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">{route.discount}% OFF</Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{route.fromCode}</p>
                      <p className="text-sm text-gray-600">{route.from}</p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <Plane className="w-5 h-5 text-gray-400 bg-white px-1" />
                        </div>
                      </div>
                      <p className="text-center text-xs text-gray-500 mt-1">{route.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{route.toCode}</p>
                      <p className="text-sm text-gray-600">{route.to}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {route.stops}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {route.deals}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{route.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">${route.originalPrice}</span>
                      <span className="text-2xl font-bold text-indigo-600">${route.price}</span>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                    <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white">
                      Book Flight
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              View All Routes
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">Why Fly With Nadjam Travel</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience seamless travel with our comprehensive flight booking services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Price Guarantee</h3>
              <p className="text-gray-600">
                We monitor prices 24/7 to ensure you get the best deals. Find a lower price? We'll beat it by 5%.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Your personal and payment information is protected with bank-level security and encryption.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our travel experts are available around the clock to assist with bookings, changes, and travel support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
