import {
  Star,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";

export function SocialProofBar() {
  return (
    <section className="border-b-2 border-[#D4A017]/20 bg-gradient-to-r from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="hidden sm:flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A1D3B]">
              <TrendingUp className="h-4 w-4 text-[#D4A017]" />
            </div>
            <div>
              <p className="text-base font-extrabold text-[#0A1D3B] sm:text-lg">+2.500</p>
              <p className="text-[10px] leading-tight text-gray-400 sm:text-[11px]">Vendidas</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="hidden sm:flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A1D3B]">
              <Award className="h-4 w-4 text-[#D4A017]" />
            </div>
            <div>
              <p className="text-base font-extrabold text-[#0A1D3B] sm:text-lg">94,7%</p>
              <p className="text-[10px] leading-tight text-gray-400 sm:text-[11px]">Aprovação</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="hidden sm:flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A1D3B]">
              <Users className="h-4 w-4 text-[#D4A017]" />
            </div>
            <div>
              <p className="text-base font-extrabold text-[#0A1D3B] sm:text-lg">+15 mil</p>
              <p className="text-[10px] leading-tight text-gray-400 sm:text-[11px]">Alunos</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3 sm:text-left">
            <div className="hidden sm:flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#0A1D3B]">
              <Star className="h-4 w-4 text-[#D4A017]" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 sm:justify-start">
                <p className="text-base font-extrabold text-[#0A1D3B] sm:text-lg">4.9</p>
                <Star className="h-3 w-3 fill-[#D4A017] text-[#D4A017]" />
              </div>
              <p className="text-[10px] leading-tight text-gray-400 sm:text-[11px]">Avaliação</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Mariana S.",
    role: "Aprovada - Téc. Judiciário TRT",
    text: "Estudei por apenas 4 meses com a apostila e fui aprovada em 12º lugar na minha primeira tentativa. O material vai direto ao ponto, sem enrolação. Cada capítulo cobre exatamente o que a banca cobra.",
  },
  {
    name: "Carlos R.",
    role: "Aprovado - Analista INSS",
    text: "Já tinha reprovado 2 vezes usando materiais genéricos de internet. Com a apostila da Passei Concurso, finalmente entendi o que a banca realmente cobra. Fui aprovado na terceira tentativa, dessa vez com folga.",
  },
  {
    name: "Fernanda L.",
    role: "Aprovada - Escrivã PC",
    text: "Conciliei os estudos com meu trabalho de 8h por dia e mesmo assim consegui a aprovação em 6 meses. A apostila é organizada de um jeito que facilita quem tem pouco tempo. Valeu cada centavo investido.",
  },
  {
    name: "Ricardo M.",
    role: "Aprovado - Auditor Receita Federal",
    text: "Gastei anos e milhares de reais em cursinhos caros que nunca iam ao ponto. Quando descobri a Passei Concurso, percebi que o problema não era eu, era o material. Em 8 meses de estudo focado, conquistei minha vaga de Auditor.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#0A1D3B] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 px-3 py-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-[#D4A017] text-[#D4A017]" />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#D4A017]">4.9/5</span>
          </div>
          <h2 className="text-lg font-bold text-white sm:text-2xl">
            +2.500 alunos já conquistaram a aprovação
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Veja o que eles têm a dizer
          </p>
        </div>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 scrollbar-none sm:mx-0 sm:px-0 sm:pb-0 sm:gap-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="min-w-[85vw] max-w-[320px] flex-shrink-0 snap-center rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm sm:min-w-0 sm:max-w-none sm:flex-shrink sm:snap-start"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#D4A017] text-[#D4A017]" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3 text-[#22c55e]" />
                  <span className="text-[9px] font-medium text-[#22c55e] sm:text-[10px]">Verificada</span>
                </span>
              </div>
              <p className="mb-3 text-[13px] leading-relaxed text-white/75 sm:text-sm sm:mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A017] text-[11px] font-bold text-[#0A1D3B] sm:h-9 sm:w-9 sm:text-xs">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className="text-[11px] text-white/45 truncate">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
