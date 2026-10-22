import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Toaster } from "react-hot-toast";

/**
 * Plus Jakarta Sans — variable font, self-hosted via @fontsource-variable.
 * Diekspos sebagai CSS variable --font-plus-jakarta-sans, dipetakan ke
 * --font-sans di globals.css @theme (ui.md §4).
 */
const plusJakartaSans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
      style: "normal",
    },
  ],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tokomu — Toko Sepatu Online",
    template: "%s | Tokomu",
  },
  description:
    "Tokomu menghadirkan koleksi sepatu pilihan — sneakers, casual, running, hingga formal. Kualitas terbaik, harga terjangkau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        {children}
        {/* Notifikasi global — react-hot-toast (ui.md §12 Toast) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#fff",
              border: "1px solid #EAE5D9",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "#111827",
            },
          }}
        />
      </body>
    </html>
  );
}
