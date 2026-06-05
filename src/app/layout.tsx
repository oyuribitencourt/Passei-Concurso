import type { Metadata } from "next";
import { TrackingScripts } from "@/components/tracking-scripts";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Passei Concurso - Sua aprovação começa aqui",
    template: "%s | Passei Concurso",
  },
  description:
    "Encontre apostilas organizadas e atualizadas para concursos públicos. Materiais por órgão, banca, estado e cargo para acelerar sua preparação.",
  keywords: [
    "apostila concurso publico",
    "material concurso",
    "preparação concurso",
    "apostila pdf",
    "concurso publico 2025",
  ],
  authors: [{ name: "Passei Concurso" }],
  creator: "Passei Concurso",
  publisher: "Passei Concurso",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://passeiconcurso.com.br"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Passei Concurso",
    title: "Passei Concurso - Sua aprovação começa aqui",
    description:
      "Encontre apostilas organizadas e atualizadas para concursos públicos.",
    images: ["/images/logo-fundo-claro.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Passei Concurso",
    description:
      "Encontre apostilas organizadas e atualizadas para concursos públicos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}
