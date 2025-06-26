import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import PackageBookingFormModal from './PackageBookingFormModal'
import { useState } from 'react'

interface Package {
  id: number
  slug: string
  title: string
  location: string
  price: number
  duration: string
  rating: number
  image: string
  description: string
}

interface PackageCardProps {
  package: Package
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const [bookingOpen, setBookingOpen] = useState(false)
  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={pkg.image || "/placeholder.svg"}
            alt={pkg.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 right-3 bg-white text-gray-900">
            <Clock className="w-3 h-3 mr-1" />
            {pkg.duration}
          </Badge>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{pkg.title}</CardTitle>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {pkg.location}
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm ml-1 font-medium">{pkg.rating}</span>
              <span className="text-xs text-gray-500 ml-1">rating</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">${pkg.price}</span>
              <p className="text-xs text-gray-500">per person</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <div className="flex gap-2 w-full">
            <Button asChild className="flex-1">
              <Link href={`/packages/${pkg.slug}`}>View Details</Link>
            </Button>
            <Button className="flex-1" variant="outline" onClick={() => setBookingOpen(true)}>
              Book Now
            </Button>
          </div>
        </CardFooter>
      </Card>
      <PackageBookingFormModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageName={pkg.title}
      />
    </>
  )
}
