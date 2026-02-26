import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Font Serif buat Judul (Elegan & Profesional)
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair' 
});

// Font Sans-serif buat Teks biasa (Bersih & Mudah dibaca)
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata = {
  title: "Mantri Hewan Bapak",
  description: "Layanan medis hewan terpercaya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Tambahkan variabel font ke tag html
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-orange-50">{children}</body>
    </html>
  );
}