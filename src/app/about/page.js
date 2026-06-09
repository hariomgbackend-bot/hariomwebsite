'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

var villages = ['Alandi', 'Vadgaon', 'Moshi', 'Charholi (Bk)', 'Charholi (K)', 'Koyali', 'Solu', 'Dhanore', 'Markal', 'Vadmukhwadi', 'Tulapur', 'Kelgaon', 'Chimbali', 'Phulgaon', 'Perne']

var timeline = [
  { year: '1988', heading: 'J.K. Electronics — where it all began', body: 'Jeevanlal Chauhan, a trained ITI Electronics Mechanic from a humble background, opened a small repair shop called J.K. Electronics right on the banks of the Indrayani River in Alandi. For years he was the only reliable technician for radios, deck players, amplifiers, and speakers — not just in Alandi but across 15 surrounding villages.' },
  { year: 'Late 1990s\n– Early 2000s', heading: 'From repair to retail — a natural step', body: 'As trust in the Chauhan name grew, so did demand. The shop gradually began stocking and selling new products alongside repairs — a transition driven entirely by loyal customers who wanted to buy from someone they already trusted.' },
  { year: '2004\n– 2005', heading: 'Hari Om Electronics is born', body: 'A new, dedicated store opened under the name Hari Om Electronics — marking the family\'s formal step into multi-brand electronics retail and giving the business its own identity.' },
  { year: '2012', heading: 'Expansion to the main store', body: 'Growing customer footfall and a wider product range called for more space. A new, larger main store opened — the flagship location that continues to be the heart of the business today.' },
  { year: '2022', heading: 'Hari Om Furniture and Electronics', body: 'The Chauhan family expanded into furniture, launching Hari Om Furniture and Electronics — broadening their offering to serve customers furnishing and equipping their entire homes under one trusted name.' },
  { year: '2026', heading: 'Hari Om Electronics and Appliances', body: 'The newest chapter: a dedicated home appliances store completing a trio of stores that together cover electronics, furniture, and appliances — all rooted in the same values Jeevanlal Chauhan brought to that first repair bench nearly 40 years ago.', latest: true },
]

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
            OUR STORY
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
            From a riverside repair shop to three thriving stores
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            What began as one man&rsquo;s honest trade along the banks of the Indrayani River has grown, over three and a half decades, into one of Maharashtra&rsquo;s most trusted names in electronics and home appliances.
          </p>
        </div>
      </section>

      {/* ── Founder card ── */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shrink-0 shadow-md">
              JC
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-brand-800">Jeevanlal Mithalal Chauhan</p>
              <p className="text-sm text-accent-500 font-semibold mt-1">Founder · ITI Electronics Mechanic · J.K. Electronics, Est. 1988</p>
              <div className="mt-4 pl-4 border-l-4 border-brand-200">
                <p className="text-gray-600 italic leading-relaxed">&ldquo;He started with a soldering iron, a repair bench, and a reputation for honesty — and that reputation built everything that followed.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">THE JOURNEY</span>
          </div>
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-[115px] md:left-[135px] top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
            <div className="space-y-10">
              {timeline.map(function (item, i) {
                return (
                  <div key={i} className="relative flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Year dot */}
                    <div className="flex items-start sm:w-[120px] md:w-[140px] shrink-0">
                      <div className={'relative z-10 flex items-center gap-3 ' + (item.latest ? 'text-brand-700' : 'text-gray-500')}>
                        <div className={'hidden sm:flex w-10 h-10 rounded-full items-center justify-center shrink-0 border-2 ' + (item.latest ? 'bg-brand-600 border-brand-600' : 'bg-white border-gray-300')}>
                          {item.latest && (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={'text-sm font-bold whitespace-pre-line leading-tight ' + (item.latest ? 'text-brand-700' : 'text-gray-500')}>{item.year}</span>
                      </div>
                    </div>
                    {/* Card */}
                    <div className={'flex-1 rounded-xl border p-5 relative ' + (item.latest ? 'bg-brand-50 border-brand-200 shadow-md' : 'bg-gray-50 border-gray-100')}>
                      {item.latest && (
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Latest</span>
                      )}
                      <h3 className="font-bold text-brand-800 mb-2">{item.heading}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Communities ── */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-accent-100 text-accent-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">COMMUNITIES WE HAVE SERVED SINCE DAY ONE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {villages.map(function (v) {
              return (
                <span key={v} className="px-3.5 py-1.5 bg-white text-gray-700 text-sm rounded-full border border-gray-200 shadow-sm hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors">
                  {v}
                </span>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Values grid ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">WHAT WE STAND FOR</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { icon: 'shield', title: 'Genuine products', body: '100% authentic goods from authorised brand distributors. No shortcuts.' },
              { icon: 'users', title: 'Generational trust', body: 'Families who came to us in the 1990s now send their children. That says everything.' },
              { icon: 'tool', title: 'Expert service', body: 'Our roots are in repair. That hands-on knowledge still shapes how we advise and support customers today.' },
              { icon: 'location', title: 'Community first', body: 'Not just a store — a fixture of Alandi. Built by locals, for locals, since 1988.' },
            ].map(function (item) {
              return (
                <div key={item.title} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                    {item.icon === 'shield' && (
                      <svg className="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {item.icon === 'users' && (
                      <svg className="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    )}
                    {item.icon === 'tool' && (
                      <svg className="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.146 5.146a2.121 2.121 0 01-3-3l5.146-5.146m3.854 1.854l5.146-5.146a2.121 2.121 0 013 3l-5.146 5.146M9 21h6M12 3v12" />
                      </svg>
                    )}
                    {item.icon === 'location' && (
                      <svg className="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-semibold text-brand-800 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="py-10 bg-brand-50 border-y border-brand-100">
        <div className="container-custom text-center">
          <p className="text-base md:text-lg text-brand-800 font-medium max-w-3xl mx-auto leading-relaxed">
            &ldquo;To provide trusted technology and appliance solutions, backed by honest service and lasting customer relationships — just as we have since 1988.&rdquo;
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 bg-brand-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to find the perfect product?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-accent">Explore Products</Link>
            <Link href="/stores" className="btn-outline-light">Visit Our Stores</Link>
          </div>
        </div>
      </section>
    </>
  )
}
