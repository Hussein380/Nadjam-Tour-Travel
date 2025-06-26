"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ChevronDown, Heart, Users, Package } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/hotels", label: "Hotels" },
    { href: "/flights", label: "Flight Booking" },
    { href: "/packages", label: "Packages" },
  ]

  const services = [
    { href: "/services/hajj-umrah", label: "Hajj & Umrah", icon: Heart },
    { href: "/services/mice", label: "MICE Tourism", icon: Users },
    { href: "/services/weddings", label: "Weddings", icon: Heart },
    { href: "/services/honeymoons", label: "Honeymoons", icon: Heart },
    { href: "/services/cargo", label: "Cargo Services", icon: Package },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20"
          : "bg-white/95 backdrop-blur-sm shadow-lg border-b"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transform hover:scale-105 transition-transform duration-300 flex-shrink-0"
          >
            <Image
              src="/images/nadjam-logo.png"
              alt="Nadjam Travel"
              width={160}
              height={64}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-base xl:text-lg relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-base xl:text-lg group whitespace-nowrap">
                Services
                <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-xl">
                {services.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <DropdownMenuItem key={service.href} asChild>
                      <Link
                        href={service.href}
                        className="flex items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-lg"
                      >
                        <IconComponent className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{service.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="#contact"
              className="text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-base xl:text-lg relative group whitespace-nowrap"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex-shrink-0"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md overflow-y-auto">
              <div className="flex flex-col space-y-6 mt-8 px-2">
                <Image
                  src="/images/nadjam-logo.png"
                  alt="Nadjam Travel"
                  width={160}
                  height={60}
                />

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg sm:text-xl text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Services */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                  {services.map((service) => {
                    const IconComponent = service.icon
                    return (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="flex items-center text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span>{service.label}</span>
                      </Link>
                    )
                  })}
                </div>

                <Link
                  href="#contact"
                  className="text-lg sm:text-xl text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium border-t pt-4"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
