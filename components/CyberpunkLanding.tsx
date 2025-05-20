import React, { useState, useEffect } from 'react'
import { useThreeScene } from './ThreeSceneProvider'
import Link from 'next/link'
import Image from 'next/image'

// Project interface for type safety
interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  appStoreUrl?: string;
  githubUrl?: string;
  image?: string;
  privacyPolicyUrl?: string;
  releaseDate?: string;
}

// Projects data
const projects: Project[] = [
  {
    id: 'vanity',
    name: 'Vanity Address',
    description: 'A high-performance Solana vanity address generator for macOS. Create personalized wallet addresses with custom prefixes or patterns to make your wallet more recognizable and unique.',
    technologies: ['Rust', 'Swift', 'Solana'],
    appStoreUrl: 'https://apps.apple.com/ch/app/vanity-address/id6745989622',
    image: '/V512.png',
    privacyPolicyUrl: '/vanity/privacy',
    releaseDate: 'May 2025'
  }
];

// Privacy policy content for Vanity
const vanityPrivacyPolicy = `
# Privacy Policy for Vanity Address

**Last Updated: May 2025**

## Introduction

Vanity is a Solana wallet application designed for generating and managing vanity Solana blockchain addresses. This privacy policy explains how Vanity handles your data.

## Our Commitment to Privacy

Vanity is designed with privacy and security as its core principles. We do not collect, store, or transmit your personal information or wallet data to any external servers.

## Data We Collect

### We DO NOT collect:
- Personal information
- Solana wallet addresses
- Private keys or mnemonic phrases
- Transaction history
- Usage statistics
- Analytics data
- Location data

### Data stored locally on your device:
- Wallet information (Solana public addresses, encrypted private keys, and encrypted mnemonic phrases)
- Application preferences

## How Your Data is Stored

- **Local Storage Only**: All data is stored exclusively on your device in encrypted format
- **Biometric Protection**: Access to sensitive wallet information requires biometric authentication (Face ID/Touch ID) or device passcode
- **Encryption**: Private keys and mnemonic phrases are encrypted using industry-standard AES-GCM encryption
- **Authentication-Based Encryption**: The encryption keys are derived from successful authentication, ensuring data cannot be decrypted without proper authorization

## Data Sharing and Third Parties

- We do not share any of your data with third parties
- We do not use any analytics services or tracking tools
- The app does not connect to any servers or cloud services

## Export and Backup

- The app allows you to export your wallet data in encrypted or CSV format
- Exported files are your responsibility once they leave the application
- We recommend storing exported files securely and using strong, unique passwords for encrypted exports

## Your Rights

Since all data is stored locally on your device and we do not collect any personal information:

- You maintain full control over your data
- You can delete all data by removing the application or using the delete functions within the app

## Changes to This Privacy Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date.

## Contact

If you have any questions or concerns about this privacy policy, please contact us at:

dominik.gstoehl@icloud.com

## Disclaimer

Vanity is provided "as is" without warranty of any kind. The security of your cryptocurrency depends on keeping your private keys and mnemonic phrases secure. We are not responsible for any loss of cryptocurrency resulting from lost, stolen, or compromised private keys or mnemonics.
`;

export const CyberpunkLanding: React.FC = () => {
  const { setActiveSection } = useThreeScene()
  const [isPrivacyPage, setIsPrivacyPage] = useState(false)
  
  // Use window.location.pathname to detect routes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPrivacyPage(window.location.pathname.includes('/vanity/privacy'))
    }
  }, [])
  
  // Handle keyboard navigation for sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveSection((prev) => (prev + 1) % 6)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveSection((prev) => (prev - 1 + 6) % 6)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setActiveSection])
  
  // Convert markdown-like privacy policy to JSX
  const renderPrivacyPolicy = () => {
    return vanityPrivacyPolicy.split('\n').map((line, index) => {
      // Headings
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-2xl font-orbitron text-[#00ff00] tracking-wider mb-4">{line.substring(2)}</h2>;
      } else if (line.startsWith('## ')) {
        return <h3 key={index} className="text-xl font-orbitron text-[#00ff00] tracking-wider mt-6 mb-3">{line.substring(3)}</h3>;
      } else if (line.startsWith('### ')) {
        return <h4 key={index} className="text-lg font-orbitron text-[#00ff00] tracking-wider mt-4 mb-2">{line.substring(4)}</h4>;
      } 
      // List items
      else if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 text-gray-300 mb-1">{processBoldText(line.substring(2))}</li>;
      } 
      // Empty lines
      else if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      } 
      // Regular paragraphs
      else {
        return <p key={index} className="text-gray-300 mb-4">{processBoldText(line)}</p>;
      }
    });
  };

  // Helper function to process bold text
  const processBoldText = (text: string) => {
    // Handle markdown bold text with ** **
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract the text between ** **
        const boldText = part.substring(2, part.length - 2);
        return <strong key={index} className="text-[#00ff00]">{boldText}</strong>;
      }
      return part;
    });
  };
  
  return (
    <div className="relative min-h-screen overflow-auto touch-auto">
      <div className="sticky top-8 w-full flex justify-center z-10">
        <div className="w-full max-w-2xl px-4 flex items-center justify-center relative">
          {/* Back Button - Only show on privacy page */}
          {isPrivacyPage && (
            <div className="absolute left-4 top-1/4 transform -translate-y-1/4">
              <Link href="/">
                <div className="flex items-center justify-center w-10 h-10 bg-[#003300]/70 text-[#00ff00] rounded-full hover:bg-[#004400] transition-colors duration-300 cursor-pointer shadow-[0_0_10px_rgba(0,255,0,0.3)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
              </Link>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-orbitron text-center whitespace-nowrap mb-4 text-cyan-500 tracking-wider cyberpunk-text">
            {isPrivacyPage ? 'VANITY ADDRESS' : 'DOMINIK GSTÖHL'}
          </h1>
        </div>
      </div>
      
      {/* Main Content - Projects, etc. */}
      <div className="relative z-20">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto space-y-6 mt-8 pointer-events-auto">
            
            {/* Render privacy policy if on that page, otherwise show projects */}
            {isPrivacyPage ? (
              <div className="backdrop-blur-sm bg-black/40 rounded-lg border border-[#00ff00]/30 p-6 cyber-glow">
                <h2 className="text-2xl font-orbitron text-[#00ff00] tracking-wider mb-6">PRIVACY POLICY</h2>
                {renderPrivacyPolicy()}
              </div>
            ) : (
              <>
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className="backdrop-blur-sm bg-black/40 rounded-lg border border-[#00ff00]/30 p-6 cyber-glow mb-6"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="hidden sm:block w-16 h-16 rounded-md overflow-hidden flex-shrink-0 relative">
                        {project.image && (
                          <Image 
                            src={project.image} 
                            alt={project.name} 
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-orbitron text-[#00ff00] mb-1">{project.name}</h3>
                          {project.releaseDate && (
                            <span className="text-xs text-gray-400">{project.releaseDate}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map(tech => (
                            <span 
                              key={tech} 
                              className="px-2 py-1 bg-[#002200]/60 text-[#00ff00] text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {project.appStoreUrl && (
                        <a 
                          href={project.appStoreUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 bg-[#003300]/70 text-[#00ff00] rounded hover:bg-[#004400] transition-colors duration-300 text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                          </svg>
                          App Store
                        </a>
                      )}
                      
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 bg-[#003300]/70 text-[#00ff00] rounded hover:bg-[#004400] transition-colors duration-300 text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 bg-[#003300]/70 text-[#00ff00] rounded hover:bg-[#004400] transition-colors duration-300 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Website
                        </a>
                      )}
                      
                      {project.privacyPolicyUrl && (
                        <Link href={project.privacyPolicyUrl}>
                          <div className="flex items-center gap-2 px-3 py-1 bg-[#003300]/70 text-[#00ff00] rounded hover:bg-[#004400] transition-colors duration-300 text-sm cursor-pointer">
                            <svg className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.7 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"/>
                            </svg>
                            Privacy Policy
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}

                {/* Contact Card */}
                <div className="backdrop-blur-sm bg-black/40 rounded-lg border border-[#00ff00]/30 p-6 cyber-glow mb-6">
                  <h3 className="text-xl font-orbitron text-[#00ff00] mb-4">CONTACT</h3>
                  <div className="flex flex-col space-y-3">
                    <a 
                      href="mailto:dominik.gstoehl@icloud.com" 
                      className="flex items-center gap-2 text-gray-300 hover:text-[#00ff00] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      <span>dominik.gstoehl@icloud.com</span>
                    </a>
                  </div>
                </div>

                {/* Mentions Card */}
                <div className="backdrop-blur-sm bg-black/40 rounded-lg border border-[#00ff00]/30 p-6 cyber-glow mb-6">
                  <h3 className="text-xl font-orbitron text-[#00ff00] mb-4">MENTIONS</h3>
                  
                  {/* Mention sub-card */}
                  <div className="border border-[#003300] rounded-lg p-4 bg-black/30 mb-4">
                    {/* Name and Socials */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-orbitron text-[#00ff00]">Manuel Lampert</h4>
                      
                      <div className="flex gap-2">
                        <a 
                          href="https://x.com/manuellampert" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-7 h-7 bg-[#003300]/70 text-[#00ff00] rounded hover:bg-[#004400] transition-colors duration-300"
                          aria-label="X profile"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                        </a>
                        <a 
                          href="https://manuellampert.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-7 h-7 bg-[#003300]/70 text-[#00ff00] rounded hover:bg-[#004400] transition-colors duration-300"
                          aria-label="Website"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    {/* Projects */}
                    <div className="pl-2 border-l-2 border-[#003300]">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200">Vanity Address</span>
                        <span className="px-2 py-0.5 bg-[#002200]/60 text-[#00ff00] text-xs rounded">UI Design</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">Initial UI design</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 