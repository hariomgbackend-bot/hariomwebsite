'use client'

import { useTranslation } from '@/hooks/useTranslation'
import ContactForm from '@/components/ContactForm'
import stores from '@/data/stores'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('contact.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('contact.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold text-brand-800 mb-6">Send us a Message</h2>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-800 mb-6">Contact Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('contact.call')}</h3>
                  <a href="tel:+918177896218" className="text-sm text-brand-600 hover:text-accent-500">+91 8177896218</a>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('contact.whatsapp')}</h3>
                  <a href="https://wa.me/918177896218" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700">Chat Now</a>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('contact.email')}</h3>
                  <a href="mailto:hariom_elect@live.com" className="text-sm text-brand-600 hover:text-accent-500">hariom_elect@live.com</a>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">Main Store</h3>
                  <a href={`https://www.google.com/maps?q=${stores.find(s => s.isMain)?.coordinates.lat},${stores.find(s => s.isMain)?.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:text-accent-500 underline">Shree Krishna Complex, Alandi Road</a>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">{t('stores.heading')}</h3>
                <div className="space-y-4">
                  {stores.map((store) => (
                    <div key={store.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <p className="font-medium text-gray-800 text-sm">{store.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{store.address}</p>
                      <a href={`tel:${store.mobile}`} className="text-xs text-accent-500 hover:underline">{store.mobile}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
