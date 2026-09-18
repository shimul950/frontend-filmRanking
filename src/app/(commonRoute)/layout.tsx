import Navbar from "../../../components/shared/navbar/Navbar";
import { Footer } from "../../../components/shared/footer/Footer";

export default function commonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
