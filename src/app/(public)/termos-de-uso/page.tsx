import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso - Passei Concurso",
  description:
    "Leia os Termos de Uso da Passei Concurso. Condições para utilização da plataforma e aquisição de materiais de estudo.",
  robots: { index: true, follow: false },
};

const sections = [
  {
    title: "1. Aceitação dos termos",
    content: `Ao acessar e utilizar a plataforma Passei Concurso, você concorda com os presentes Termos de Uso. Se não concordar com quaisquer das disposições aqui estabelecidas, não utilize nossos serviços.`,
  },
  {
    title: "2. Sobre a plataforma",
    content: `A Passei Concurso é uma plataforma de comercialização de apostilas e materiais de estudo digitais para concursos públicos. Atuamos como intermediários entre produtores de conteúdo e candidatos que buscam se preparar para concursos públicos brasileiros.`,
  },
  {
    title: "3. Cadastro e acesso",
    content: `Para adquirir produtos na plataforma, pode ser necessário informar dados pessoais como nome e e-mail. Você é responsável pela veracidade das informações fornecidas e pela guarda das suas credenciais de acesso. Não compartilhe seus dados de acesso com terceiros.`,
  },
  {
    title: "4. Compra e pagamento",
    content: `As compras realizadas na plataforma são processadas por meio da plataforma Ticto, um serviço de pagamento terceirizado e seguro. Os preços exibidos são em Reais (BRL) e podem ser alterados sem aviso prévio. O processamento do pagamento é de responsabilidade da Ticto, conforme seus próprios termos de serviço.`,
  },
  {
    title: "5. Acesso ao material",
    content: `Após a confirmação do pagamento, o acesso ao material adquirido será disponibilizado conforme as instruções enviadas ao e-mail cadastrado. O acesso é pessoal e intransferível. É vedado compartilhar, redistribuir, revender ou reproduzir o material em qualquer forma sem autorização expressa.`,
  },
  {
    title: "6. Propriedade intelectual",
    content: `Todo o conteúdo disponibilizado na plataforma — incluindo apostilas, textos, gráficos e organização do material — é protegido por direitos autorais. A aquisição de um produto concede ao comprador uma licença de uso pessoal e não exclusiva. É expressamente proibido:\n\n- Compartilhar, redistribuir ou revender o material;\n- Reproduzir, copiar ou adaptar o conteúdo para fins comerciais;\n- Remover marcas d'água ou identificações de autoria.`,
  },
  {
    title: "7. Política de reembolso e cancelamento",
    content: `Em conformidade com o Código de Defesa do Consumidor (Lei n. 8.078/1990) e o Decreto n. 7.962/2013, o comprador tem o direito de se arrepender da compra no prazo de 7 (sete) dias corridos a partir da data de aquisição, mediante solicitação formal ao nosso suporte.\n\nPara solicitar o reembolso, entre em contato pelo e-mail: contato@passeiconcurso.com.br\n\nO reembolso será processado pela plataforma de pagamento em até 7 dias úteis.`,
  },
  {
    title: "8. Limitação de responsabilidade",
    content: `A Passei Concurso não garante que os materiais disponibilizados assegurem a aprovação em qualquer concurso público. O conteúdo das apostilas é elaborado com base nas informações públicas disponíveis (editais, programas oficiais) e pode não refletir alterações de última hora nos editais.\n\nNão nos responsabilizamos por:\n\n- Eventual desatualização de conteúdo após mudanças em editais;\n- Interrupções no serviço por motivos técnicos fora do nosso controle;\n- Danos decorrentes do uso inadequado do material.`,
  },
  {
    title: "9. Conduta do usuário",
    content: `É proibido utilizar a plataforma para:\n\n- Qualquer finalidade ilegal ou não autorizada;\n- Infringir direitos de propriedade intelectual;\n- Transmitir conteúdo prejudicial, ofensivo ou ilícito;\n- Tentar acessar áreas restritas do sistema sem autorização.`,
  },
  {
    title: "10. Modificações",
    content: `Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após a publicação na plataforma. O uso continuado dos serviços após as alterações implica aceitação dos novos termos.`,
  },
  {
    title: "11. Lei aplicável e foro",
    content: `Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes termos, ressalvada a competência de foros de consumidor prevista em lei.`,
  },
  {
    title: "12. Contato",
    content: `Para dúvidas sobre estes Termos de Uso, entre em contato:\n\nE-mail: contato@passeiconcurso.com.br`,
  },
];

export default function TermosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Termos de Uso</h1>
          <p className="text-white/70">
            Última atualização: janeiro de 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <p className="text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-100">
              Por favor, leia atentamente estes Termos de Uso antes de utilizar
              a plataforma Passei Concurso. Estes termos estabelecem as regras
              e condições para utilização dos nossos serviços.
            </p>

            <div className="flex flex-col gap-8">
              {sections.map((section, i) => (
                <div key={i}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
