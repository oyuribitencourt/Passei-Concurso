# Passei Concurso

Plataforma completa para venda de apostilas digitais para concursos publicos.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilizacao**: TailwindCSS v4 + shadcn/ui
- **Banco de Dados**: PostgreSQL (compativel com Supabase/Neon)
- **ORM**: Prisma 7 com adapter PG
- **Autenticacao**: NextAuth v5 (Auth.js)
- **Formularios**: React Hook Form + Zod
- **Graficos**: Recharts
- **Icones**: Lucide React
- **Parsing XML**: xml2js

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

## Instalacao

```bash
# Clonar o repositorio
git clone https://github.com/oyuribitencourt/Passei-Concurso.git
cd Passei-Concurso

# Instalar dependencias
npm install

# Copiar variaveis de ambiente
cp .env.example .env

# Editar o .env com suas credenciais
# DATABASE_URL, AUTH_SECRET, etc.

# Gerar o Prisma Client
npm run db:generate

# Criar as tabelas no banco
npm run db:push

# Popular com dados iniciais
npm run db:seed

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## Credenciais do Admin (seed)

- **Email**: definido em `ADMIN_EMAIL`
- **Senha**: definido em `ADMIN_PASSWORD`

Acesse o painel em: http://localhost:3000/admin/login

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Servidor de producao |
| `npm run lint` | Executar ESLint |
| `npm run db:generate` | Gerar Prisma Client |
| `npm run db:push` | Sincronizar schema com banco |
| `npm run db:migrate` | Criar migration |
| `npm run db:seed` | Popular banco com dados iniciais |
| `npm run db:studio` | Abrir Prisma Studio |

## Estrutura do Projeto

```
src/
  app/
    (public)/              # Paginas publicas
      page.tsx             # Home
      busca/               # Busca com filtros
      apostilas/[slug]/    # Pagina da apostila (landing page)
      apostilas/estado/    # Filtro por estado
      apostilas/banca/     # Filtro por banca
      apostilas/cargo/     # Filtro por cargo
      categorias/[slug]/   # Pagina de categoria
      concursos/[slug]/    # Pagina de concurso
      concursos-novos/     # Novos concursos detectados
      sobre/               # Sobre
      contato/             # Contato
      politica-de-privacidade/
      termos-de-uso/
    (admin)/               # Painel administrativo
      admin/
        login/             # Login
        dashboard/         # Dashboard com metricas
        apostilas/         # CRUD de apostilas
        concursos/         # CRUD de concursos
        categorias/        # CRUD de categorias
        monitoramento/     # Fontes e novidades
        notificacoes/      # Notificacoes internas
        configuracoes/     # Configuracoes gerais
        integracoes/ticto/ # Integracao Ticto
    api/
      auth/                # NextAuth endpoints
      admin/               # APIs admin (protegidas)
      busca/               # Busca publica
      webhooks/ticto/      # Webhook da Ticto
      cron/sitemap/        # Cron de monitoramento
      sitemap/             # Sitemap XML
  components/
    public/                # Componentes do site publico
    admin/                 # Componentes do admin
    ui/                    # shadcn/ui
  lib/
    prisma.ts              # Instancia do Prisma
    auth.ts                # Configuracao NextAuth
    auth-guard.ts          # Protecao de rotas API
    sitemap-parser.ts      # Parser de sitemaps XML
    sitemap-monitor.ts     # Monitor de concorrentes
    notifications.ts       # Sistema de notificacoes
    audit.ts               # Log de auditoria
    utils.ts               # Utilitarios
  types/
    next-auth.d.ts         # Types do NextAuth
prisma/
  schema.prisma            # Schema do banco
  seed.ts                  # Dados iniciais
```

## Modelos do Banco

- **User** - Usuarios admin
- **Apostila** - Apostilas/produtos
- **Concurso** - Concursos publicos
- **Categoria** - Categorias de concursos
- **Banca** - Bancas organizadoras
- **Orgao** - Orgaos publicos
- **SitemapSource** - Fontes de sitemap para monitoramento
- **SitemapUrl** - URLs encontradas nos sitemaps
- **DetectedOpportunity** - Oportunidades detectadas
- **MonitorLog** - Logs de monitoramento
- **Notification** - Notificacoes internas
- **TictoConfig** - Configuracao da Ticto
- **TictoWebhookLog** - Logs de webhooks
- **AuditLog** - Auditoria de acoes

## Paginas Publicas

Todas as paginas publicas sao tratadas como landing pages:

- **Home**: Hero, busca, destaques, categorias, beneficios, FAQ, CTA
- **Apostila**: Landing page de conversao com CTA, conteudo programatico, FAQ, produtos relacionados
- **Busca**: Filtros avancados (estado, banca, categoria, nivel, area)
- **Categorias**: Landing pages por categoria
- **Filtros**: Paginas por estado, banca e cargo

## Integracao Ticto

A plataforma utiliza a Ticto para processamento de pagamentos:

- Cada apostila tem campo de link de checkout da Ticto
- Botao "Comprar Agora" redireciona para o checkout da Ticto
- Webhook preparado em `/api/webhooks/ticto`
- Configuracao no admin em `/admin/integracoes/ticto`

## Monitoramento de Sitemaps

O sistema monitora sitemaps publicos de concorrentes:

1. Cadastre fontes de sitemap no admin
2. O sistema busca periodicamente as URLs
3. Novas URLs sao detectadas e analisadas
4. Oportunidades podem ser convertidas em apostilas

Endpoint de cron: `GET /api/cron/sitemap` (requer header `x-cron-secret`)

## SEO

- Sitemap XML automatico (`/sitemap.xml`)
- robots.txt
- Meta tags otimizadas em todas as paginas
- Open Graph
- JSON-LD para produtos (schema.org)
- URLs amigaveis
- Breadcrumbs

## Deploy (Vercel)

1. Conecte o repositorio na Vercel
2. Configure as variaveis de ambiente
3. O build roda automaticamente
4. Configure um banco PostgreSQL (Supabase, Neon ou Vercel Postgres)

Variaveis necessarias:
- `DATABASE_URL`
- `AUTH_SECRET` (gere com `openssl rand -base64 32`)
- `NEXTAUTH_URL`
- `CRON_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`

## Checklist de Implementacao

- [x] Projeto Next.js 16 com TypeScript
- [x] TailwindCSS v4 + shadcn/ui
- [x] Prisma 7 com PostgreSQL
- [x] Identidade visual propria (azul profundo + verde CTA)
- [x] Home page como landing page completa
- [x] Pagina individual de apostila (landing page de conversao)
- [x] Busca com filtros avancados
- [x] Paginas de categoria como landing pages
- [x] Filtros por estado, banca e cargo
- [x] Concursos novos detectados
- [x] Paginas institucionais (Sobre, Contato, Privacidade, Termos)
- [x] Painel admin com login seguro
- [x] Dashboard com estatisticas
- [x] CRUD completo de apostilas
- [x] CRUD de concursos
- [x] CRUD de categorias
- [x] Monitoramento de sitemaps
- [x] Deteccao de novas oportunidades
- [x] Parser de URLs para extrair informacoes
- [x] Sistema de notificacoes internas
- [x] Integracao com Ticto (link de checkout)
- [x] Webhook da Ticto preparado
- [x] Configuracao da Ticto no admin
- [x] SEO programatico
- [x] Sitemap XML automatico
- [x] robots.txt
- [x] JSON-LD para produtos
- [x] Open Graph
- [x] Breadcrumbs
- [x] Design responsivo
- [x] Seed com dados iniciais
- [x] Protecao de rotas admin
- [x] Validacao com Zod
- [x] Log de auditoria
- [x] Apostila modelo de demonstracao

## Pontos Futuros Recomendados

- [ ] Testes automatizados (Jest/Vitest)
- [ ] Rate limiting nas APIs publicas
- [ ] Cache com Redis
- [ ] Envio de emails transacionais (Resend)
- [ ] Notificacoes por email
- [ ] Upload de imagens (S3/Cloudflare R2)
- [ ] Editor de conteudo rich text
- [ ] Relatorios de vendas (via webhooks Ticto)
- [ ] A/B testing de CTAs
- [ ] Analytics (Plausible/Umami)
- [ ] PWA para acesso offline
- [ ] API publica documentada
- [ ] Sistema de cupons de desconto
- [ ] Integracao com outras plataformas de pagamento
