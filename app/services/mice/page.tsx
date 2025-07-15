'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Users, CalendarCheck, Briefcase, Phone, Mail, MessageCircle, DollarSign, Hotel } from "lucide-react";
import Link from "next/link";

const conferenceGallery = [
    { src: "/images/conference.png" },
    { src: "/images/dianireefconference.png" },
];

export default function MiceTourismPage() {
    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-emerald-50">
                <Image src="/images/conference.png" alt="Conference" fill className="object-cover w-full h-full absolute z-0 opacity-60" priority quality={80} />
                <div className="absolute inset-0 bg-white/60 z-10" />
                <div className="relative z-20 text-center px-4 py-20 max-w-2xl mx-auto">
                    <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                        className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow">
                        Hassle-Free Conference Planning
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-800 mb-6 font-light">
                        Let Nadjam handle every detail of your next conference or meeting—at a price that fits your budget.
                    </motion.p>
                </div>
            </div>

            {/* Conference Gallery */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {conferenceGallery.map((img) => (
                        <div key={img.src} className="rounded-2xl overflow-hidden shadow-md bg-white">
                            <div className="relative w-full h-56">
                                <Image src={img.src} alt="Conference venue" fill className="object-cover w-full h-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How Nadjam Helps */}
            <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="max-w-5xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">How Nadjam Makes It Easy</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                        <Hotel className="w-10 h-10 text-blue-700 mb-3" />
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Vast Hotel Network</h3>
                        <p className="text-blue-800">We have access to a wide range of hotels and venues, so we can match your needs and budget perfectly.</p>
                    </div>
                    <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                        <DollarSign className="w-10 h-10 text-green-600 mb-3" />
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Fair Pricing</h3>
                        <p className="text-blue-800">We negotiate the best rates and offer transparent pricing—no hidden fees, just great value.</p>
                    </div>
                    <div className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                        <CalendarCheck className="w-10 h-10 text-blue-700 mb-3" />
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">End-to-End Planning</h3>
                        <p className="text-blue-800">From venue selection to logistics, we handle everything so you can focus on your event.</p>
                    </div>
                </div>
            </motion.section>

            {/* Call to Action */}
            <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Ready to Plan Your Conference?</h2>
                <p className="text-blue-800 mb-8">Contact Nadjam today for a free quote or consultation. We'll help you find the perfect venue at the right price.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="tel:+254706686349">
                        <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                            <Phone className="w-5 h-5" /> Call Us
                        </button>
                    </Link>
                    <Link href="mailto:nadjamtour@gmail.com">
                        <button className="bg-white text-blue-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg border border-blue-200">
                            <Mail className="w-5 h-5" /> Email Us
                        </button>
                    </Link>
                    <Link href="https://wa.me/254705996394">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                            <MessageCircle className="w-5 h-5" /> WhatsApp
                        </button>
                    </Link>
                </div>
            </motion.section>
        </div>
    );
} 