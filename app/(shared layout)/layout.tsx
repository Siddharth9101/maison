import { Footer } from "@/components/web/footer";
import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
