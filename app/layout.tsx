import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminProvider from '@/components/AdminProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chalet",
  description: "Bienvenue dans ce magnifique chalet dans le Jura",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookies().get(name)?.value ?? null,
        set: (name, value, options) => cookies().set({ name, value, ...options }),
        remove: (name) => cookies().delete(name),
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const isConnected = Boolean(session?.user);

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main>
          <AdminProvider isAdmin={isConnected}>
            {children}
          </AdminProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
