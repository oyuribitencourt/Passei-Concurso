import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Iniciando seed...")

  // Admin user — credenciais via variáveis de ambiente
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPass = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPass) {
    console.error("ERRO: Defina ADMIN_EMAIL e ADMIN_PASSWORD nas variáveis de ambiente.")
    process.exit(1)
  }

  if (adminPass.length < 12) {
    console.error("ERRO: ADMIN_PASSWORD deve ter no mínimo 12 caracteres.")
    process.exit(1)
  }

  const adminPassword = await hash(adminPass, 12)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPassword },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
    },
  })
  console.log("Admin criado:", admin.email)

  // Categorias
  const categorias = [
    { nome: "Concursos Municipais", slug: "concursos-municipais", descricao: "Apostilas para concursos de prefeituras, câmaras municipais e órgãos municipais em todo o Brasil.", seoTitle: "Apostilas para Concursos Municipais", seoDescription: "Encontre apostilas atualizadas para concursos municipais. Prefeituras, câmaras e órgãos municipais.", ordem: 1 },
    { nome: "Concursos Estaduais", slug: "concursos-estaduais", descricao: "Apostilas para concursos estaduais, incluindo secretarias, autarquias e órgãos estaduais.", seoTitle: "Apostilas para Concursos Estaduais", seoDescription: "Apostilas para concursos estaduais. Prepare-se com materiais atualizados e organizados.", ordem: 2 },
    { nome: "Concursos Federais", slug: "concursos-federais", descricao: "Apostilas para concursos federais de alto nível, incluindo ministérios, agências e autarquias federais.", seoTitle: "Apostilas para Concursos Federais", seoDescription: "Apostilas para concursos federais. Materiais completos para sua preparação.", ordem: 3 },
    { nome: "Área Administrativa", slug: "area-administrativa", descricao: "Apostilas para cargos administrativos em concursos públicos. Assistente, auxiliar, técnico administrativo e mais.", seoTitle: "Apostilas para Área Administrativa", seoDescription: "Apostilas para cargos administrativos em concursos públicos.", ordem: 4 },
    { nome: "Área da Saúde", slug: "area-da-saude", descricao: "Apostilas para concursos na área da saúde. Enfermagem, medicina, odontologia, farmácia e mais.", seoTitle: "Apostilas para Área da Saúde", seoDescription: "Apostilas para concursos na área da saúde. Materiais para todas as especialidades.", ordem: 5 },
    { nome: "Área da Educação", slug: "area-da-educacao", descricao: "Apostilas para concursos na área da educação. Professor, pedagogo, diretor escolar e mais.", seoTitle: "Apostilas para Área da Educação", seoDescription: "Apostilas para concursos na área da educação.", ordem: 6 },
    { nome: "Segurança Pública", slug: "seguranca-publica", descricao: "Apostilas para concursos de segurança pública. Polícia, bombeiros, guarda municipal e mais.", seoTitle: "Apostilas para Segurança Pública", seoDescription: "Apostilas para concursos de segurança pública.", ordem: 7 },
    { nome: "Tribunais", slug: "tribunais", descricao: "Apostilas para concursos de tribunais. TJ, TRF, TRT, TSE, STJ e mais.", seoTitle: "Apostilas para Tribunais", seoDescription: "Apostilas para concursos de tribunais em todo o Brasil.", ordem: 8 },
    { nome: "Prefeituras", slug: "prefeituras", descricao: "Apostilas específicas para concursos de prefeituras municipais em todo o Brasil.", seoTitle: "Apostilas para Prefeituras", seoDescription: "Apostilas para concursos de prefeituras municipais.", ordem: 9 },
    { nome: "Câmaras Municipais", slug: "camaras-municipais", descricao: "Apostilas para concursos de câmaras municipais. Diversos cargos e níveis.", seoTitle: "Apostilas para Câmaras Municipais", seoDescription: "Apostilas para concursos de câmaras municipais.", ordem: 10 },
  ]

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log("Categorias criadas:", categorias.length)

  // Bancas
  const bancas = [
    { nome: "CESPE/CEBRASPE", slug: "cespe-cebraspe" },
    { nome: "FCC", slug: "fcc" },
    { nome: "FGV", slug: "fgv" },
    { nome: "VUNESP", slug: "vunesp" },
    { nome: "IBFC", slug: "ibfc" },
    { nome: "IADES", slug: "iades" },
    { nome: "IDECAN", slug: "idecan" },
    { nome: "INSTITUTO AOCP", slug: "instituto-aocp" },
    { nome: "CONSULPLAN", slug: "consulplan" },
    { nome: "FUNDEP", slug: "fundep" },
    { nome: "OBJETIVA", slug: "objetiva" },
    { nome: "FUNDATEC", slug: "fundatec" },
    { nome: "QUADRIX", slug: "quadrix" },
    { nome: "ACAFE", slug: "acafe" },
    { nome: "COPS/UEL", slug: "cops-uel" },
  ]

  for (const banca of bancas) {
    await prisma.banca.upsert({
      where: { slug: banca.slug },
      update: {},
      create: banca,
    })
  }
  console.log("Bancas criadas:", bancas.length)

  // Orgaos
  const orgaos = [
    { nome: "Prefeitura Municipal Modelo", slug: "prefeitura-municipal-modelo", sigla: "PMM", esfera: "MUNICIPAL" as const, estado: "SP" },
  ]

  for (const orgao of orgaos) {
    await prisma.orgao.upsert({
      where: { slug: orgao.slug },
      update: {},
      create: orgao,
    })
  }
  console.log("Órgãos criados:", orgaos.length)

  // Apostila modelo
  const catMunicipal = await prisma.categoria.findUnique({ where: { slug: "concursos-municipais" } })
  const bancaModelo = await prisma.banca.findUnique({ where: { slug: "vunesp" } })
  const orgaoModelo = await prisma.orgao.findUnique({ where: { slug: "prefeitura-municipal-modelo" } })

  await prisma.apostila.upsert({
    where: { slug: "apostila-modelo-concurso-publico-municipal" },
    update: {},
    create: {
      titulo: "Apostila Modelo para Concurso Público Municipal",
      slug: "apostila-modelo-concurso-publico-municipal",
      descricaoCurta: "Material completo e organizado para preparação em concurso público municipal. Conteúdo atualizado conforme edital, com teoria e exercícios.",
      descricaoLonga: "Esta apostila modelo foi desenvolvida para demonstrar a estrutura completa de materiais disponíveis na plataforma Passei Concurso. O conteúdo abrange as principais disciplinas cobradas em concursos públicos municipais, incluindo Língua Portuguesa, Matemática, Conhecimentos Gerais, Legislação Municipal e Conhecimentos Específicos.\n\nO material é organizado de forma didática, com teoria objetiva, resumos, quadros sinópticos e exercícios comentados para facilitar seu aprendizado e revisão.\n\nEsta é uma apostila de demonstração para validar o layout e a experiência de compra da plataforma.",
      orgaoId: orgaoModelo?.id,
      cargo: "Assistente Administrativo",
      bancaId: bancaModelo?.id,
      estado: "SP",
      cidade: "São Paulo",
      nivel: "MEDIO",
      area: "Administrativa",
      categoriaId: catMunicipal?.id,
      statusConcurso: "ABERTO",
      ano: 2026,
      conteudoProgramatico: "1. Língua Portuguesa\n- Interpretação de texto\n- Ortografia oficial\n- Acentuação gráfica\n- Classes de palavras\n- Concordância verbal e nominal\n- Regência verbal e nominal\n- Pontuação\n- Sinônimos e antônimos\n\n2. Matemática\n- Números inteiros e racionais\n- Porcentagem\n- Regra de três\n- Equações de 1º e 2º grau\n- Geometria básica\n- Raciocínio lógico\n\n3. Conhecimentos Gerais\n- Atualidades\n- Geografia do Brasil\n- História do Brasil\n- Meio ambiente\n\n4. Legislação Municipal\n- Lei Orgânica do Município\n- Estatuto dos Servidores\n- Regime Jurídico\n\n5. Conhecimentos Específicos\n- Noções de administração pública\n- Atendimento ao público\n- Redação oficial\n- Noções de informática\n- Arquivo e protocolo",
      beneficios: "Material completo e atualizado conforme edital\nTeoria objetiva e didática para estudo eficiente\nExercícios comentados\nQuadros sinópticos para revisão rápida\nConteúdo organizado por disciplina\nFormato digital com acesso imediato",
      publicoAlvo: "Candidatos que desejam se preparar para concursos públicos municipais na área administrativa, com exigência de nível médio completo.",
      faq: '[{"pergunta":"Quando recebo o acesso ao material?","resposta":"O acesso é liberado imediatamente após a confirmação do pagamento."},{"pergunta":"O material é atualizado?","resposta":"Sim, o conteúdo é revisado e atualizado conforme o edital do concurso."},{"pergunta":"Posso acessar pelo celular?","resposta":"Sim, o material é digital e pode ser acessado por qualquer dispositivo."},{"pergunta":"Qual o formato do material?","resposta":"O material é disponibilizado em formato PDF, organizado por disciplina."},{"pergunta":"Existe garantia?","resposta":"Consulte os termos de uso para informações sobre política de reembolso."}]',
      precoExibido: 39.90,
      status: "PUBLICADO",
      seoTitle: "Apostila para Concurso Público Municipal - Assistente Administrativo",
      seoDescription: "Apostila completa para concurso público municipal. Material atualizado com teoria e exercícios para o cargo de Assistente Administrativo.",
      keywords: "apostila concurso municipal, concurso prefeitura, assistente administrativo, apostila concurso público",
    },
  })
  console.log("Apostila modelo criada")

  // Sitemap source
  await prisma.sitemapSource.upsert({
    where: { url: "https://passeiapostila.com.br/sitemap.xml" },
    update: {},
    create: {
      nome: "Passei Apostila",
      url: "https://passeiapostila.com.br/sitemap.xml",
      ativo: true,
      intervaloHoras: 24,
    },
  })
  console.log("Fonte de sitemap criada")

  // Ticto config
  const existingTicto = await prisma.tictoConfig.findFirst()
  if (!existingTicto) {
    await prisma.tictoConfig.create({
      data: {
        ativo: false,
      },
    })
    console.log("Configuração Ticto criada")
  }

  // Sample notifications
  await prisma.notification.createMany({
    data: [
      {
        tipo: "SISTEMA",
        titulo: "Bem-vindo ao Passei Concurso",
        mensagem: "Sua plataforma está configurada e pronta para uso. Comece cadastrando suas primeiras apostilas.",
        userId: admin.id,
      },
      {
        tipo: "SEM_LINK_TICTO",
        titulo: "Apostila sem link de checkout",
        mensagem: "A apostila modelo ainda não possui link de checkout da Ticto configurado. Configure para ativar a venda.",
        link: "/admin/apostilas",
        userId: admin.id,
      },
    ],
  })
  console.log("Notificações de exemplo criadas")

  console.log("Seed concluido com sucesso!")
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
