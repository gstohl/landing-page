import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GithubIcon, Globe, AppleIcon as AppStore, Calendar, Code, Smartphone, ComputerIcon as Desktop, Server, Cog } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  description: string
  content: string
  releaseDate?: Date
  githubUrl?: string
  pageUrl?: string
  appStoreUrl?: string
  type: 'web' | 'mobile' | 'desktop' | 'backend' | 'real'
}

function getTimeAgo(date?: Date) {
  if (!date) return 'Unknown'
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInDays = Math.floor(diffInSeconds / 86400)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInYears > 0) return `${diffInYears}y`
  if (diffInMonths > 0) return `${diffInMonths}m`
  return `${diffInDays}d`
}

function getProjectIcon(type: 'web' | 'mobile' | 'desktop' | 'backend' | 'real') {
  switch (type) {
    case 'web':
      return <Globe className="h-4 w-4" />
    case 'mobile':
      return <Smartphone className="h-4 w-4" />
    case 'desktop':
      return <Desktop className="h-4 w-4" />
    case 'backend':
      return <Server className="h-4 w-4" />
    case 'real':
      return <Cog className="h-4 w-4" />
    default:
      return <Code className="h-4 w-4" />
  }
}

export function ProjectCard({ title, description, content, releaseDate, githubUrl, pageUrl, appStoreUrl, type }: ProjectCardProps) {
  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-300 hover:shadow-md"
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {releaseDate && (
              <Badge 
                variant="secondary" 
                className="flex items-center whitespace-nowrap text-xs px-2 py-1"
              >
                <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
                <span>{getTimeAgo(releaseDate)}</span>
              </Badge>
            )}
            <div className="flex-shrink-0">
              {getProjectIcon(type)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm leading-relaxed">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${title} on GitHub`}>
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}
        {pageUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={pageUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${title} website`}>
              <Globe className="mr-2 h-4 w-4" />
              Visit
            </a>
          </Button>
        )}
        {appStoreUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" aria-label={`Download ${title} from App Store`}>
              <AppStore className="mr-2 h-4 w-4" />
              App Store
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

