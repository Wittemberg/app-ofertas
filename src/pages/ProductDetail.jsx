import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getProducts } from '../api/public'
import { useCart } from '../components/CartProvider'

export default function ProductDetail() {
  const { slug } = useParams()
  const cart = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ limit: 100 })
      .then(data => {
        const found = (data.products || []).find(
          p => p.internal_code === slug || p.id === slug
        )
        setProduct(found || null)
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-12 text-center">
          <p className="text-gray-400 text-lg">Produto não encontrado.</p>
          <Link to="/produtos" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Ver todos os produtos
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
        <div className="max-w-4xl mx-auto">
          <Link to="/produtos" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Voltar aos produtos
          </Link>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="max-h-80 object-contain" />
                ) : (
                  <span className="text-8xl text-gray-300">📦</span>
                )}
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

                {product.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-4">
                    {product.category.name}
                  </span>
                )}

                {product.description && (
                  <p className="text-gray-600 mb-4">{product.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  {product.internal_code && (
                    <p><span className="text-gray-400">Código:</span> {product.internal_code}</p>
                  )}
                  {product.barcode && (
                    <p><span className="text-gray-400">EAN:</span> {product.barcode}</p>
                  )}
                  {product.unit && (
                    <p><span className="text-gray-400">Unidade:</span> {product.unit}</p>
                  )}
                </div>

                {cart?.enabled && (
                  <button
                    type="button"
                    onClick={() => cart.addProduct(product)}
                    className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Adicionar a lista
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
