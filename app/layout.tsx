import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ProgressBar } from "@/components/shared/Loading";
import { ToastProvider } from "@/components/shared/Toast";
import { DebugPageStructureLoader } from "@/components/shared/DebugPageStructureLoader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EntranceGateway",
  description: "Your gateway to academic success",
  icons: {
    icon: '/eg-logo.jpg',
    shortcut: '/eg-logo.jpg',
    apple: '/eg-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* PWA - Android */}
        <meta name="theme-color" content="#1A237E" />
        <link rel="manifest" href="/manifest.json" />

        {/* PWA - iOS (Safari ignores manifest.json entirely) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EG" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />

        {/* KaTeX — LaTeX math rendering for quiz questions */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        <ToastProvider>
          <DebugPageStructureLoader />
          <ProgressBar />
          <ConditionalLayout>{children}</ConditionalLayout>
        </ToastProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
