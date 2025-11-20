"use client"

const experiences = [
  {
    title: "Local Expert Guides",
    body: "Reserve top-rated city tours, safaris, and cultural immersions hosted by verified guides.",
  },
  {
    title: "Instant Tickets",
    body: "Secure entry to must-see attractions with mobile confirmations and flexible cancellation.",
  },
  {
    title: "Global Coverage",
    body: "Discover experiences across Africa, the Middle East, Europe, and beyond in one place.",
  },
]

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

      <section className="bg-white text-slate-900 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-center">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.3em] text-xs text-slate-500">Tours &amp; Activities</p>
            <h2 className="text-3xl sm:text-4xl font-light">Turn tickets into unforgettable journeys</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
              Book experiences, attraction passes, and day trips powered by GetYourGuide. Handpicked by Nadjam to match
              your itinerary.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-3 text-left">
            {experiences.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)]"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <a
              href="https://tp.media/r?marker=682890&trs=472027&p=3965&u=https%3A%2F%2Fgetyourguide.com&campaign_id=108"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-orange-400 via-amber-500 to-rose-500 text-white hover:brightness-110 transition-all shadow-[0_25px_60px_-25px_rgba(251,146,60,0.8)]"
            >
              EXPLORE TOURS &amp; ACTIVITIES
            </a>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">Secure booking via GetYourGuide.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

