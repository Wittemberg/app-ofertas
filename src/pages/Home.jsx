import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import OfferCard from '../components/OfferCard'
import { useBranding } from '../components/BrandingProvider'
import { getOffers, getCategories } from '../api/public'
import { Link } from 'react-router-dom'

export default function Home() {
  const { tenant, loading } = useBranding()
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getOffers({ limit: 8, is_featured: 'true' }),
      getCategories()
    ])
      .then(([offersData, cats]) => {
        setFeatured(offersData.offers || [])
        setCategories(cats || [])
      })
      .catch(console.error)
      .finally(() => setPageLoading(false))
  }, [])

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
      <Header />

      <main className="flex-1">
        <section className="py-12 px-4" style={{ backgroundColor: 'var(--primary)' }}>
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {tenant?.name || 'Ofertas'}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              {tenant?.description || 'Confira as melhores ofertas e promoções'}
            </p>
            <Link
              to="/ofertas"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              Ver todas as ofertas
            </Link>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="py-10 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">⭐ Ofertas em Destaque</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featured.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {categories.length > 0 && (
          <section className="py-10 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">📂 Categorias</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/produtos?category=${cat.slug}`}
                    className="px-5 py-3 bg-white border rounded-lg text-sm font-medium hover:shadow transition"
                    style={{ color: 'var(--primary)' }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}