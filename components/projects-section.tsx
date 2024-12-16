import { ProjectCard } from "./project-card"

export function ProjectsSection() {
  return (
    <section id="projects" className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Projects</h2>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
        <ProjectCard
          title="Personal Portfolio Website"
          type="web"
          releaseDate={new Date("2024-12-16 12:00:00")}
          description="Modern, responsive portfolio built with Next.js and shadcn/ui"
          content="A sleek, single-page portfolio website showcasing my skills and expertise. Features dark mode support, smooth scrolling, and a clean, professional design."
          githubUrl="https://github.com/gstohl/landing-page"
        />
        <ProjectCard
          title="Vanity Address"
          type="mobile"
          description="macOS app for generating Solana vanity addresses"
          content="A powerful and user-friendly macOS application that allows users to generate custom Solana wallet addresses. Built with Swift and integrating Solana's cryptographic libraries for secure and efficient address generation."
        />
      </div>
    </section>
  )
}

