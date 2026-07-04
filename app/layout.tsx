import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Pulsimus · El corazón digital de tu negocio",
  description:
    "Agencia web para negocios de barrio. Webs donde tus clientes piden fácil y vos ves todo ordenado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans bg-hueso text-noche`}>
        {children}
      </body>
    </html>
  );
}
