'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const poemLines = [
    "They say love is a journey…",
    "But Nadjam met you at the start of forever.",
    "From whispered vows to barefoot sunsets,",
    "We craft moments that time dares not forget.",
    "Your love, your story — we just make it unforgettable."
];

const galleryImages = [
    "/images/luxury-dining.jpg",
    "/images/romantic-dinner-seats.jpg",
    "/images/romantic-food.jpg"
];

export default function HoneymoonsWeddingsPage() {
    const [currentLine, setCurrentLine] = useState(0);
    const [showCTA, setShowCTA] = useState(false);

    useEffect(() => {
        if (currentLine < poemLines.length) {
            const timer = setTimeout(() => setCurrentLine(currentLine + 1), 2600);
            return () => clearTimeout(timer);
        } else {
            setTimeout(() => setShowCTA(true), 800);
        }
    }, [currentLine]);

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
            {/* Google Fonts for Playfair Display */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center">
                <Image src="/images/honeymoonsetting.png" alt="Honeymoon Setting" fill className="object-cover w-full h-full absolute z-0" priority quality={90} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10" />
                <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 py-32">
                    <div className="h-48 md:h-56 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentLine}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 1 }}
                                className="text-2xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-white drop-shadow-lg"
                                style={{ fontFamily: 'Playfair Display, serif', color: '#fff', textShadow: '0 2px 16px #000, 0 1px 0 #fff2' }}
                            >
                                {poemLines[currentLine]}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                    {showCTA && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mt-8">
                            <Link href="/packages?category=honeymoon,weddings">
                                <button className="bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.04em' }}>
                                    Start Your Forever
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Gallery Section */}
            <section className="max-w-5xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {galleryImages.map((img) => (
                        <div key={img} className="rounded-2xl overflow-hidden shadow-lg bg-white">
                            <div className="relative w-full h-64">
                                <Image src={img} alt="Romantic setting" fill className="object-cover w-full h-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-pink-700 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Explore Our Honeymoon & Wedding Packages</h2>
                <p className="text-lg text-gray-700 mb-8">Let Nadjam Travel make your love story unforgettable. Discover our curated packages for honeymoons and destination weddings in the <Link href="/packages?category=honeymoon,weddings" className="text-pink-600 underline font-semibold">Packages</Link> section.</p>
                <Link href="/packages?category=honeymoon,weddings">
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all">
                        View Packages
                    </button>
                </Link>
            </section>
        </div>
    );
} 