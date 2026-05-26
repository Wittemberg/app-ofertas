import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createCartSession, submitOrder, updateCartSession } from '../api/public'
import { useBranding } from './BrandingProvider'

const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

function toMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function offerKey(offer) {
  return offer?.id || offer?.product?.id
}

function itemPayload(item) {
  return {
    offer_id: item.offer.id,
    product_id: item.offer.product?.id,
    quantity: item.quantity
  }
}

function itemPrice(item) {
  const value = Number(item.offer.price_to || 0)
  return Number.isFinite(value) && value > 0 ? value : null
}

function isEnabled(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export default function CartProvider({ children }) {
  const { tenant } = useBranding()
  const enabled = isEnabled(tenant?.orders_enabled)
  const storageKey = tenant?.id ? `offers-cart:${tenant.id}` : 'offers-cart'
  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [cartSessionId, setCartSessionId] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [pendingOffer, setPendingOffer] = useState(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!tenant?.id) return
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
    setItems(saved.items || [])
    setCustomer(saved.customer || { name: '', phone: '' })
    setCartSessionId(saved.cartSessionId || '')
    setNote(saved.note || '')
  }, [tenant?.id])

  useEffect(() => {
    if (!tenant?.id) return
    localStorage.setItem(storageKey, JSON.stringify({ items, customer, cartSessionId, note }))
  }, [items, customer, cartSessionId, note, storageKey, tenant?.id])

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (itemPrice(item) || 0) * item.quantity, 0)
  }, [items])

  const apiItems = (nextItems = items) => nextItems.map(itemPayload)

  const syncSession = async (nextItems, nextCustomer = customer) => {
    if (!enabled || !nextCustomer.name || !nextCustomer.phone || nextItems.length === 0) return
    const payload = {
      customer_name: nextCustomer.name,
      customer_phone: nextCustomer.phone,
      items: apiItems(nextItems)
    }
    try {
      if (cartSessionId) {
        await updateCartSession(cartSessionId, payload)
      } else {
        const session = await createCartSession(payload)
        setCartSessionId(session.id)
      }
    } catch (err) {
      console.error('Erro ao sincronizar carrinho:', err)
    }
  }

  const addOfferNow = async (offer) => {
    const key = offerKey(offer)
    const nextItems = (() => {
      const existing = items.find(item => offerKey(item.offer) === key)
      if (existing) {
        return items.map(item => offerKey(item.offer) === key ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...items, { offer, quantity: 1 }]
    })()
    setItems(nextItems)
    setDrawerOpen(true)
    setMessage('Item adicionado a sua lista.')
    await syncSession(nextItems)
  }

  const addOffer = (offer) => {
    setMessage('')
    setError('')
    if (!enabled) return
    if (!customer.name || !customer.phone) {
      setPendingOffer(offer)
      setCustomerOpen(true)
      return
    }
    addOfferNow(offer)
  }

  const addProduct = (product) => {
    addOffer({ product, price_to: null })
  }

  const saveCustomer = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nextCustomer = {
      name: String(form.get('name') || '').trim(),
      phone: String(form.get('phone') || '').trim()
    }
    if (!nextCustomer.name || !nextCustomer.phone) {
      setError('Informe nome e WhatsApp para montar sua lista.')
      return
    }
    setCustomer(nextCustomer)
    setCustomerOpen(false)
    setError('')
    if (pendingOffer) {
      const offer = pendingOffer
      setPendingOffer(null)
      const key = offerKey(offer)
      const nextItems = items.find(item => offerKey(item.offer) === key)
        ? items.map(item => offerKey(item.offer) === key ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { offer, quantity: 1 }]
      setItems(nextItems)
      setDrawerOpen(true)
      await syncSession(nextItems, nextCustomer)
    }
  }

  const updateQuantity = async (key, quantity) => {
    const nextItems = items
      .map(item => offerKey(item.offer) === key ? { ...item, quantity: Math.max(1, quantity) } : item)
      .filter(item => item.quantity > 0)
    setItems(nextItems)
    await syncSession(nextItems)
  }

  const removeItem = async (key) => {
    const nextItems = items.filter(item => offerKey(item.offer) !== key)
    setItems(nextItems)
    await syncSession(nextItems)
  }

  const finishOrder = async () => {
    if (items.length === 0) return
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const order = await submitOrder({
        cart_session_id: cartSessionId || undefined,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_note: note,
        items: apiItems()
      })
      setMessage('Lista enviada com sucesso.')
      setItems([])
      setCartSessionId('')
      setNote('')
      if (order.whatsapp_url) {
        window.open(order.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Nao foi possivel enviar sua lista.')
    } finally {
      setSubmitting(false)
    }
  }

  const value = {
    enabled,
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total,
    addOffer,
    addProduct
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      {enabled && (
        <>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-5 right-5 z-50 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Minha lista ({value.count})
          </button>

          {drawerOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
              <div className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Minha lista</h2>
                    <p className="text-sm text-gray-500">Envie suas ofertas para atendimento.</p>
                  </div>
                  <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg border px-3 py-1 text-sm">Fechar</button>
                </div>

                {message && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
                {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

                {items.length === 0 ? (
                  <p className="py-10 text-center text-sm text-gray-500">Sua lista ainda esta vazia.</p>
                ) : (
                  <div className="space-y-3">
                    {items.map(item => {
                      const key = offerKey(item.offer)
                      const price = itemPrice(item)
                      return (
                        <div key={key} className="rounded-lg border p-3">
                          <div className="flex gap-3">
                            {item.offer.product?.image_url && (
                              <img src={item.offer.product.image_url} alt="" className="h-16 w-16 rounded object-contain" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">{item.offer.product?.name || 'Produto'}</p>
                              <p className="text-sm font-bold text-red-600">{price ? toMoney(price) : 'Preco sob consulta'}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <button type="button" onClick={() => updateQuantity(key, item.quantity - 1)} className="h-8 w-8 rounded border">-</button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <button type="button" onClick={() => updateQuantity(key, item.quantity + 1)} className="h-8 w-8 rounded border">+</button>
                                <button type="button" onClick={() => removeItem(key)} className="ml-auto text-sm text-red-600">Remover</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-5 space-y-4 border-t pt-4">
                    <div className="rounded-lg bg-gray-50 p-3 text-sm">
                      <div className="font-semibold text-gray-900">{customer.name}</div>
                      <div className="text-gray-500">{customer.phone}</div>
                      <button type="button" onClick={() => setCustomerOpen(true)} className="mt-1 text-sm text-blue-600">Alterar dados</button>
                    </div>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Observacao</span>
                      <textarea value={note} onChange={event => setNote(event.target.value)} rows="3" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Ex: Quero retirar na loja, confirmar disponibilidade..." />
                    </label>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total estimado</span>
                      <span>{total > 0 ? toMoney(total) : 'Sob consulta'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={finishOrder}
                      disabled={submitting}
                      className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {submitting ? 'Enviando...' : 'Enviar lista'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {customerOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
              <form onSubmit={saveCustomer} className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900">Monte sua lista</h2>
                <p className="mt-1 text-sm text-gray-500">Informe seus dados para salvar a lista e facilitar o atendimento.</p>
                {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
                <label className="mt-4 block">
                  <span className="text-sm font-medium text-gray-700">Nome</span>
                  <input name="name" defaultValue={customer.name} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                  <input name="phone" defaultValue={customer.phone} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </label>
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => setCustomerOpen(false)} className="flex-1 rounded-lg border px-4 py-2 text-sm">Cancelar</button>
                  <button type="submit" className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--primary)' }}>Continuar</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </CartContext.Provider>
  )
}
