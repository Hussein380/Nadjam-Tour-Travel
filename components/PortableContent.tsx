"use client"

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null
            const src = urlFor(value).width(1200).height(600).fit("max").url()
            const alt = value?.alt || ""
            return (
                <div className="my-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
                </div>
            )
        },
    },
    block: {
        h1: ({ children }) => <h1 className="text-4xl sm:text-5xl font-semibold mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-3xl sm:text-4xl font-semibold mt-8 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-2xl sm:text-3xl font-semibold mt-6 mb-3">{children}</h3>,
        h4: ({ children }) => <h4 className="text-xl sm:text-2xl font-semibold mt-5 mb-2">{children}</h4>,
        normal: ({ children }) => <p className="leading-relaxed text-gray-800 my-4">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-700 my-6">{children}</blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        link: ({ value, children }) => {
            const href = value?.href || "#"
            const isExternal = href.startsWith("http")
            return (
                <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-emerald-700 hover:underline"
                >
                    {children}
                </a>
            )
        },
    },
}

export default function PortableContent({ value }: { value: any }) {
    return <PortableText value={value} components={components} />
}


