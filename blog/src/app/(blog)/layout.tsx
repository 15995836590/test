import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
