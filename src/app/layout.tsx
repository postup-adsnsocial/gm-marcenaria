import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "../index.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "G&M Móveis | Móveis Planejados",
  description: "Marcenaria de alto padrão para projetos exclusivos. Há mais de três décadas criando móveis sob medida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} scroll-smooth hide-scrollbar`}>
      <body className="font-sans bg-primary text-secondary antialiased selection:bg-accent/30 selection:text-secondary hide-scrollbar">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
