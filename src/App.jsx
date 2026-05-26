import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OffersPage from './pages/Offers'
import ProductsPage from './pages/Products'
import StoresPage from './pages/Stores'
import ProductDetail from './pages/ProductDetail'
import StoreDetail from './pages/StoreDetail'
import BrandingProvider from './components/BrandingProvider'
import CartProvider from './components/CartProvider'

export default function App() {
  return (
    <BrandingProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ofertas" element={<OffersPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/lojas" element={<StoresPage />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/loja/:slug" element={<StoreDetail />} />
        </Routes>
      </CartProvider>
    </BrandingProvider>
  )
}
