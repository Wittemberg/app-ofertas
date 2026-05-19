import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import OfferCard from '../components/OfferCard'
import { getStores, getOffers } from '../api/public'

export default function StoreDetail() {
  const { slug } = useParams()
  const [store, setStore] = useState(null)
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStores()
      .then(async (stores) => {
        const found = stores.find(s => s.slug === slug)
        if (!found) {
          setLoading(false)
          return
        }
        setStore(found)
        const data = await getOffers({ store_id: found.id })
        setOffers(data.offers || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-12 text-center">
          <p className="text-gray-400 text-lg">Loja não encontrada.</p>
          <Link to="/lojas" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Ver todas as lojas
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/lojas" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Voltar às lojas
          </Link>

          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🏪</div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{store.name}</h1>
                <p className="text-gray-500">
                  {[store.city, store.state].filter(Boolean).join(' - ') || 'Endereço não informado'}
                </p>
                {store.address && <p className="text-sm text-gray-400 mt-1">{store.address}</p>}
                {store.phone && <p className="text-sm text-gray-400 mt-1">📞 {store.phone}</p>}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Ofertas desta loja ({offers.length})</h2>

          {offers.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma oferta disponível nesta loja no momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}