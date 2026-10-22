import StoreNavbar from "@/components/layout/StoreNavbar";
import StoreFooter from "@/components/layout/StoreFooter";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF6]">
      <StoreNavbar />
      {/* pt-28 untuk memberi ruang bagi floating navbar sesuai ui.md §5 */}
      <main className="flex-1 pt-24 sm:pt-28">
        {children}
      </main>
      <StoreFooter />
    </div>
  );
}

