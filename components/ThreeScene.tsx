import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ErrorBoundary } from 'react-error-boundary'
import dynamic from 'next/dynamic'
import { EffectComposer, Scanline, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// Define the structure for section data passed down
interface SectionData {
  id: string;
  title: string;
  component: React.FC;
  position: THREE.Vector3;
  rotation: THREE.Euler; // Keep rotation in case needed later, but not used for camera now
  color: string;
}

// Check if WebGL is available
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

// Effects component with proper post-processing setup
// This is kept for future use even though it's not currently utilized
// @ts-expect-error - Defined for future use
export function Effects() {
  const { gl } = useThree()
  
  useEffect(() => {
    // Initialize any post-processing effects here if needed
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for better performance
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap

    // Removed resize handler - camera perspective handles viewport
  }, [gl])

  return null
}

// Error Fallback component for the ErrorBoundary
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-5 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-700">Something went wrong with the 3D scene:</p>
      <pre className="mt-2 text-red-600 text-sm">{error.message}</pre>
    </div>
  )
}

// Interface for ThreeScene props
interface ThreeSceneProps {
  children?: React.ReactNode;
  activeSection: number;
  sections: SectionData[];
}

// Enhanced CRT Effect component with green phosphor look
const CRTEffect = React.memo(function CRTEffect() {
  return (
    <EffectComposer>
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.25} opacity={0.5} />
      <ChromaticAberration offset={[0.003, 0.003]} />
      <Vignette eskil={false} offset={0.1} darkness={0.85} />
      <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
})

// Camera animation component with auto-rotation
const CameraController: React.FC<{ activeSection: number; sections: SectionData[] }> = ({ activeSection, sections }) => {
  const { camera } = useThree()
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const initializedRef = useRef(false)
  const autoRotateRef = useRef(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rotationSpeedRef = useRef(0.0003) // Slow rotation speed
  const rotationAngleRef = useRef(0)
  const rotationRadiusRef = useRef(5) // Distance from center
  const mousePosition = useRef({ x: 0, y: 0 })
  const mouseFactor = 0.05 // How much the mouse influences rotation (lower = subtle)
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1) // Y is inverted in 3D space
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  // Initial camera setup - run once on component mount
  useEffect(() => {
    if (!initializedRef.current && sections[activeSection]) {
      // Reset camera rotation and position
      camera.position.set(0, 0, rotationRadiusRef.current)
      camera.rotation.set(0, 0, 0)
      camera.up.set(0, 1, 0)
      
      // Set initial look-at without animation
      if (autoRotateRef.current) {
        targetLookAt.current.set(0, 0, 0) // For auto-rotation, look at center
      } else {
        targetLookAt.current.copy(sections[activeSection].position) // For section navigation
      }
      
      camera.lookAt(targetLookAt.current)
      
      // Mark as initialized
      initializedRef.current = true
    }
    
    return () => {
      // Cleanup timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [camera, sections, activeSection])

  // Handle section changes
  useEffect(() => {
    if (sections[activeSection] && initializedRef.current && !autoRotateRef.current) {
      // Only update target if we're not auto-rotating
      targetLookAt.current.copy(sections[activeSection].position)
    }
  }, [activeSection, sections])

  useFrame(() => {
    if (!initializedRef.current) return;
    
    // Auto-rotation logic
    rotationAngleRef.current += rotationSpeedRef.current
    
    // Calculate new camera position based on rotation angle
    const baseX = Math.sin(rotationAngleRef.current) * rotationRadiusRef.current
    const baseZ = Math.cos(rotationAngleRef.current) * rotationRadiusRef.current
    
    // Apply subtle mouse-based offset to the camera position
    const mouseX = baseX + mousePosition.current.x * mouseFactor
    const mouseY = mousePosition.current.y * mouseFactor
    const mouseZ = baseZ - Math.abs(mousePosition.current.x) * mouseFactor * 0.2 // Subtle Z adjustment
    
    camera.position.set(mouseX, mouseY, mouseZ)
    
    // Create a modified look target based on mouse position
    const targetOffset = new THREE.Vector3(
      -mousePosition.current.x * mouseFactor * 2.5,
      -mousePosition.current.y * mouseFactor * 2.5,
      0
    )
    
    // Look at the center/target with slight mouse-based offset
    const adjustedTarget = targetLookAt.current.clone().add(targetOffset)
    camera.lookAt(adjustedTarget)
  })

  return null
}

// Create the scene with proper context management
const ThreeScene: React.FC<ThreeSceneProps> = ({ children, activeSection, sections }) => {
  const [contextLost, setContextLost] = useState(false)
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Client-side only mounting
  useEffect(() => {
    setIsWebGLSupported(isWebGLAvailable())
    setIsMounted(true)
  }, [])

  // WebGL context handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleContextLost = (e: Event) => {
      e.preventDefault()
      setContextLost(true)
      console.warn('WebGL context lost')
    }
    
    const handleContextRestored = () => {
      setContextLost(false)
      console.log('WebGL context restored')
    }
    
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [isMounted])
  
  if (!isMounted) {
    return <div className="fixed top-0 left-0 w-screen h-screen bg-[#041104]" />
  }
  
  if (!isWebGLSupported) {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-md text-red-800">
        Your browser does not support WebGL, which is required for this 3D scene.
      </div>
    )
  }

  if (contextLost) {
    return (
      <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
        WebGL context was lost. Please refresh the page.
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas 
          ref={canvasRef}
          shadows 
          dpr={[1, 2]}
          frameloop="always"
          style={{ position: 'absolute' }}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            alpha: false,
            stencil: false,
            depth: true
          }}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#041104') // Dark green base color
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          }}
        >
          {/* Set initial camera position - it will look around from here */}
          <PerspectiveCamera 
            makeDefault 
            position={[0, 0, 5]} // Start a bit back to see the scene
            fov={70} // Wider field of view to see more
            near={0.1}
            far={1000}
          />
          <CameraController activeSection={activeSection} sections={sections} /> 

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <fog attach="fog" args={['#041104', 10, 25]} />
          <color attach="background" args={['#041104']} />
          <Sparkles count={500} scale={20} size={2} speed={0.5} color="#00ff00" />
          <Environment preset="night" />
          <Suspense fallback={null}>
            {children} {/* Render the statically positioned sections */}
          </Suspense>
          <CRTEffect />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

function ThreeSceneWrapper({ children, activeSection, sections }: ThreeSceneProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="p-4 bg-[#041104]"></div>}>
        <ThreeScene activeSection={activeSection} sections={sections}>
          {children}
        </ThreeScene>
      </Suspense>
    </ErrorBoundary>
  )
}

// Export with dynamic import and SSR disabled
export default dynamic(() => Promise.resolve(ThreeSceneWrapper), {
  ssr: false
}) 