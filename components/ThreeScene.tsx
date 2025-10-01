import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ErrorBoundary } from 'react-error-boundary'
import dynamic from 'next/dynamic'
import { EffectComposer, Scanline, ChromaticAberration, Vignette, Noise, Bloom, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'

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

// Enhanced CRT Effect component with green phosphor look and bloom
// Optimized for mobile performance
const CRTEffect = React.memo(function CRTEffect() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <EffectComposer>
      <Bloom
        intensity={isMobile ? 1.0 : 1.5}
        luminanceThreshold={isMobile ? 0.3 : 0.2}
        luminanceSmoothing={0.9}
        kernelSize={isMobile ? KernelSize.MEDIUM : KernelSize.LARGE}
        mipmapBlur
      />
      {!isMobile ? (
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
      ) : null}
      <Scanline blendFunction={BlendFunction.OVERLAY} density={isMobile ? 1.0 : 1.5} opacity={isMobile ? 0.4 : 0.6} />
      <ChromaticAberration offset={isMobile ? [0.002, 0.002] : [0.004, 0.004]} />
      <Vignette eskil={false} offset={0.1} darkness={0.9} />
      <Noise opacity={isMobile ? 0.1 : 0.2} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  )
})

// Adaptive starfield component
const AdaptiveStarfield: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Stars
      radius={100}
      depth={50}
      count={isMobile ? 2000 : 5000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  )
}

// Adaptive sparkles component
const AdaptiveSparkles: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <Sparkles
        count={isMobile ? 150 : 300}
        scale={20}
        size={2}
        speed={0.3}
        color="#00ff00"
        opacity={0.8}
      />
      <Sparkles
        count={isMobile ? 100 : 200}
        scale={25}
        size={1.5}
        speed={0.4}
        color="#00ffff"
        opacity={0.6}
      />
    </>
  )
}

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
    
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        // Prevent default to avoid scrolling while touching the 3D scene
        // event.preventDefault();
        
        // Get the first touch point
        const touch = event.touches[0];
        
        // Convert touch position to normalized coordinates (-1 to 1)
        mousePosition.current = {
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -((touch.clientY / window.innerHeight) * 2 - 1) // Y is inverted in 3D space
        }
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
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
    return <div className="fixed top-0 left-0 w-screen h-screen bg-[#000510]" />
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
    <div className="fixed top-0 left-0 w-screen h-screen" style={{ zIndex: 0, pointerEvents: 'none' }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas 
          ref={canvasRef}
          shadows 
          dpr={[1, 2]}
          frameloop="always"
          style={{ position: 'absolute', pointerEvents: 'auto' }}
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
            gl.setClearColor('#000510') // Deep space blue-black
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.2
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

          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
          <pointLight position={[0, 0, 0]} intensity={1} color="#00ff00" distance={50} />
          <fog attach="fog" args={['#000510', 10, 30]} />
          <color attach="background" args={['#000510']} />

          {/* Procedural starfield - optimized for device */}
          <AdaptiveStarfield />

          {/* Adaptive sparkles */}
          <AdaptiveSparkles />

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
      <Suspense fallback={<div className="fixed inset-0 bg-[#000510] z-[-1]"></div>}>
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