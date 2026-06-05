import { ShieldCheck, Zap, RefreshCw, Lock } from "lucide-react";

const badges = [
  {
    icon: RefreshCw,
    label: "Materiais Atualizados",
    description: "Conteúdo revisado regularmente",
  },
  {
    icon: Zap,
    label: "Acesso Imediato",
    description: "Disponível após a compra",
  },
  {
    icon: Lock,
    label: "Compra Segura",
    description: "Pagamento criptografado",
  },
  {
    icon: ShieldCheck,
    label: "Conteúdo Verificado",
    description: "Revisado por especialistas",
  },
];

interface TrustBadgesProps {
  variant?: "light" | "dark";
  showDescription?: boolean;
}

export function TrustBadges({
  variant = "light",
  showDescription = false,
}: TrustBadgesProps) {
  const isDark = variant === "dark";

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 md:gap-8">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className={`flex items-center gap-2 min-w-0 ${isDark ? "text-white/90" : "text-gray-600"}`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                isDark ? "bg-brand-gold/20" : "bg-brand-gold-light"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isDark ? "text-brand-gold" : "text-brand-gold-dark"}`}
              />
            </div>
            <div className="min-w-0">
              <span
                className={`block text-sm font-medium leading-tight ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {badge.label}
              </span>
              {showDescription && (
                <p
                  className={`text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}
                >
                  {badge.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
