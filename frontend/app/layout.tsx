import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import NavbarWrapper from "./components/NavbarWrapper"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "HackMatrix Medical",
  description: "Friendly AI-powered clinical workspace",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >

        <NavbarWrapper />

        <main className="flex-1 w-full pt-28 pb-12">
          {children}
        </main>

      </body>
    </html>
  )
}