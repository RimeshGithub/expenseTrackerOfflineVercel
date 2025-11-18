"use client"

import type React from "react"
import { useEffect } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { useFirebaseSync } from "@/hooks/use-firebase-sync"
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"
import { AuthProvider } from '@/lib/auth-context'
import { storage } from "@/lib/storage"
import { Network } from '@capacitor/network'
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const {
    user,
    setupAuthListener,
    loading: authLoading,
    error: authError,
  } = useFirebaseAuth()

  const { syncData } = useFirebaseSync(user?.uid || null)

  // Setup auth listener on mount
  useEffect(() => {
    const unsubscribe = setupAuthListener()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [setupAuthListener])

  useEffect(() => {
    const unsubscribe = storage.onChange(async () => {
      const status = await Network.getStatus()

      if (storage.getData().settings.autoSync && status.connected) {
        syncData()
      }
    })

    return unsubscribe
  }, [syncData, user])

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
