import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const MasterOfPromptsSection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  // Memoize particles data to avoid recalculation on re-renders
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 500; i++) {
      const t = Math.random() * Math.PI * 2
      const r = 3 + Math.random() * 2
      const x = r * Math.sin(t) * Math.cos(t * 10)
      const y = (Math.random() - 0.5) * 5
      const z = r * Math.cos(t) * Math.sin(t * 10)
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])
  
  // Memoize text fragment positions and properties
  const textFragmentProps = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      text: getRandomPromptText(i),
      color: new THREE.Color().setHSL(0.3 + Math.random() * 0.2, 0.9, 0.6)
    }));
  }, []);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]
        
        // Apply sine wave animation
        positions[i] = x + Math.sin(t + y * 0.5) * 0.01
        positions[i + 1] = y + Math.cos(t + x * 0.5) * 0.01
        positions[i + 2] = z + Math.sin(t + z * 0.5) * 0.01
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Title removed - now shown in UI only */}
      
      {/* Holographic Prompt Visualization */}
      <group position={[0, 0, 0]}>
        {/* Floating text fragments - using memoized props */}
        {textFragmentProps.map((props, i) => (
          <TextFragment
            key={i}
            position={props.position}
            text={props.text}
            color={props.color}
          />
        ))}
        
        {/* Particle system */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute 
              args={[particles, 3]}
              attach="attributes-position"
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color="#00ffaa"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
        
        {/* Central hologram cylinder */}
        <mesh>
          <cylinderGeometry args={[2, 2, 4, 32, 1, true]} />
          <meshPhongMaterial
            color="#001a0a"
            emissive="#00ff7f"
            emissiveIntensity={0.2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
        
        {/* Energy beam */}
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.2, 8, 16, 1, true]} />
          <meshBasicMaterial
            color="#00ffaa"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

const TextFragment: React.FC<{
  position: [number, number, number];
  text: string;
  color: THREE.Color;
}> = ({ position, text, color }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(t + position[0]) * 0.002
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.05
      
      // Pulse effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[text.length * 0.05 + 0.1, 0.2]} />
      <meshStandardMaterial
        color="#000000"
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.9}
      >
        <canvasTexture
          attach="map"
          image={getTextCanvas(text, color.getStyle())}
        />
      </meshStandardMaterial>
    </mesh>
  )
}

// Helper function to create text textures
function getTextCanvas(text: string, color: string) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = text.length * 30 + 30
  canvas.height = 60
  
  context.fillStyle = 'transparent'
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  context.font = '24px "Courier New"'
  context.fillStyle = color
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  
  return canvas
}

// Helper function to get random text for prompts
function getRandomPromptText(index: number): string {
  const prompts = [
    "Generate a 3D scene",
    "Design UI component",
    "Optimize for mobile",
    "Create animation",
    "Implement physics",
    "Add particle effects",
    "Write shader code",
    "Model character",
    "Setup lighting",
    "Build interactive UI",
    "Develop gameplay",
    "Compose scene"
  ];
  return prompts[index % prompts.length];
} 