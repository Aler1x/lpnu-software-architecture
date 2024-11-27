import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import "./globals.css";
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mermaid Diagram Editor',
  description: 'Create and edit Mermaid diagrams online',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={cn("min-h-screen flex flex-col", inter.className)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
