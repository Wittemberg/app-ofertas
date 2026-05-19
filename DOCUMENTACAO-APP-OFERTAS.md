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
├── .github/workflows/docker.yml    (igual ao admin-ofertas)
├── Dockerfile                       (multi-stage node → nginx)
├── nginx.conf                       (SPA routing + cache + SEO)
├── package.json
├── vite.config.js
├── src/
│   ├── api/
│   │   └── public.js               (chamadas à API sem auth)
│   ├── App.jsx                      (rotas públicas)
│   ├── main.jsx
│   ├── components/
│   │   ├── Header.jsx               (logo + cores do tenant)
│   │   ├── OfferCard.jsx
│   │   └── ...
│   └── pages/
│       ├── Home.jsx                 (destaques)
│       ├── Offers.jsx               (todas ofertas)
│       ├── StoreDetail.jsx
│       └── ProductDetail.jsx
└── public/
    └── favicon.ico

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

