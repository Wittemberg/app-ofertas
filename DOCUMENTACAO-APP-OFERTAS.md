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
- limpeza do carrinho local apos pedido enviado com sucesso

Fluxo:

1. Cliente navega pelas ofertas.
2. Ao adicionar o primeiro item, informa nome e WhatsApp.
3. A API cria uma sessao de carrinho.
4. Cada alteracao atualiza a sessao.
5. A sessao permite medir carrinho ativo e carrinho abandonado.
6. Ao finalizar, a API salva o pedido, registra historico inicial, envia e-mail e retorna link de WhatsApp.
7. Se houver link de WhatsApp, o app abre a conversa com a mensagem pronta.
8. O carrinho local e limpo para evitar reutilizar quantidades antigas em uma nova lista.

## Regras de Carrinho Abandonado

O tempo de inatividade e configuravel por tenant no painel administrativo, em `cart_abandonment_minutes`.

O site publico apenas envia as atividades para a API:

- criacao da sessao no primeiro item;
- atualizacao da lista quando itens mudam;
- conversao da sessao quando o pedido e finalizado.

A classificacao de abandono e calculada pela API/dashboard com base na ultima atividade.

## Envio de Pedido

O pedido enviado pelo site publico contem:

- nome do cliente;
- WhatsApp do cliente;
- observacao opcional;
- loja selecionada, quando houver;
- itens com quantidade;
- origem `site`.

A API salva snapshots dos itens para que alteracoes futuras de produto/oferta nao mudem o historico do pedido.

No painel administrativo, esse pedido aparece em:

- dashboard;
- tela `/pedidos`;
- mesa `/atendimento`;
- relatorios CSV;
- historico de status.

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
- Integracao de pedidos com ERP.
- Melhorias visuais no modal de carrinho para mobile.
- Identificacao opcional de loja preferida antes de adicionar itens.

Atualizado em 27/05/2026.
