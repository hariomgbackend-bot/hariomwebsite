import HeroBanner from '@/components/HeroBanner'
import FeaturesStrip from '@/components/FeaturesStrip'
import CategoryGrid from '@/components/CategoryGrid'
import BrandShowcase from '@/components/BrandShowcase'
import FeaturedProducts from '@/components/FeaturedProducts'
import OffersCarousel from '@/components/OffersCarousel'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturesStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <OffersCarousel />
      <BrandShowcase />

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Visit Our Stores Today</h2>
            <p className="text-gray-200 mb-6 max-w-xl mx-auto">
              Experience the latest electronics and home appliances at our stores in Alandi. 
              Our friendly staff is ready to help you find the perfect product.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/stores" className="btn-accent">Find a Store</a>
              <a href="/contact" className="btn-outline-light">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
