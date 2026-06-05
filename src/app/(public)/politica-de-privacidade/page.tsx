import type { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade - Passei Concurso",
  description:
    "Leia a Política de Privacidade da Passei Concurso e saiba como coletamos, usamos e protegemos seus dados pessoais.",
  robots: { index: true, follow: false },
};

const sections = [
  {
    title: "1. Quem somos",
    content: `A Passei Concurso é uma plataforma de venda de apostilas e materiais de estudo para concursos públicos. Ao utilizar nossos serviços, você confia seus dados a nós, e é nossa responsabilidade protegê-los e usá-los de forma ética e transparente.`,
  },
  {
    title: "2. Quais dados coletamos",
    content: `Podemos coletar as seguintes informações:\n\n- Nome e e-mail fornecidos em formulários de contato;\n- Dados de navegação (páginas visitadas, tempo de sessão) via cookies anônimos;\n- Informações de compra processadas pela plataforma Ticto (não armazenamos dados de cartão de crédito diretamente);\n- Endereço IP para fins de segurança e prevenção de fraudes.`,
  },
  {
    title: "3. Como usamos seus dados",
    content: `Usamos suas informações para:\n\n- Processar e confirmar pedidos de compra;\n- Enviar o material adquirido e comunicações relacionadas ao pedido;\n- Responder a mensagens enviadas pelo formulário de contato;\n- Melhorar a experiência do usuário na plataforma;\n- Cumprir obrigações legais.`,
  },
  {
    title: "4. Compartilhamento de dados",
    content: `Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. Podemos compartilhar informações com:\n\n- Processadores de pagamento (Ticto) para concluir transações;\n- Prestadores de serviço de infraestrutura e hospedagem;\n- Autoridades competentes, quando exigido por lei.`,
  },
  {
    title: "5. Cookies",
    content: `Utilizamos cookies para melhorar a experiência de navegação, lembrar preferências e analisar o tráfego de forma anônima. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar o funcionamento de partes do site.`,
  },
  {
    title: "6. Segurança",
    content: `Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. As transações financeiras são realizadas em ambiente criptografado (SSL/HTTPS).`,
  },
  {
    title: "7. Seus direitos (LGPD)",
    content: `De acordo com a Lei Geral de Proteção de Dados (Lei n. 13.709/2018), você tem direito a:\n\n- Confirmar a existência de tratamento dos seus dados;\n- Acessar os dados que mantemos sobre você;\n- Corrigir dados incompletos, inexatos ou desatualizados;\n- Solicitar a exclusão dos seus dados (quando não houver obrigação legal de retenção);\n- Revogar o consentimento a qualquer momento.\n\nPara exercer esses direitos, entre em contato pelo e-mail: contato@passeiconcurso.com.br`,
  },
  {
    title: "8. Retenção de dados",
    content: `Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política, incluindo o cumprimento de obrigações legais e fiscais, geralmente por um período de até 5 anos após o encerramento da relação comercial.`,
  },
  {
    title: "9. Links externos",
    content: `Nosso site pode conter links para sites de terceiros (como plataformas de pagamento ou editais oficiais). Não somos responsáveis pelas práticas de privacidade desses sites.`,
  },
  {
    title: "10. Alterações nesta política",
    content: `Esta política pode ser atualizada periodicamente. Recomendamos que você a revise regularmente. A data da última atualização está indicada ao final do documento.`,
  },
  {
    title: "11. Contato",
    content: `Para dúvidas, solicitações ou exercício dos seus direitos relacionados à privacidade, entre em contato:\n\nE-mail: contato@passeiconcurso.com.br`,
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Shield className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Política de Privacidade
          </h1>
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
              A sua privacidade é importante para nós. Esta Política de
              Privacidade explica como a Passei Concurso coleta, usa, armazena
              e protege as informações que você nos fornece ao utilizar nossos
              serviços.
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
