import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getStores } from '../api/public'
import { Link } from 'react-router-dom'

export default function Stores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStores()
      .then(setStores)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Nossas Lojas</h1>
          <p className="text-gray-500 text-sm mb-6">{stores.length} unidades</p>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Carregando...</p>
          ) : stores.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Nenhuma loja cadastrada.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stores.map(store => (
                <Link
                  key={store.id}
                  to={`/loja/${store.slug}`}
                  className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
                >
                  <div className="text-3xl mb-3">🏪</div>
                  <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-500">
                    {[store.city, store.state].filter(Boolean).join(' - ') || 'Endereço não informado'}
                  </p>
                  {store.phone && (
                    <p className="text-sm text-gray-400 mt-1">📞 {store.phone}</p>
                  )}
                  <span className="inline-block mt-3 text-sm font-medium" style={{ color: 'var(--primary)' }}>
                    Ver ofertas da loja →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}