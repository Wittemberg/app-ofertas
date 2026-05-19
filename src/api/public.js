import axios from 'axios'

const API = 'https://api-ofertas.wrtec.com.br'

export function getDomain() { return window.location.hostname }

export async function getTenant() {
  const domain = getDomain()
  const res = await axios.get(`${API}/api/public/tenant`, { params: { domain } })
  return res.data
}

export async function getOffers({ page = 1, limit = 50, store_id, is_featured } = {}) {
  const domain = getDomain()
  const params = { domain, page, limit }
  if (store_id) params.store_id = store_id
  if (is_featured) params.is_featured = is_featured
  const res = await axios.get(`${API}/api/public/offers`, { params })
  return res.data
}

export async function getProducts({ page = 1, limit = 50, category_id, search } = {}) {
  const domain = getDomain()
  const params = { domain, page, limit }
  if (category_id) params.category_id = category_id
  if (search) params.search = search
  const res = await axios.get(`${API}/api/public/products`, { params })
  return res.data
}

export async function getStores() {
  const domain = getDomain()
  const res = await axios.get(`${API}/api/public/stores`, { params: { domain } })
  return res.data
}

export async function getCategories() {
  const domain = getDomain()
  const res = await axios.get(`${API}/api/public/categories`, { params: { domain } })
  return res.data
}