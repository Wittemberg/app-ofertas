import { Link } from 'react-router-dom'
import { useCart } from './CartProvider'

export default function OfferCard({ offer }) {
  const cart = useCart()
  const { product, store, price_from, price_to, is_featured } = offer
  const hasDiscount = price_from && parseFloat(price_to) < parseFloat(price_from)
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(price_to) / parseFloat(price_from)) * 100)
    : 0

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition ${is_featured ? 'ring-2 ring-accent/30' : ''}`}>
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product?.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4" />
        ) : (
          <span className="text-4xl text-gray-300">📦</span>
        )}
      </div>

      {is_featured && (
        <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
          ⭐ Destaque
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product?.name || 'Produto'}</h3>

        <div className="flex items-baseline gap-2 mb-2">
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              R$ {parseFloat(price_from).toFixed(2)}
            </span>
          )}
          <span className={`font-bold ${hasDiscount ? 'text-red-600 text-xl' : 'text-gray-900 text-lg'}`}>
            R$ {parseFloat(price_to).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
              -{discountPercent}%
            </span>
          )}
        </div>

        {store && (
          <p className="text-xs text-gray-500 mb-3">
            📍 {store.name}{store.city ? ` - ${store.city}` : ''}
          </p>
        )}

        <div className="grid gap-2">
          {cart?.enabled && (
            <button
              type="button"
              onClick={() => cart.addOffer(offer)}
              className="w-full rounded-lg py-2 text-sm font-semibold text-white transition"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Adicionar a lista
            </button>
          )}
          <Link
            to={`/produto/${product?.internal_code || product?.id}`}
            className="block w-full text-center py-2 rounded-lg text-sm font-medium transition btn-primary"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}
