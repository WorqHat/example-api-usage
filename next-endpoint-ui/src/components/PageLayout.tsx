import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-[#050A30] to-black text-white">
      <SiteHeader />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}

