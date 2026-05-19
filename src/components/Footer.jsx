import { useBranding } from './BrandingProvider'

export default function Footer() {
  const { tenant } = useBranding()

  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-8 w-auto brightness-0 invert opacity-70" />
            ) : (
              <span className="text-lg font-bold text-white">🛒 Ofertas</span>
            )}
            <span className="text-sm">{tenant?.name || 'Ofertas'}</span>
          </div>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} {tenant?.name || 'Ofertas'}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}