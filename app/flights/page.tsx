"use client"

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center space-y-6">
        <p className="uppercase tracking-[0.35em] text-xs sm:text-sm text-white/60">Flights</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">
          Compare &amp; Book Cheapest Flights
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto">
          Search 700+ airlines instantly. Best prices guaranteed for Domestic &amp; International travel.
        </p>
        <div className="pt-4">
          <a
            href="https://tp.media/r?marker=682890&trs=472027&p=4114&u=https%3A%2F%2Faviasales.com&campaign_id=100"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:brightness-110 transition-all shadow-[0_25px_60px_-25px_rgba(56,189,248,0.8)]"
          >
            SEARCH FLIGHTS NOW
          </a>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/70">Secure booking via Aviasales.</p>
        </div>
      </section>
    </div>
  )
}

