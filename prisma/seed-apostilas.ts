import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
import * as fs from "fs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// State map for UF detection
const ESTADOS: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
  MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
  PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
  SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
}

// Known orgao abbreviations
const ORGAO_MAP: Record<string, { nome: string; esfera: string; area?: string }> = {
  "alece": { nome: "Assembleia Legislativa do Ceará", esfera: "ESTADUAL", area: "Legislativo" },
  "espcex": { nome: "Escola Preparatória de Cadetes do Exército", esfera: "FEDERAL", area: "Militar" },
  "gcm": { nome: "Guarda Civil Municipal", esfera: "MUNICIPAL", area: "Segurança" },
  "ipe-prev": { nome: "IPE Prev - Instituto de Previdência", esfera: "ESTADUAL", area: "Previdência" },
  "pmesp": { nome: "Polícia Militar do Estado de São Paulo", esfera: "ESTADUAL", area: "Segurança" },
  "policia-penal": { nome: "Polícia Penal", esfera: "ESTADUAL", area: "Segurança" },
  "sedes": { nome: "Secretaria de Desenvolvimento Social", esfera: "ESTADUAL", area: "Social" },
  "prefeitura": { nome: "Prefeitura Municipal", esfera: "MUNICIPAL", area: "Administrativa" },
  "camara": { nome: "Câmara Municipal", esfera: "MUNICIPAL", area: "Legislativo" },
}

function titleCase(str: string): string {
  const smallWords = new Set(["de", "do", "da", "dos", "das", "e", "em", "no", "na", "nos", "nas", "o", "a", "os", "as", "por", "com", "para"])
  return str
    .split(" ")
    .map((word, i) => {
      if (i > 0 && smallWords.has(word.toLowerCase())) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(" ")
}

function slugToTitle(slug: string): string {
  return titleCase(slug.replace(/-/g, " "))
}

function parseApostilaUrl(url: string): {
  slug: string
  concursoSlug: string
  cargoSlug: string
  cargo: string
  estado: string | null
  ano: number | null
  orgaoNome: string
  orgaoKey: string
  esfera: string
  area: string
  nivel: string
  categoriaSlug: string
} {
  // URL format: apostila-concurso-{orgao}-{estado}-{ano}/{cargo}
  const parts = url.split("/")
  const concursoSlug = parts[0] // e.g., apostila-concurso-alece-ce-2026
  const cargoSlug = parts[1] || "geral"

  // Parse cargo
  const cargo = slugToTitle(cargoSlug)

  // Create unique slug for the apostila
  const slug = `${concursoSlug}-${cargoSlug}`

  // Extract year (last 4 digits)
  const yearMatch = concursoSlug.match(/(\d{4})$/)
  const ano = yearMatch ? parseInt(yearMatch[1]) : null

  // Remove "apostila-concurso-" prefix and year suffix to get orgao part
  let orgaoPart = concursoSlug.replace(/^apostila-concurso-/, "")
  if (ano) orgaoPart = orgaoPart.replace(new RegExp(`-${ano}$`), "")

  // Extract state (last 2 chars before year should be a state)
  let estado: string | null = null
  const stateMatch = orgaoPart.match(/-([a-z]{2})$/)
  if (stateMatch) {
    const possibleState = stateMatch[1].toUpperCase()
    if (ESTADOS[possibleState]) {
      estado = possibleState
      orgaoPart = orgaoPart.replace(new RegExp(`-${stateMatch[1]}$`), "")
    }
  }

  // Determine orgao info
  let orgaoNome = ""
  let esfera = "MUNICIPAL"
  let area = "Administrativa"
  let categoriaSlug = "concursos-municipais"

  // Check if starts with known prefix
  if (orgaoPart.startsWith("prefeitura-")) {
    const cidade = slugToTitle(orgaoPart.replace("prefeitura-", ""))
    orgaoNome = `Prefeitura de ${cidade}`
    esfera = "MUNICIPAL"
    categoriaSlug = "prefeituras"
  } else if (orgaoPart.startsWith("camara-")) {
    const cidade = slugToTitle(orgaoPart.replace("camara-", ""))
    orgaoNome = `Câmara Municipal de ${cidade}`
    esfera = "MUNICIPAL"
    categoriaSlug = "camaras-municipais"
  } else {
    // Check ORGAO_MAP
    const mapped = ORGAO_MAP[orgaoPart]
    if (mapped) {
      orgaoNome = mapped.nome
      if (estado) orgaoNome = `${mapped.nome} - ${estado}`
      esfera = mapped.esfera
      area = mapped.area || "Administrativa"
    } else {
      orgaoNome = slugToTitle(orgaoPart)
      if (estado) orgaoNome = `${orgaoNome} - ${estado}`
    }

    // Determine category based on area/esfera
    if (area === "Segurança" || orgaoPart.includes("policia") || orgaoPart.includes("gcm") || orgaoPart.includes("penal")) {
      categoriaSlug = "seguranca-publica"
    } else if (esfera === "FEDERAL" || orgaoPart.includes("espcex")) {
      categoriaSlug = "concursos-federais"
    } else if (esfera === "ESTADUAL") {
      categoriaSlug = "concursos-estaduais"
    }
  }

  // Determine nivel based on cargo keywords
  let nivel = "MEDIO"
  const cargoLower = cargoSlug.toLowerCase()
  if (cargoLower.includes("analista") || cargoLower.includes("professor") || cargoLower.includes("engenheiro") ||
      cargoLower.includes("advogado") || cargoLower.includes("medico") || cargoLower.includes("enfermeiro") ||
      cargoLower.includes("psicologo") || cargoLower.includes("contador") || cargoLower.includes("arquiteto") ||
      cargoLower.includes("biologo") || cargoLower.includes("farmaceutico") || cargoLower.includes("nutricionista") ||
      cargoLower.includes("fisioterapeuta") || cargoLower.includes("pedagogo") || cargoLower.includes("biblioteconomia") ||
      cargoLower.includes("arquivologia") || cargoLower.includes("jornalismo") || cargoLower.includes("direito") ||
      cargoLower.includes("administracao") || cargoLower.includes("economia") || cargoLower.includes("veterinario") ||
      cargoLower.includes("odontologo") || cargoLower.includes("assistente-social") || cargoLower.includes("ciencias")) {
    nivel = "SUPERIOR"
  } else if (cargoLower.includes("tecnico") || cargoLower.includes("agente")) {
    nivel = "MEDIO"
  } else if (cargoLower.includes("auxiliar") || cargoLower.includes("servente") || cargoLower.includes("vigia") ||
             cargoLower.includes("motorista") || cargoLower.includes("operador") || cargoLower.includes("zelador") ||
             cargoLower.includes("merendeira") || cargoLower.includes("gari")) {
    nivel = "FUNDAMENTAL"
  }

  // Area based on cargo
  if (cargoLower.includes("enfermeiro") || cargoLower.includes("medico") || cargoLower.includes("farmaceutico") ||
      cargoLower.includes("nutricionista") || cargoLower.includes("fisioterapeuta") || cargoLower.includes("odontologo") ||
      cargoLower.includes("saude") || cargoLower.includes("veterinario") || cargoLower.includes("psicologo")) {
    area = "Saude"
    if (categoriaSlug === "concursos-municipais" || categoriaSlug === "prefeituras") categoriaSlug = "area-da-saude"
  } else if (cargoLower.includes("professor") || cargoLower.includes("pedagogo") || cargoLower.includes("educador") ||
             cargoLower.includes("educacional")) {
    area = "Educacao"
    if (categoriaSlug === "concursos-municipais" || categoriaSlug === "prefeituras") categoriaSlug = "area-da-educacao"
  }

  return { slug, concursoSlug, cargoSlug, cargo, estado, ano, orgaoNome, orgaoKey: orgaoPart, esfera, area, nivel, categoriaSlug }
}

function generateDescricaoCurta(orgao: string, cargo: string, estado: string | null, ano: number | null): string {
  const estadoNome = estado ? ESTADOS[estado] || estado : ""
  const parts = [
    `Apostila completa para o concurso ${orgao}`,
    cargo !== "Geral" ? ` para o cargo de ${cargo}` : "",
    estadoNome ? ` (${estadoNome})` : "",
    ano ? ` ${ano}` : "",
    ". Material organizado com conteúdo atualizado conforme edital, incluindo teoria objetiva e questões para sua preparação."
  ]
  return parts.join("")
}

function generateDescricaoLonga(orgao: string, cargo: string, estado: string | null, ano: number | null): string {
  const estadoNome = estado ? ESTADOS[estado] || estado : ""
  return `Prepare-se para o concurso ${orgao}${estadoNome ? ` (${estadoNome})` : ""}${ano ? ` ${ano}` : ""} com este material completo${cargo !== "Geral" ? ` para o cargo de ${cargo}` : ""}.

Este material foi elaborado para oferecer uma preparação organizada e objetiva, cobrindo os principais tópicos exigidos no edital. O conteúdo inclui teoria clara e didática, facilitando a compreensão dos assuntos mais relevantes para a prova.

A apostila abrange as disciplinas fundamentais do concurso, com foco nos temas que mais aparecem nas provas anteriores da banca organizadora. Cada capítulo foi estruturado de forma progressiva, permitindo que você estude no seu ritmo e com clareza sobre o que precisa dominar.

Material ideal para quem busca praticidade e organização na hora de estudar, com conteúdo direto ao ponto e alinhado ao que realmente importa para a aprovação.`
}

function generateConteudoProgramatico(cargo: string, area: string): string {
  const base = `1. Língua Portuguesa
- Interpretação e compreensão de textos
- Ortografia oficial
- Acentuação gráfica
- Classes de palavras
- Concordância verbal e nominal
- Regência verbal e nominal
- Pontuação
- Redação oficial

2. Raciocínio Lógico e Matemática
- Operações com números inteiros e racionais
- Porcentagem e juros simples
- Regra de três simples e composta
- Raciocínio lógico
- Sequências e padrões
- Geometria básica

3. Noções de Informática
- Sistemas operacionais
- Editores de texto e planilhas
- Internet e navegadores
- Segurança da informação

4. Atualidades e Conhecimentos Gerais
- Assuntos relevantes no Brasil e no mundo
- Políticas públicas
- Meio ambiente e sustentabilidade`

  const specificByArea: Record<string, string> = {
    "Saude": `\n\n5. Conhecimentos em Saúde Pública
- Sistema Único de Saúde (SUS)
- Políticas de saúde
- Epidemiologia básica
- Biossegurança
- Ética profissional em saúde

6. Conhecimentos Específicos do Cargo
- Legislação aplicada
- Procedimentos e protocolos
- Atenção básica e especializada`,
    "Educacao": `\n\n5. Conhecimentos Pedagógicos
- Lei de Diretrizes e Bases da Educação (LDB)
- Base Nacional Comum Curricular (BNCC)
- Didática e metodologias de ensino
- Avaliação da aprendizagem
- Educação inclusiva

6. Conhecimentos Específicos do Cargo
- Planejamento educacional
- Gestão escolar
- Legislação educacional`,
    "Segurança": `\n\n5. Noções de Direito
- Direito Constitucional
- Direito Administrativo
- Direito Penal e Processual Penal
- Legislação especial
- Direitos Humanos

6. Conhecimentos Específicos
- Legislação institucional
- Procedimentos operacionais
- Ética profissional`,
  }

  return base + (specificByArea[area] || `\n\n5. Legislação
- Constituição Federal (noções básicas)
- Legislação municipal/estadual aplicável
- Estatuto dos servidores
- Lei Orgânica do Município

6. Conhecimentos Específicos
- Temas relacionados ao cargo de ${cargo}
- Legislação aplicada
- Procedimentos e rotinas da área`)
}

function generateBeneficios(): string {
  return `Material completo e atualizado conforme edital
Teoria objetiva e didática para estudo eficiente
Conteúdo organizado por disciplina
Temas mais cobrados pela banca examinadora
Formato digital com acesso imediato após a compra
Material revisado por especialistas em concursos`
}

function generatePublicoAlvo(cargo: string, orgao: string, nivel: string): string {
  const nivelTexto = nivel === "SUPERIOR" ? "nível superior" : nivel === "FUNDAMENTAL" ? "nível fundamental" : "nível médio"
  return `Candidatos que desejam se preparar para o cargo de ${cargo} no concurso ${orgao}, com exigência de ${nivelTexto} completo.`
}

function generateFaq(orgao: string, cargo: string): string {
  return JSON.stringify([
    { pergunta: "Quando recebo o acesso ao material?", resposta: "O acesso é liberado imediatamente após a confirmação do pagamento. Você receberá as instruções por e-mail." },
    { pergunta: "O material é atualizado conforme o edital?", resposta: `Sim, o conteúdo é elaborado e revisado com base no edital do concurso ${orgao}.` },
    { pergunta: "Posso acessar pelo celular?", resposta: "Sim, o material é digital e pode ser acessado por qualquer dispositivo com acesso à internet." },
    { pergunta: "Qual o formato do material?", resposta: "O material é disponibilizado em formato PDF, organizado por disciplina para facilitar seus estudos." },
    { pergunta: "Existe garantia?", resposta: "Sim, oferecemos garantia de 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor." },
    { pergunta: `Esse material serve para o cargo de ${cargo}?`, resposta: `Sim, este material foi elaborado especificamente para o cargo de ${cargo} no concurso ${orgao}, cobrindo todo o conteúdo programático exigido no edital.` },
  ])
}

async function main() {
  console.log("Iniciando seed de apostilas do sitemap...")

  // Read URLs
  const urlsRaw = fs.readFileSync("/tmp/apostilas_only.txt", "utf-8")
  const urls = urlsRaw.trim().split("\n").map(u => u.replace("https://passeiapostila.com.br/apostilas/", ""))

  console.log(`Total de URLs para processar: ${urls.length}`)

  // Pre-fetch categories
  const categorias = await prisma.categoria.findMany()
  const catMap = new Map(categorias.map(c => [c.slug, c.id]))

  // Track created orgaos
  const orgaoCache = new Map<string, string>()

  let created = 0
  let skipped = 0

  for (const url of urls) {
    const parsed = parseApostilaUrl(url)

    // Check if already exists
    const existing = await prisma.apostila.findUnique({ where: { slug: parsed.slug } })
    if (existing) {
      skipped++
      continue
    }

    // Get or create orgao
    let orgaoId: string | undefined
    const orgaoSlug = parsed.orgaoKey
    if (!orgaoCache.has(orgaoSlug)) {
      const existingOrgao = await prisma.orgao.findUnique({ where: { slug: orgaoSlug } })
      if (existingOrgao) {
        orgaoCache.set(orgaoSlug, existingOrgao.id)
      } else {
        const newOrgao = await prisma.orgao.create({
          data: {
            nome: parsed.orgaoNome,
            slug: orgaoSlug,
            esfera: parsed.esfera as "FEDERAL" | "ESTADUAL" | "MUNICIPAL",
            estado: parsed.estado,
          }
        })
        orgaoCache.set(orgaoSlug, newOrgao.id)
      }
    }
    orgaoId = orgaoCache.get(orgaoSlug)

    // Get category
    const categoriaId = catMap.get(parsed.categoriaSlug) || catMap.get("concursos-municipais")

    // Generate content
    const titulo = `Apostila Concurso ${parsed.orgaoNome}${parsed.cargo !== "Geral" ? ` - ${parsed.cargo}` : ""}${parsed.ano ? ` ${parsed.ano}` : ""}`
    const descricaoCurta = generateDescricaoCurta(parsed.orgaoNome, parsed.cargo, parsed.estado, parsed.ano)
    const descricaoLonga = generateDescricaoLonga(parsed.orgaoNome, parsed.cargo, parsed.estado, parsed.ano)
    const conteudoProgramatico = generateConteudoProgramatico(parsed.cargo, parsed.area)
    const beneficios = generateBeneficios()
    const publicoAlvo = generatePublicoAlvo(parsed.cargo, parsed.orgaoNome, parsed.nivel)
    const faq = generateFaq(parsed.orgaoNome, parsed.cargo)

    const seoTitle = `Apostila ${parsed.orgaoNome}${parsed.cargo !== "Geral" ? ` - ${parsed.cargo}` : ""}${parsed.ano ? ` ${parsed.ano}` : ""}`
    const seoDescription = `Apostila completa para concurso ${parsed.orgaoNome}${parsed.cargo !== "Geral" ? `, cargo ${parsed.cargo}` : ""}. Material atualizado com teoria e exercicios.`

    try {
      await prisma.apostila.create({
        data: {
          titulo,
          slug: parsed.slug,
          descricaoCurta,
          descricaoLonga,
          orgaoId,
          cargo: parsed.cargo,
          estado: parsed.estado,
          nivel: parsed.nivel as "FUNDAMENTAL" | "MEDIO" | "TECNICO" | "SUPERIOR",
          area: parsed.area,
          categoriaId,
          statusConcurso: "ABERTO",
          ano: parsed.ano,
          conteudoProgramatico,
          beneficios,
          publicoAlvo,
          faq,
          precoExibido: 29.90,
          status: "PUBLICADO",
          seoTitle: seoTitle.slice(0, 70),
          seoDescription: seoDescription.slice(0, 160),
          keywords: `apostila ${parsed.orgaoNome.toLowerCase()}, concurso ${parsed.cargo.toLowerCase()}, ${parsed.estado || ""}, ${parsed.ano || ""}`.trim(),
        }
      })
      created++
      if (created % 50 === 0) console.log(`Criadas: ${created} apostilas...`)
    } catch (err: any) {
      console.error(`Erro ao criar ${parsed.slug}: ${err.message}`)
    }
  }

  console.log(`\nSeed finalizado!`)
  console.log(`Apostilas criadas: ${created}`)
  console.log(`Apostilas ja existentes (ignoradas): ${skipped}`)

  // Count totals
  const total = await prisma.apostila.count()
  console.log(`Total de apostilas no banco: ${total}`)
}

main()
  .catch((e) => {
    console.error("Erro:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
