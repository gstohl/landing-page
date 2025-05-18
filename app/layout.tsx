import "@/styles/globals.css"
import { Inter, Orbitron } from 'next/font/google'
import { Metadata } from 'next'
import ClientThreeSceneWrapper from '@/components/ClientThreeSceneWrapper'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: {
    default: "Dominik Gstöhl | Personal Portfolio",
    template: "%s | Dominik Gstöhl"
  },
  description: "Welcome to my personal portfolio. I'm Dominik Gstöhl, a software developer passionate about creating innovative solutions and delivering high-quality code.",
  keywords: ["Dominik Gstöhl", "software developer", "web development", "portfolio", "full-stack developer"],
  authors: [{ name: "Dominik Gstöhl" }],
  creator: "Dominik Gstöhl",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gstohl.com",
    title: "Dominik Gstöhl | Personal Portfolio",
    description: "Welcome to my personal portfolio. I'm Dominik Gstöhl, a software developer passionate about creating innovative solutions and delivering high-quality code.",
    siteName: "Dominik Gstöhl Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Dominik Gstöhl | Personal Portfolio",
    description: "Welcome to my personal portfolio. I'm Dominik Gstöhl, a software developer passionate about creating innovative solutions and delivering high-quality code."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased bg-black text-white min-h-screen`}>
        <ClientThreeSceneWrapper>
          {children}
        </ClientThreeSceneWrapper>
      </body>
    </html>
  )
}

