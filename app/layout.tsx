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

// Runs synchronously before first paint: hides the page while the brand intro
// is about to mount, so there is no flash of content. The Intro component
// removes the class on mount; the timeout is a failsafe if hydration stalls.
const introGuard =
  "try{if(!sessionStorage.getItem('px-intro-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('px-intro-pending');setTimeout(function(){document.documentElement.classList.remove('px-intro-pending')},4000)}}catch(e){}";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans bg-noche text-hueso`}>
        <script dangerouslySetInnerHTML={{ __html: introGuard }} />
        {children}
      </body>
    </html>
  );
}
