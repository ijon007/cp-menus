import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Core Point Menu",
  description: "Core Point Menu is a menu creation tool for the Core Point clients.",
  icons: {
    icon: "/cp.svg",
    shortcut: "/cp.svg",
    apple: "/cp.svg",
    other: [
      {
        rel: "icon",
        url: "/cp-brown.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        url: "/cp.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "shortcut icon",
        url: "/cp-brown.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "shortcut icon",
        url: "/cp.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" className={poppins.variable}>
        <body
          className={`${poppins.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
