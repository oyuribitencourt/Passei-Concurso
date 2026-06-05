import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { ContatoForm } from "./contato-form";

export const metadata: Metadata = {
  title: "Contato - Passei Concurso",
  description:
    "Entre em contato com a equipe da Passei Concurso. Tire suas dúvidas sobre apostilas, compras e acesso aos materiais.",
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-8 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 sm:h-10 sm:w-10">
                <MessageCircle className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              </div>
              <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Fale Conosco
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 sm:text-4xl sm:mb-3">Contato</h1>
            <p className="text-white/70 text-base sm:text-lg">
              Tem dúvidas, sugestões ou precisa de ajuda? Entre em contato e
              responderemos o mais breve possível.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 bg-gray-50 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* On mobile: form first (above fold), info below */}
          <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-3 lg:gap-10">
            {/* Info column — below form on mobile, left column on desktop */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 text-lg">
                  Informações de contato
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Mail className="h-4 w-4 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                        E-mail
                      </p>
                      <a
                        href="mailto:contato@passeiconcurso.com.br"
                        className="text-sm font-medium text-brand-blue hover:underline"
                      >
                        contato@passeiconcurso.com.br
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-amber-50 p-4 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-800 mb-1">
                    Tempo de resposta
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Respondemos em até 24 horas úteis. Para dúvidas urgentes
                    sobre acesso ao produto, entre em contato pelo e-mail acima.
                  </p>
                </div>
              </div>
            </div>

            {/* Form — first on mobile */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm sm:p-8">
                <ContatoForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
