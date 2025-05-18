import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Privacy Policy | Vanity Address",
  description: "Privacy policy for the Vanity Address Solana address generator app",
  icons: {
    icon: '/V512.png',
    apple: '/V512.png'
  }
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
} 