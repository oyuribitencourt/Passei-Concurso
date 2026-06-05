"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

const subjects = [
  "Dúvida sobre um produto",
  "Problema com acesso",
  "Sugestão de conteúdo",
  "Reclamação",
  "Parceria",
  "Outro",
];

export function ContatoForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // Simulate form submission — integrate with your email provider
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold-light mb-4">
          <CheckCircle2 className="h-8 w-8 text-brand-gold-dark" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Mensagem enviada!
        </h3>
        <p className="text-gray-500 max-w-sm">
          Recebemos sua mensagem. Responderemos em até 24 horas úteis no e-mail
          informado.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ nome: "", email: "", assunto: "", mensagem: "" });
          }}
          className="mt-6 text-sm font-medium text-brand-blue hover:underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Envie sua mensagem
      </h2>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Ocorreu um erro. Tente novamente ou envie um e-mail diretamente.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nome"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 min-h-[44px]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 min-h-[44px]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="assunto"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Assunto <span className="text-red-500">*</span>
        </label>
        <select
          id="assunto"
          name="assunto"
          required
          value={form.assunto}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 min-h-[44px]"
        >
          <option value="">Selecione um assunto</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="mensagem"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Mensagem <span className="text-red-500">*</span>
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={5}
          value={form.mensagem}
          onChange={handleChange}
          placeholder="Descreva sua dúvida ou mensagem com o máximo de detalhes possível..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 resize-none"
        />
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-400">
          Campos marcados com <span className="text-red-500">*</span> são
          obrigatórios
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-8 min-h-[48px] text-sm font-bold text-white shadow-md shadow-amber-900/15 transition-all hover:bg-brand-gold-dark disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 sm:w-auto"
        >
          {status === "loading" ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enviando...
            </>
          ) : (
            "Enviar mensagem"
          )}
        </button>
      </div>
    </form>
  );
}
