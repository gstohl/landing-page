"use client"

import dynamic from 'next/dynamic'

// Dynamically import the CyberpunkLanding component with no SSR
// This is necessary for Three.js which requires browser APIs
const CyberpunkLanding = dynamic(
  () => import('../../../components/CyberpunkLanding').then(mod => ({ default: mod.CyberpunkLanding })),
  { ssr: false }
)

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen">
      <CyberpunkLanding />
    </main>
  )
} 