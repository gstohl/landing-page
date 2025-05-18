"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { EverythingAtOnceSection } from './EverythingAtOnce'
import { CreativitySection } from './Creativity'
import { MasterOfPromptsSection } from './MasterOfPrompts'
import { TheDarknessSection } from './TheDarkness'
import { SecuritySection } from './Security'
import { BlockchainSection } from './Blockchain'

// Import ThreeScene dynamically
const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false })

// Define sections with their physical positions around the camera
const sections = [
  {
    id: 'everything-at-once',
    title: 'EVERYTHING AT ONCE',
    component: EverythingAtOnceSection,
    position: new THREE.Vector3(Math.sin(0 * Math.PI / 3) * 10, 0, Math.cos(0 * Math.PI / 3) * 10), // Front
    rotation: new THREE.Euler(0, 0, 0),
    color: '#00ffff' // Cyan
  },
  {
    id: 'security',
    title: 'SECURITY',
    component: SecuritySection,
    position: new THREE.Vector3(Math.sin(1 * Math.PI / 3) * 10, 0, Math.cos(1 * Math.PI / 3) * 10), // Front-Right
    rotation: new THREE.Euler(0, 0, 0),
    color: '#00ffcc' // Security Green/Cyan
  },
  {
    id: 'master-of-prompts',
    title: 'PROMPTS',
    component: MasterOfPromptsSection,
    position: new THREE.Vector3(Math.sin(2 * Math.PI / 3) * 10, 0, Math.cos(2 * Math.PI / 3) * 10), // Back-Right
    rotation: new THREE.Euler(0, 0, 0),
    color: '#22ffaa' // Green
  },
  {
    id: 'the-darkness',
    title: 'UNKNOWN',
    component: TheDarknessSection,
    position: new THREE.Vector3(Math.sin(3 * Math.PI / 3) * 10, 0, Math.cos(3 * Math.PI / 3) * 10), // Back
    rotation: new THREE.Euler(0, 0, 0),
    color: '#ff0055' // Red/Pink
  },
  {
    id: 'blockchain',
    title: 'BLOCKCHAIN',
    component: BlockchainSection,
    position: new THREE.Vector3(Math.sin(4 * Math.PI / 3) * 10, 0, Math.cos(4 * Math.PI / 3) * 10), // Back-Left
    rotation: new THREE.Euler(0, 0, 0),
    color: '#ffff00' // Blockchain Gold/Yellow
  },
  {
    id: 'creativity',
    title: 'CREATIVITY',
    component: CreativitySection,
    position: new THREE.Vector3(Math.sin(5 * Math.PI / 3) * 10, 0, Math.cos(5 * Math.PI / 3) * 10), // Front-Left
    rotation: new THREE.Euler(0, 0, 0),
    color: '#ff00aa' // Magenta
  }
]

// Create a context to share Three.js instance
interface ThreeSceneContextType {
  activeSection: number;
  sections: typeof sections;
  setActiveSection: (section: number | ((prev: number) => number)) => void;
}

const ThreeSceneContext = createContext<ThreeSceneContextType>({
  activeSection: 0,
  sections: sections,
  setActiveSection: () => {}
})

export const useThreeScene = () => useContext(ThreeSceneContext)

export const ThreeSceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const mountedRef = useRef(false)

  // Initialize the Three.js scene once
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      setIsInitialized(true)
    }
  }, [])

  return (
    <ThreeSceneContext.Provider value={{ activeSection, sections, setActiveSection }}>
      {/* Persistent Three.js scene */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        {isInitialized && (
          <ThreeScene activeSection={activeSection} sections={sections}>
            {sections.map((Section, index) => (
              <group
                key={Section.id}
                position={Section.position}
                rotation={Section.rotation}
                visible={true}
              >
                <Section.component />
              </group>
            ))}
          </ThreeScene>
        )}
      </div>

      {/* Content layers */}
      {children}
    </ThreeSceneContext.Provider>
  )
} 