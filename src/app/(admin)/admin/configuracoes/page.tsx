import { Settings, Construction } from "lucide-react"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500">Configurações gerais da plataforma</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Construction className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700">Em desenvolvimento</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            As configurações gerais da plataforma estão sendo desenvolvidas.
            Em breve você poderá gerenciar as configurações do sistema por aqui.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Nome da plataforma", valor: "Passei Concurso", placeholder: true },
            { label: "Email de contato", valor: "contato@passeiconcurso.com.br", placeholder: true },
            { label: "Domínio", valor: "passeiconcurso.com.br", placeholder: true },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{item.valor}</p>
              {item.placeholder && (
                <p className="mt-0.5 text-[10px] text-slate-400">Configurável em breve</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Settings className="h-4 w-4" />
          Ações do Sistema
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Limpar cache", descricao: "Remove o cache de páginas públicas" },
            { label: "Reindexar busca", descricao: "Reconstrói os índices de busca" },
            { label: "Exportar dados", descricao: "Exporta apostilas em CSV" },
          ].map((action) => (
            <button
              key={action.label}
              disabled
              className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <p className="text-sm font-medium text-slate-800">{action.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{action.descricao}</p>
              <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Em breve
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
