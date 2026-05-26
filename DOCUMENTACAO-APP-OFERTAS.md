# app-ofertas - Documentacao Tecnica

Frontend publico do projeto Ofertas. O app e multi-tenant, carrega branding pelo dominio acessado e consome endpoints publicos da `api-ofertas`.

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 | Interface publica |
| Vite 8 | Build |
| React Router DOM 7 | Rotas |
| TailwindCSS 4 | Estilizacao |
| Axios | Chamadas HTTP |

## Rotas

| Rota | Arquivo | Finalidade |
| --- | --- | --- |
| `/` | `src/pages/Home.jsx` | Home com hero, ofertas em destaque e categorias |
| `/ofertas` | `src/pages/Offers.jsx` | Lista de ofertas com filtro por loja |
| `/produtos` | `src/pages/Products.jsx` | Lista de produtos com busca/filtro |
| `/lojas` | `src/pages/Stores.jsx` | Lista de lojas |
| `/produto/:slug` | `src/pages/ProductDetail.jsx` | Detalhe do produto |
| `/loja/:slug` | `src/pages/StoreDetail.jsx` | Detalhe da loja |

## Branding

Arquivo: `src/components/BrandingProvider.jsx`

O app chama `GET /api/public/tenant?domain=...` e aplica:

- nome do cliente
- logo
- cores
- fonte
- contatos
- endereco
- redes sociais
- horarios
- configuracoes de pedidos/lista

## Carrinho / Minha Lista

Arquivo: `src/components/CartProvider.jsx`

Quando `tenant.orders_enabled` estiver ativo, o site publico mostra:

- botao "Adicionar a lista" nos cards de oferta
- botao flutuante "Minha lista"
- modal para capturar nome e WhatsApp no primeiro item
- lista persistida no navegador
- sincronizacao com `cart_sessions` na API
- envio final para `POST /api/public/orders`

Fluxo:

1. Cliente navega pelas ofertas.
2. Ao adicionar o primeiro item, informa nome e WhatsApp.
3. A API cria uma sessao de carrinho.
4. Cada alteracao atualiza a sessao.
5. Ao finalizar, a API salva o pedido, envia e-mail e retorna link de WhatsApp.
6. Se houver link de WhatsApp, o app abre a conversa com a mensagem pronta.

## API Publica Usada

Arquivo: `src/api/public.js`

| Funcao | Endpoint |
| --- | --- |
| `getTenant()` | `GET /api/public/tenant` |
| `getOffers()` | `GET /api/public/offers` |
| `getProducts()` | `GET /api/public/products` |
| `getStores()` | `GET /api/public/stores` |
| `getCategories()` | `GET /api/public/categories` |
| `createCartSession()` | `POST /api/public/cart-sessions` |
| `updateCartSession()` | `PUT /api/public/cart-sessions/:id` |
| `submitOrder()` | `POST /api/public/orders` |

## Deploy

Build multi-stage com Node e Nginx. O deploy roda via GitHub Actions, imagem no registry configurado e redeploy pelo Portainer.

## Proximos Passos

- Tela publica de acompanhamento de pedido, se necessario.
- Modo balcao para loja receber pedidos em tempo quase real.
- Integracao de pedidos com ERP.
- Alertas sonoros/visuais no painel administrativo.

Atualizado em 26/05/2026.
