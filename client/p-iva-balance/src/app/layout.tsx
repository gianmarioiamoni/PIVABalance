import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
import { QueryProvider } from "../providers/QueryProvider";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P.IVA Balance - Gestione Fiscale per Partite IVA",
  description: "Soluzione completa per la gestione fiscale di partite IVA: fatturazione, gestione costi, calcoli fiscali e reporting per regime forfettario e ordinario.",
  keywords: ["P.IVA", "gestione fiscale", "fatturazione", "regime forfettario", "regime ordinario", "partita IVA"],
  authors: [{ name: "P.IVA Balance Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
