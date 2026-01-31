import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { ProgressBar } from "@/components/shared/Loading";
import { ToastProvider } from "@/components/shared/Toast";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        <ToastProvider>
          <ProgressBar />
          <ConditionalLayout>{children}</ConditionalLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
