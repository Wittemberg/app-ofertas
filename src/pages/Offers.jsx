import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import OfferCard from '../components/OfferCard'
import { getOffers, getStores } from '../api/public'

export default function Offers() {
  const [offers, setOffers] = useState([])
  const [total, setTotal] = useState(0)
  const [stores, setStores] = useState([])
  const [page, setPage] = useState(1)
  const [storeFilter, setStoreFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const limit = 20

  useEffect(() => {
    getStores().then(setStores).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    getOffers({ page, limit, store_id: storeFilter || undefined })
      .then(data => {
        setOffers(data.offers || [])
        setTotal(data.total || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, storeFilter])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Todas as Ofertas</h1>
          <p className="text-gray-500 text-sm mb-6">{total} ofertas encontradas</p>

          <div className="mb-6">
            <select
              value={storeFilter}
              onChange={e => { setStoreFilter(e.target.value); setPage(1) }}
              className="border rounded-lg px-4 py-2 text-sm"
            >
              <option value="">Todas as lojas</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Carregando ofertas...</p>
          ) : offers.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Nenhuma oferta encontrada.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}