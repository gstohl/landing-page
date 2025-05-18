import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, GradientTexture } from '@react-three/drei'
import * as THREE from 'three'

export const TheDarknessSection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  // Create memoized symbol positions, rotations and colors
  // These will persist across re-renders during scrolling
  const symbolProps = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      position: [
        Math.cos(i * Math.PI / 6) * 4,
        (Math.random() - 0.5) * 3,
        Math.sin(i * Math.PI / 6) * 4
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ] as [number, number, number],
      color: new THREE.Color().setHSL(0.9 + Math.random() * 0.1, 0.8, 0.5),
      geometry: Math.floor(Math.random() * 4) // Store the random geometry type
    }));
  }, []); // Empty dependency array means this only runs once
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Title removed - now shown in UI only */}
      
      {/* Dark Vortex */}
      <group position={[0, 0, 0]}>
        {/* Black hole effect */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#000000"
            metalness={1}
            roughness={0}
            emissive="#220011"
          />
        </mesh>
        
        {/* Dark energy rings */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[0, 0, 0]} 
            rotation={[Math.PI / 2, 0, i * Math.PI / 5]}
          >
            <torusGeometry args={[1.5 + i * 0.3, 0.05, 16, 100]} />
            <meshStandardMaterial
              color="#000000"
              emissive={new THREE.Color().setHSL(0.9, 0.8, 0.3)}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
        
        {/* Mysterious symbols floating - now using memoized props */}
        {symbolProps.map((props, i) => (
          <Symbol
            key={i}
            position={props.position}
            rotation={props.rotation}
            color={props.color}
            geometryType={props.geometry}
          />
        ))}
        
        {/* Dark energy beams */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 3,
                0,
                Math.sin(angle) * 3
              ]}
              rotation={[0, -angle + Math.PI / 2, 0]}
              scale={[1, 1, 4]}
            >
              <boxGeometry args={[0.05, 0.05, 1]} />
              <meshBasicMaterial
                color="#ff0066"
                transparent
                opacity={0.5}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

const Symbol: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  color: THREE.Color;
  geometryType: number;
}> = ({ position, rotation, color, geometryType }) => {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (ref.current) {
      ref.current.rotation.x += 0.005
      ref.current.rotation.y += 0.01
      
      // Pulse effect
      const scale = 0.8 + Math.sin(t * 2) * 0.2
      ref.current.scale.set(scale, scale, scale)
      
      // Glow effect
      const material = ref.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3
    }
  })
  
  // Use the passed geometry type instead of generating randomly on each render
  const getSymbolGeometry = () => {
    switch (geometryType) {
      case 0: return <octahedronGeometry args={[0.5]} />
      case 1: return <tetrahedronGeometry args={[0.5]} />
      case 2: return <icosahedronGeometry args={[0.5]} />
      default: return <dodecahedronGeometry args={[0.5]} />
    }
  }
  
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      {getSymbolGeometry()}
      <meshStandardMaterial
        color="#000000"
        emissive={color}
        emissiveIntensity={0.8}
        wireframe
      />
    </mesh>
  )
} 