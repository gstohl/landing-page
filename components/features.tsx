import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeIcon, GlobeIcon, LightbulbIcon } from 'lucide-react'

export function Features() {
  return (
    <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Bringing your ideas to life with modern web technologies
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <Card>
          <CardHeader>
            <CodeIcon className="h-14 w-14" />
            <CardTitle>Clean Code</CardTitle>
            <CardDescription>
              Writing maintainable and scalable code following best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Expertise in React, TypeScript, and modern web frameworks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <GlobeIcon className="h-14 w-14" />
            <CardTitle>Responsive Design</CardTitle>
            <CardDescription>
              Creating beautiful interfaces that work on any device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Mobile-first approach with modern CSS and tailored user experiences</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <LightbulbIcon className="h-14 w-14" />
            <CardTitle>Innovation</CardTitle>
            <CardDescription>
              Staying ahead with the latest web technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Implementing cutting-edge solutions for modern web applications</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

