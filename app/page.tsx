"use client"

import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { useSmoothScroll } from "./smooth-scroll"

export default function Home() {
  useSmoothScroll()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  )
}

