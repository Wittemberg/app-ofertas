# Arquitetura Final
Domínio do cliente                     Domínios do sistema
(ofertas.portonovo.com.br)             (wrtec.com.br)
          │                                    │
          ▼                                    ▼
    ┌─────────────┐                    ┌──────────────────┐
    │   CNAME     │                    │  admin-ofertas   │
    │  portainer   │                    │  wrtec.com.br    │
    │  wrtec.com.br│                    │  (React + nginx) │
    └──────┬───────┘                    └──────────────────┘
           │                                    │
           ▼                                    │
    ┌──────────────────┐                        │
    │   Traefik        │◄───────────────────────┘
    │   (SNI routing)  │
    └──────┬───────┬───┘
           │       │
           ▼       ▼
    ┌──────────┐ ┌──────────┐
    │ app-     │ │ api-     │
    │ ofertas  │ │ ofertas  │
    │ (React)  │ │ (Fastify)│
    └──────────┘ └──────────┘

# Stacks no Portainer
Stack 3 - app-ofertas (NOVO) ghcr.io/wittemberg/app-ofertas:latest 

# CI/CD
--------------------|-----------------------------------------------|-----------------------
Repositório         |               Pipeline                        |       Deploy
--------------------|-----------------------------------------------|-----------------------
api-ofertas         |  Build → Push GHCR → SSH + migrate → Webhook  |  api-ofertas stack
admin-ofertas-front |  Build → Push GHCR → Webhook                  |  admin-ofertas stack
app-ofertas (NOVO)  |  Build → Push GHCR → Webhook                  |  app-ofertas stack
--------------------|-----------------------------------------------|-----------------------

# Estrutura do Novo Repositório
📁 app-ofertas/
├── .github/workflows/docker.yml     ← CI/CD
├── Dockerfile                       ← Build multi-stage
├── nginx.conf                       ← SPA routing + cache
├── package.json                     ← Dependências
├── vite.config.js                   ← Config + proxy
├── index.html                       ← Entry point HTML
├── public/
│   └── favicon.svg                  ← Ícone carrinho
└── src/
    ├── main.jsx                     ← Bootstrap React
    ├── App.jsx                      ← Rotas públicas
    ├── styles/
    │   └── index.css                ← Tailwind + CSS variables
    ├── api/
    │   └── public.js                ← Chamadas à API
    ├── components/
    │   ├── BrandingProvider.jsx     ← Aplica cores/fonte/logo do tenant
    │   ├── Header.jsx               ← Navbar responsiva
    │   ├── OfferCard.jsx            ← Card de oferta com preço/desconto
    │   └── Footer.jsx               ← Rodapé
    └── pages/
        ├── Home.jsx                 ← Hero + destaques + categorias
        ├── Offers.jsx               ← Grid de ofertas com filtro loja
        ├── Products.jsx             ← Produtos com busca + filtro
        ├── Stores.jsx               ← Lista de lojas
        ├── ProductDetail.jsx        ← Detalhe do produto
        └── StoreDetail.jsx          ← Loja + ofertas da loja

# 🚀 Próximos PassosSequência recomendada:
|-|-------------------------------------------|---------------------------------------------------|
|#|   Passo                                   |       Detalhe                                     |
|-|-------------------------------------------|---------------------------------------------------|
|1| Criar repositório app-ofertas no GitHub   |     Vazio, com README
|2| Criar endpoints públicos na API           |     GET /api/public/* sem JWT
|3| Criar frontend público                    |     React + Vite + TailwindCSS
|4| Configurar CI/CD                          |     docker.yml + ghcr.io
|5| Deploy no Portainer                       |     Nova stack + domínio app-ofertas.wrtec.com.br
|-|-------------------------------------------|---------------------------------------------------|

