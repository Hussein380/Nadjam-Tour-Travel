import { Phone, Mail, MessageCircle, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Image
                src="/images/nadjam-logo.png"
                alt="Nadjam Travel"
                width={250}
                height={100}
                className="h-12 sm:h-16 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-base sm:text-lg">
              Your trusted travel partner for extraordinary adventures around the world. We specialize in creating
              personalized experiences that connect you with nature's most spectacular destinations.
            </p>
            <div className="flex items-start space-x-3 text-gray-300 mb-4">
              <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">7th Street, Eastleigh</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/flights" className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg">
                  Flight Booking
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg"
                >
                  Travel Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/services/hajj-umrah"
                  className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg"
                >
                  Hajj & Umrah
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 mb-1">Phone</p>
                  <div className="space-y-1">
                    <a
                      href="tel:+254706686349"
                      className="block text-white hover:text-blue-400 transition-colors text-base sm:text-lg font-medium"
                    >
                      +254 706 686 349
                    </a>
                    <a
                      href="tel:+254729884108"
                      className="block text-white hover:text-blue-400 transition-colors text-base sm:text-lg font-medium"
                    >
                      +254 729 884 108
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 mb-1">Email</p>
                  <a
                    href="mailto:info@nadjamtravel.co.ke"
                    className="text-white hover:text-blue-400 transition-colors text-base sm:text-lg font-medium break-all"
                  >
                    info@nadjamtravel.co.ke
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 mb-1">WhatsApp</p>
                  <div className="space-y-1">
                    <a
                      href="https://wa.me/254706686349"
                      className="block text-white hover:text-green-400 transition-colors text-base sm:text-lg font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +254 706 686 349
                    </a>
                    <a
                      href="https://wa.me/254729884108"
                      className="block text-white hover:text-green-400 transition-colors text-base sm:text-lg font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +254 729 884 108
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left text-sm sm:text-base">
              © {new Date().getFullYear()} Nadjam Travel. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
