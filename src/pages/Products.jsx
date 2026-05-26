import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getProducts, getCategories } from '../api/public'
import { Link } from 'react-router-dom'
import { useCart } from '../components/CartProvider'

export default function Products() {
  const cart = useCart()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const limit = 20

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({ page, limit, category_id: categoryFilter || undefined, search: search || undefined })
      .then(data => {
        setProducts(data.products || [])
        setTotal(data.total || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, categoryFilter])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    setLoading(true)
    getProducts({ page: 1, limit, search: search || undefined })
      .then(data => {
        setProducts(data.products || [])
        setTotal(data.total || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Produtos</h1>
          <p className="text-gray-500 text-sm mb-6">{total} produtos cadastrados</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produto..."
                className="border rounded-lg px-4 py-2 text-sm w-64"
              />
              <button type="submit" className="btn-primary px-4 py-2 rounded-lg text-sm">
                🔍 Buscar
              </button>
            </form>
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
              className="border rounded-lg px-4 py-2 text-sm"
            >
              <option value="">Todas as categorias</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Nenhum produto encontrado.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                    <Link to={`/produto/${product.internal_code || product.id}`}>
                      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4" />
                        ) : (
                          <span className="text-4xl text-gray-300">📦</span>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/produto/${product.internal_code || product.id}`} className="block">
                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      </Link>
                      {product.internal_code && (
                        <p className="text-xs text-gray-400">Cód: {product.internal_code}</p>
                      )}
                      {product.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                          {product.category.name}
                        </span>
                      )}
                      {cart?.enabled && (
                        <button
                          type="button"
                          onClick={() => cart.addProduct(product)}
                          className="mt-3 w-full rounded-lg py-2 text-sm font-semibold text-white transition"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Adicionar a lista
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">← Anterior</button>
                  <span className="text-sm text-gray-500">Página {page} de {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">Próxima →</button>
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
