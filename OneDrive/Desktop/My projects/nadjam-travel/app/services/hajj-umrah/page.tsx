import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Plane, Building } from "lucide-react"
import Image from "next/image"

const hajjPackages = [
  {
    id: 1,
    title: "Premium Hajj Package",
    duration: "15 Days",
    price: 4999,
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400",
    includes: ["5-Star Hotels", "VIP Transportation", "Guided Tours", "All Meals"],
    description: "Luxury Hajj experience with premium accommodations and services",
  },
  {
    id: 2,
    title: "Standard Umrah Package",
    duration: "7 Days",
    price: 1899,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400",
    includes: ["4-Star Hotels", "Transportation", "Ziyarat Tours", "Breakfast"],
    description: "Comfortable Umrah journey with excellent value for money",
  },
  {
    id: 3,
    title: "Family Hajj Package",
    duration: "18 Days",
    price: 4299,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
    includes: ["Family Rooms", "Child Care", "Group Activities", "All Meals"],
    description: "Perfect for families with children and elderly members",
  },
]

export default function HajjUmrahPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hajj & Umrah Services</h1>
          <p className="text-xl text-green-100">
            Experience the spiritual journey of a lifetime with our comprehensive Hajj and Umrah packages
          </p>
        </div>
      </div>

      {/* Services Overview */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Hajj & Umrah Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide complete Hajj and Umrah services with experienced guides, comfortable accommodations, and
            spiritual guidance throughout your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Accommodations</h3>
            <p className="text-gray-600">Stay in comfortable hotels close to Haram with excellent facilities</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-gray-600">Experienced religious guides to help you perform rituals correctly</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Complete Travel</h3>
            <p className="text-gray-600">Flights, visas, transportation, and all travel arrangements included</p>
          </div>
        </div>

        {/* Packages */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Packages</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {hajjPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                <Badge className="absolute top-3 right-3 bg-white text-gray-900">{pkg.duration}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{pkg.title}</CardTitle>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm ml-1">{pkg.rating} rating</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                <div className="space-y-2 mb-4">
                  {pkg.includes.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${pkg.price}</span>
                    <span className="text-gray-500 text-sm">/person</span>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
