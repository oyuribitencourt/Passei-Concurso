import { PrismaClient } from "../src/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const ESTADOS: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
  MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
  PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
  SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
}

// Map of unaccented → accented replacements for visible text
const replacements: [RegExp, string][] = [
  // Orgao names
  [/Assembleia Legislativa do Ceara/g, "Assembleia Legislativa do Ceará"],
  [/Escola Preparatoria de Cadetes do Exercito/g, "Escola Preparatória de Cadetes do Exército"],
  [/Instituto de Previdencia/g, "Instituto de Previdência"],
  [/Policia Militar do Estado de Sao Paulo/g, "Polícia Militar do Estado de São Paulo"],
  [/Policia Penal/g, "Polícia Penal"],
  [/Camara Municipal/g, "Câmara Municipal"],
  [/Guarda Civil Municipal/g, "Guarda Civil Municipal"],

  // Common words in descriptions
  [/Apostila completa para o concurso/g, "Apostila completa para o concurso"],
  [/Material organizado com conteudo atualizado conforme edital, incluindo teoria objetiva e questoes para sua preparacao\./g,
   "Material organizado com conteúdo atualizado conforme edital, incluindo teoria objetiva e questões para sua preparação."],
  [/conteudo atualizado/g, "conteúdo atualizado"],
  [/questoes para sua preparacao/g, "questões para sua preparação"],
  [/preparacao organizada e objetiva/g, "preparação organizada e objetiva"],
  [/topicos exigidos no edital/g, "tópicos exigidos no edital"],
  [/teoria clara e didatica/g, "teoria clara e didática"],
  [/compreensao dos assuntos/g, "compreensão dos assuntos"],
  [/Cada capitulo foi estruturado/g, "Cada capítulo foi estruturado"],
  [/praticidade e organizacao/g, "praticidade e organização"],
  [/conteudo direto ao ponto/g, "conteúdo direto ao ponto"],
  [/aprovacao\./g, "aprovação."],
  [/Prepare-se para o concurso/g, "Prepare-se para o concurso"],

  // Conteudo Programatico
  [/Lingua Portuguesa/g, "Língua Portuguesa"],
  [/Interpretacao e compreensao de textos/g, "Interpretação e compreensão de textos"],
  [/Ortografia oficial/g, "Ortografia oficial"],
  [/Acentuacao grafica/g, "Acentuação gráfica"],
  [/Concordancia verbal e nominal/g, "Concordância verbal e nominal"],
  [/Regencia verbal e nominal/g, "Regência verbal e nominal"],
  [/Pontuacao/g, "Pontuação"],
  [/Redacao oficial/g, "Redação oficial"],
  [/Raciocinio Logico e Matematica/g, "Raciocínio Lógico e Matemática"],
  [/Raciocinio logico/g, "Raciocínio lógico"],
  [/Operacoes com numeros inteiros e racionais/g, "Operações com números inteiros e racionais"],
  [/Porcentagem e juros simples/g, "Porcentagem e juros simples"],
  [/Regra de tres simples e composta/g, "Regra de três simples e composta"],
  [/Sequencias e padroes/g, "Sequências e padrões"],
  [/Geometria basica/g, "Geometria básica"],
  [/Nocoes de Informatica/g, "Noções de Informática"],
  [/Sistemas operacionais/g, "Sistemas operacionais"],
  [/planilhas/g, "planilhas"],
  [/navegadores/g, "navegadores"],
  [/Seguranca da informacao/g, "Segurança da informação"],
  [/Atualidades e Conhecimentos Gerais/g, "Atualidades e Conhecimentos Gerais"],
  [/Politicas publicas/g, "Políticas públicas"],
  [/sustentabilidade/g, "sustentabilidade"],

  // Health area
  [/Conhecimentos em Saude Publica/g, "Conhecimentos em Saúde Pública"],
  [/Sistema Unico de Saude \(SUS\)/g, "Sistema Único de Saúde (SUS)"],
  [/Politicas de saude/g, "Políticas de saúde"],
  [/Epidemiologia basica/g, "Epidemiologia básica"],
  [/Biosseguranca/g, "Biossegurança"],
  [/Etica profissional em saude/g, "Ética profissional em saúde"],
  [/Etica profissional/g, "Ética profissional"],
  [/Legislacao aplicada/g, "Legislação aplicada"],
  [/Atencao basica e especializada/g, "Atenção básica e especializada"],

  // Education area
  [/Conhecimentos Pedagogicos/g, "Conhecimentos Pedagógicos"],
  [/Lei de Diretrizes e Bases da Educacao \(LDB\)/g, "Lei de Diretrizes e Bases da Educação (LDB)"],
  [/Base Nacional Comum Curricular \(BNCC\)/g, "Base Nacional Comum Curricular (BNCC)"],
  [/Didatica e metodologias de ensino/g, "Didática e metodologias de ensino"],
  [/Avaliacao da aprendizagem/g, "Avaliação da aprendizagem"],
  [/Educacao inclusiva/g, "Educação inclusiva"],
  [/Planejamento educacional/g, "Planejamento educacional"],
  [/Gestao escolar/g, "Gestão escolar"],
  [/Legislacao educacional/g, "Legislação educacional"],

  // Security area
  [/Nocoes de Direito/g, "Noções de Direito"],
  [/Direito Constitucional/g, "Direito Constitucional"],
  [/Direito Administrativo/g, "Direito Administrativo"],
  [/Direito Penal e Processual Penal/g, "Direito Penal e Processual Penal"],
  [/Legislacao especial/g, "Legislação especial"],
  [/Legislacao institucional/g, "Legislação institucional"],

  // General legislation
  [/Legislacao/g, "Legislação"],
  [/Constituicao Federal \(nocoes basicas\)/g, "Constituição Federal (noções básicas)"],
  [/Legislacao municipal\/estadual aplicavel/g, "Legislação municipal/estadual aplicável"],
  [/Estatuto dos servidores/g, "Estatuto dos servidores"],
  [/Lei Organica do Municipio/g, "Lei Orgânica do Município"],

  // Beneficios
  [/Material completo e atualizado conforme edital/g, "Material completo e atualizado conforme edital"],
  [/Teoria objetiva e didatica para estudo eficiente/g, "Teoria objetiva e didática para estudo eficiente"],
  [/Conteudo organizado por disciplina/g, "Conteúdo organizado por disciplina"],
  [/Temas mais cobrados pela banca examinadora/g, "Temas mais cobrados pela banca examinadora"],
  [/Formato digital com acesso imediato apos a compra/g, "Formato digital com acesso imediato após a compra"],
  [/Material revisado por especialistas em concursos/g, "Material revisado por especialistas em concursos"],

  // Publico alvo
  [/com exigencia de nivel superior completo/g, "com exigência de nível superior completo"],
  [/com exigencia de nivel medio completo/g, "com exigência de nível médio completo"],
  [/com exigencia de nivel fundamental completo/g, "com exigência de nível fundamental completo"],

  // FAQ
  [/O acesso e liberado imediatamente apos a confirmacao do pagamento\. Voce recebera as instrucoes por e-mail\./g,
   "O acesso é liberado imediatamente após a confirmação do pagamento. Você receberá as instruções por e-mail."],
  [/o conteudo e elaborado e revisado com base no edital do concurso/g,
   "o conteúdo é elaborado e revisado com base no edital do concurso"],
  [/o material e digital e pode ser acessado por qualquer dispositivo com acesso a internet/g,
   "o material é digital e pode ser acessado por qualquer dispositivo com acesso à internet"],
  [/O material e disponibilizado em formato PDF, organizado por disciplina para facilitar seus estudos/g,
   "O material é disponibilizado em formato PDF, organizado por disciplina para facilitar seus estudos"],
  [/oferecemos garantia de 7 dias corridos apos a compra, conforme o Codigo de Defesa do Consumidor/g,
   "oferecemos garantia de 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor"],
  [/este material foi elaborado especificamente para o cargo de/g,
   "este material foi elaborado especificamente para o cargo de"],
  [/cobrindo todo o conteudo programatico exigido no edital/g,
   "cobrindo todo o conteúdo programático exigido no edital"],

  // SEO
  [/Material atualizado com teoria e exercicios/g, "Material atualizado com teoria e exercícios"],

  // General patterns
  [/\bconteudo\b/g, "conteúdo"],
  [/\bConteudo\b/g, "Conteúdo"],
  [/\bpreparacao\b/g, "preparação"],
  [/\bPreparacao\b/g, "Preparação"],
  [/\baprovacao\b/g, "aprovação"],
  [/\bAprovacao\b/g, "Aprovação"],
  [/\beducacao\b/g, "educação"],
  [/\bEducacao\b/g, "Educação"],
  [/\bsaude\b/g, "saúde"],
  [/\bSaude\b/g, "Saúde"],
  [/\bseguranca\b/g, "segurança"],
  [/\bSeguranca\b/g, "Segurança"],
  [/\borgao\b/g, "órgão"],
  [/\bOrgao\b/g, "Órgão"],
  [/\borgaos\b/g, "órgãos"],
  [/\bOrgaos\b/g, "Órgãos"],
  [/\bnocoes\b/g, "noções"],
  [/\bNocoes\b/g, "Noções"],
  [/\binformacao\b/g, "informação"],
  [/\binformacoes\b/g, "informações"],
  [/\bdidatica\b/g, "didática"],
  [/\bbasica\b/g, "básica"],
  [/\bbasico\b/g, "básico"],
  [/\blogico\b/g, "lógico"],
  [/\bLogico\b/g, "Lógico"],
  [/\bjuridico\b/g, "jurídico"],
  [/\bJuridico\b/g, "Jurídico"],
  [/\btopicos\b/g, "tópicos"],
  [/\bTopicos\b/g, "Tópicos"],
  [/\bcapitulo\b/g, "capítulo"],
  [/\borganizacao\b/g, "organização"],
  [/\bquestoes\b/g, "questões"],
  [/\bexercicios\b/g, "exercícios"],
  [/\bExercicios\b/g, "Exercícios"],
  [/\bvoce\b/g, "você"],
  [/\bVoce\b/g, "Você"],
  [/\bnivel\b/g, "nível"],
  [/\bNivel\b/g, "Nível"],
  [/\bexigencia\b/g, "exigência"],
  [/\bapos\b/g, "após"],
  [/\bconfirmacao\b/g, "confirmação"],
  [/\binstrucoes\b/g, "instruções"],
  [/\bCodigo\b/g, "Código"],
  [/\bprogramatico\b/g, "programático"],
  [/\bProgramatico\b/g, "Programático"],
  [/\bPolicia\b/g, "Polícia"],
  [/\bPrevidencia\b/g, "Previdência"],
  [/\bCamara\b/g, "Câmara"],
  [/\bPreparatoria\b/g, "Preparatória"],
  [/\bExercito\b/g, "Exército"],
  [/\bLegislacao\b/g, "Legislação"],
  [/\bConstituicao\b/g, "Constituição"],
  [/\bOrganica\b/g, "Orgânica"],
  [/\bMunicipio\b/g, "Município"],
  [/\bPedagogicos\b/g, "Pedagógicos"],
  [/\bDidatica\b/g, "Didática"],
  [/\bAvaliacao\b/g, "Avaliação"],
  [/\bGestao\b/g, "Gestão"],
  [/\bSao Paulo\b/g, "São Paulo"],
  [/\bCeara\b/g, "Ceará"],
  [/\bGoias\b/g, "Goiás"],
  [/\bMaranhao\b/g, "Maranhão"],
  [/\bPara\b(?! [a-z])/g, "Pará"],
  [/\bParaiba\b/g, "Paraíba"],
  [/\bParana\b/g, "Paraná"],
  [/\bPiaui\b/g, "Piauí"],
  [/\bRondonia\b/g, "Rondônia"],
  [/\bAmapa\b/g, "Amapá"],
  [/\bEspirito Santo\b/g, "Espírito Santo"],
]

function fixText(text: string): string {
  let result = text
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement)
  }
  // Fix "e " at start of sentences that should be "é "
  result = result.replace(/O acesso e liberado/g, "O acesso é liberado")
  result = result.replace(/o material e digital/g, "o material é digital")
  result = result.replace(/O material e disponibilizado/g, "O material é disponibilizado")
  result = result.replace(/o conteudo e elaborado/g, "o conteúdo é elaborado")
  return result
}

async function main() {
  console.log("Corrigindo acentos nas apostilas do banco de dados...")

  const apostilas = await prisma.apostila.findMany({
    select: {
      id: true,
      titulo: true,
      descricaoCurta: true,
      descricaoLonga: true,
      conteudoProgramatico: true,
      beneficios: true,
      publicoAlvo: true,
      faq: true,
      seoTitle: true,
      seoDescription: true,
    }
  })

  console.log(`Total de apostilas para revisar: ${apostilas.length}`)

  let updated = 0

  for (const a of apostilas) {
    const newTitulo = fixText(a.titulo)
    const newDescCurta = fixText(a.descricaoCurta)
    const newDescLonga = fixText(a.descricaoLonga)
    const newConteudo = a.conteudoProgramatico ? fixText(a.conteudoProgramatico) : null
    const newBeneficios = a.beneficios ? fixText(a.beneficios) : null
    const newPublico = a.publicoAlvo ? fixText(a.publicoAlvo) : null
    const newFaq = a.faq ? fixText(a.faq) : null
    const newSeoTitle = a.seoTitle ? fixText(a.seoTitle) : null
    const newSeoDesc = a.seoDescription ? fixText(a.seoDescription) : null

    const changed =
      newTitulo !== a.titulo ||
      newDescCurta !== a.descricaoCurta ||
      newDescLonga !== a.descricaoLonga ||
      newConteudo !== a.conteudoProgramatico ||
      newBeneficios !== a.beneficios ||
      newPublico !== a.publicoAlvo ||
      newFaq !== a.faq ||
      newSeoTitle !== a.seoTitle ||
      newSeoDesc !== a.seoDescription

    if (changed) {
      await prisma.apostila.update({
        where: { id: a.id },
        data: {
          titulo: newTitulo,
          descricaoCurta: newDescCurta,
          descricaoLonga: newDescLonga,
          conteudoProgramatico: newConteudo,
          beneficios: newBeneficios,
          publicoAlvo: newPublico,
          faq: newFaq,
          seoTitle: newSeoTitle,
          seoDescription: newSeoDesc,
        }
      })
      updated++
      if (updated % 50 === 0) console.log(`  ${updated} apostilas atualizadas...`)
    }
  }

  // Also fix Orgao names
  console.log("\nCorrigindo nomes dos órgãos...")
  const orgaos = await prisma.orgao.findMany()
  let orgaoUpdated = 0
  for (const o of orgaos) {
    const newNome = fixText(o.nome)
    if (newNome !== o.nome) {
      await prisma.orgao.update({ where: { id: o.id }, data: { nome: newNome } })
      orgaoUpdated++
    }
  }

  // Fix Categoria names
  console.log("Corrigindo nomes das categorias...")
  const categorias = await prisma.categoria.findMany()
  let catUpdated = 0
  for (const c of categorias) {
    const newNome = fixText(c.nome)
    const newDesc = c.descricao ? fixText(c.descricao) : null
    const newSeoTitle = c.seoTitle ? fixText(c.seoTitle) : null
    const newSeoDesc = c.seoDescription ? fixText(c.seoDescription) : null
    if (newNome !== c.nome || newDesc !== c.descricao || newSeoTitle !== c.seoTitle || newSeoDesc !== c.seoDescription) {
      await prisma.categoria.update({
        where: { id: c.id },
        data: { nome: newNome, descricao: newDesc, seoTitle: newSeoTitle, seoDescription: newSeoDesc }
      })
      catUpdated++
    }
  }

  console.log(`\nConcluído!`)
  console.log(`Apostilas atualizadas: ${updated}`)
  console.log(`Órgãos atualizados: ${orgaoUpdated}`)
  console.log(`Categorias atualizadas: ${catUpdated}`)
}

main()
  .catch((e) => {
    console.error("Erro:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
