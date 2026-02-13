import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ServiceWorkerLoader from "@/components/ServiceWorkerLoader";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Cedewise - Reinsurance Platform",
  description: "A modern platform for insurance and reinsurance professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} h-full`} suppressHydrationWarning>
        <UserProvider>
          <NotificationProvider>
            <ServiceWorkerLoader />
            {children}
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
