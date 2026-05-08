import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Three.js Course — Dashboard de Estudos",
  description: "Dashboard pessoal de estudos do curso completo de Three.js: do zero ao avançado com WebGL, shaders, física e performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
