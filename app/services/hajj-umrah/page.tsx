'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  Users,
  Plane,
  Building,
  BookOpen,
  Calendar,
  MapPin,
  Shield,
  Heart,
  CheckCircle,
  Clock,
  Info,
  Phone,
  Mail,
  MessageCircle,
  Mountain,
  SquareStack
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Hajj & Umrah Packages and Pilgrimage Guide</h1>
      <p className="text-lg mb-6">
        Book your Hajj or Umrah journey with confidence. Nadjam Travel provides affordable packages, expert guidance, and personalized pilgrimage experiences.
      </p>

      <Tabs defaultValue="hajj" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hajj">Hajj Packages</TabsTrigger>
          <TabsTrigger value="umrah">Umrah Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="hajj">
          <h2 className="text-2xl font-bold mb-4">Hajj Packages</h2>
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Basic Hajj Package</CardTitle>
                  <p className="text-sm text-muted-foreground">For first-time pilgrims</p>
                </div>
                <Badge variant="outline"></Badge>
              </CardHeader>
              <CardContent>
                <p>This package includes:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Accommodation in Makkah</li>
                  <li>Flights from your city</li>
                  <li>Ground transportation</li>
                  <li>Meal plan</li>
                  <li>Visa assistance</li>
                </ul>
                <Button className="mt-4">Book Now</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Premium Hajj Package</CardTitle>
                  <p className="text-sm text-muted-foreground">For families and groups</p>
                </div>
                <Badge variant="outline"></Badge>
              </CardHeader>
              <CardContent>
                <p>This package includes:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Luxury accommodation in Makkah</li>
                  <li>Private flights</li>
                  <li>Personalized tour guide</li>
                  <li>Exclusive access to holy sites</li>
                  <li>24/7 support</li>
                </ul>
                <Button className="mt-4">Book Now</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="umrah">
          <h2 className="text-2xl font-bold mb-4">Umrah Packages</h2>
          {/* Flyer image */}
          <div className="w-full mb-6">
            <div className="relative mx-auto max-w-3xl">
              <Image
                src="/images/umra.jpg"
                alt="October Umrah Package - Nadjam Travel"
                width={1200}
                height={1800}
                className="w-full h-auto rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
          {/* Quick WhatsApp CTA */}
          <div className="flex items-center justify-center mb-8">
            <a
              href={`https://wa.me/254706686349?text=${encodeURIComponent('Hello Nadjam Travel, I am interested in the Umrah package. Please assist me with booking.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>

          {/* Booking form */}
          <UmrahBookingForm />
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">Standard Umrah Package</CardTitle>
                  <p className="text-sm text-muted-foreground">For individual pilgrims</p>
                </div>
                <Badge variant="outline"></Badge>
              </CardHeader>
              <CardContent>
                <p>This package includes:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Accommodation in Madinah</li>
                  <li>Ground transportation</li>
                  <li>Meal plan</li>
                  <li>Visa assistance</li>
                  <li>Personalized itinerary</li>
                </ul>
                <Button className="mt-4">Book Now</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">VIP Umrah Package</CardTitle>
                  <p className="text-sm text-muted-foreground">For families and groups</p>
                </div>
                <Badge variant="outline"></Badge>
              </CardHeader>
              <CardContent>
                <p>This package includes:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Luxury accommodation in Madinah</li>
                  <li>Private flights</li>
                  <li>Personalized tour guide</li>
                  <li>Exclusive access to holy sites</li>
                  <li>24/7 support</li>
                </ul>
                <Button className="mt-4">Book Now</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <h2 className="text-2xl font-bold mt-12 mb-4">Why Choose Nadjam Travel?</h2>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Expert Guidance</CardTitle>
              <p className="text-sm text-muted-foreground">Our team of pilgrimage experts</p>
            </div>
            <Badge variant="outline">24/7 Support</Badge>
          </CardHeader>
          <CardContent>
            <p>
              Our dedicated team of pilgrimage experts is here to guide you every step of the way.
              From visa assistance to accommodation, we ensure your journey is smooth and hassle-free.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Affordable Packages</CardTitle>
              <p className="text-sm text-muted-foreground">Competitive pricing</p>
            </div>
            <Badge variant="outline">Best Value</Badge>
          </CardHeader>
          <CardContent>
            <p>
              We offer competitive pricing without compromising on quality.
              Our packages are designed to be affordable while providing the best pilgrimage experience.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Personalized Experience</CardTitle>
              <p className="text-sm text-muted-foreground">Tailored for your needs</p>
            </div>
            <Badge variant="outline">Customizable</Badge>
          </CardHeader>
          <CardContent>
            <p>
              We understand that every pilgrim is unique.
              Our packages are customizable to suit your preferences, budget, and schedule.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="question1">
          <AccordionTrigger>What is Hajj and Umrah?</AccordionTrigger>
          <AccordionContent>
            Hajj is the annual pilgrimage to Mecca, Saudi Arabia, for all able-bodied Muslims who can afford it.
            Umrah is a smaller, less obligatory pilgrimage that can be performed at any time of the year.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question2">
          <AccordionTrigger>Do I need a visa to perform Hajj/Umrah?</AccordionTrigger>
          <AccordionContent>
            Yes, you need a visa to perform Hajj. Umrah is generally visa-free for Muslims from most countries.
            However, it's always best to check the latest requirements with your travel agency.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question3">
          <AccordionTrigger>What are the dates for Hajj and Umrah?</AccordionTrigger>
          <AccordionContent>
            Hajj dates vary each year, typically in July-August. Umrah can be performed at any time of the year.
            It's recommended to book your pilgrimage well in advance to secure accommodation and flights.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question4">
          <AccordionTrigger>What are the health requirements for Hajj/Umrah?</AccordionTrigger>
          <AccordionContent>
            You must be in good health to perform Hajj/Umrah.
            It's also recommended to be up-to-date with vaccinations, especially for Hajj.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h2 className="text-2xl font-bold mt-12 mb-4">Contact Us</h2>
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Nadjam Travel</CardTitle>
              <p className="text-sm text-muted-foreground">Your trusted pilgrimage partner</p>
            </div>
            <Badge variant="outline">Visit Us</Badge>
          </CardHeader>
          <CardContent>
            <p>
              For more information or to book your pilgrimage, please contact us:
            </p>
            <ul className="list-none text-sm text-muted-foreground">
              <li><Phone className="inline-block mr-2" /> +254725996394</li>
              <li><Mail className="inline-block mr-2" /> info@nadjamtravel.com</li>
              <li><MessageCircle className="inline-block mr-2" /> @nadjamtravel</li>
            </ul>
            <p className="mt-4">
              Visit our website for detailed packages, testimonials, and FAQs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UmrahBookingForm() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [travelMonth, setTravelMonth] = useState("")
  const [numTravelers, setNumTravelers] = useState(1)
  const [notes, setNotes] = useState("")

  const handleWhatsApp = () => {
    const base = "https://wa.me/254706686349"
    const message = `Hello Nadjam Travel,%0A%0AI'm interested in the Umrah package.%0A%0AName: ${encodeURIComponent(fullName)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ATravel Month: ${encodeURIComponent(travelMonth)}%0ATravelers: ${encodeURIComponent(String(numTravelers))}%0ANotes: ${encodeURIComponent(notes)}`
    window.open(`${base}?text=${message}`, "_blank")
  }

  return (
    <Card className="max-w-3xl mx-auto mb-10">
      <CardHeader>
        <CardTitle>Book Your Umrah Package</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleWhatsApp()
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. +2547XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Preferred Travel Month</label>
            <input
              type="month"
              value={travelMonth}
              onChange={(e) => setTravelMonth(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Number of Travelers</label>
            <input
              type="number"
              min={1}
              value={numTravelers}
              onChange={(e) => setNumTravelers(parseInt(e.target.value || "1", 10))}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-md px-3 py-2 min-h-[100px]"
              placeholder="Any preferences or questions"
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <Button type="submit" className="rounded-md">Send via WhatsApp</Button>
            <a
              href={`tel:+254706686349`}
              className="inline-flex items-center px-4 py-2 border rounded-md"
            >
              <Phone className="w-4 h-4 mr-2" /> Call Us
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
