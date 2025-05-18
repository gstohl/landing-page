"use client"

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import ThreeSceneProvider dynamically client-side only
const ThreeSceneProvider = dynamic(
  () => import('./ThreeSceneProvider').then(mod => mod.ThreeSceneProvider),
  { 
    ssr: false,
    loading: () => <div className="fixed top-0 left-0 w-screen h-screen bg-black"></div>
  }
)

export default function ClientThreeSceneWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <Suspense fallback={<div className="fixed top-0 left-0 w-screen h-screen bg-black"></div>}>
      <ThreeSceneProvider>{children}</ThreeSceneProvider>
    </Suspense>
  )
} 