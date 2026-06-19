import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyLENS: MALAYSIA UNSEEN 2026 | Malaysia Through Young Visionaries",
  description:
    "MyLENS: MALAYSIA UNSEEN 2026 is a nationwide youth tourism content competition supported by Tourism Malaysia. Students from 75 schools across every state and territory create 45-second videos showcasing Malaysia's hidden gems.",
  keywords: [
    "MyLENS 2026",
    "Malaysia tourism",
    "hidden gems Malaysia",
    "youth content competition",
    "Tourism Malaysia",
    "Malaysia Unseen",
    "young visionaries",
    "Malaysian schools",
    "short video competition",
  ],
  openGraph: {
    title: "MyLENS: MALAYSIA UNSEEN 2026",
    description: "Malaysia Through Young Visionaries — A nationwide youth tourism content creation competition.",
    type: "website",
    locale: "en_MY",
    siteName: "MyLENS: MALAYSIA UNSEEN 2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLENS: MALAYSIA UNSEEN 2026",
    description: "Malaysia Through Young Visionaries — Discover Malaysia's hidden gems through young creators.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased font-sans text-zinc-600">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
