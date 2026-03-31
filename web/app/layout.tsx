import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  colors: {
    arcade: [
      "#1A1A2E",
      "#16213E",
      "#0F3460",
      "#FF006E",
      "#00D9FF",
      "#FFD500",
      "#00FF41",
      "#2E2242",
      "#D91E63",
      "#00BCD4",
    ],
  },
  primaryColor: "arcade",
  defaultRadius: "md",
  fontFamily: "var(--font-geist-sans)",
});

export const metadata: Metadata = {
  title: "Gerenciador de Fliperama",
  description: "Sistema de gestao de fliperamas com entrada por cartao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className="min-h-full flex flex-col">
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
