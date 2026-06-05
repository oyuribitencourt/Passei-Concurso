import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
}
