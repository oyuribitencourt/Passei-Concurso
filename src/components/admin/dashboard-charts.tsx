"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"

interface ApostilaPorCategoria {
  categoria: string
  total: number
}

interface OportunidadePorDia {
  data: string
  total: number
}

interface DashboardChartsProps {
  apostilasPorCategoria: ApostilaPorCategoria[]
  oportunidadesPorDia: OportunidadePorDia[]
}

export function DashboardCharts({
  apostilasPorCategoria,
  oportunidadesPorDia,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Bar chart: apostilas por categoria */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">
          Apostilas por Categoria
        </h3>
        {apostilasPorCategoria.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-slate-400">
            Nenhum dado disponível.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={apostilasPorCategoria}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="categoria"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} name="Apostilas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Line chart: oportunidades detectadas ao longo do tempo */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">
          Oportunidades Detectadas (últimos 30 dias)
        </h3>
        {oportunidadesPorDia.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-slate-400">
            Nenhum dado disponível.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={oportunidadesPorDia}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="data"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2563eb" }}
                activeDot={{ r: 5 }}
                name="Oportunidades"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
