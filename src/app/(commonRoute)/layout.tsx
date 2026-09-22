import Navbar from "../../../components/shared/navbar/Navbar";
import { Footer } from "../../../components/shared/footer/Footer";

export default function commonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
