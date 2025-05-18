import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export const EverythingAtOnceSection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  // Create memoized spheres data to prevent reset on scroll
  const spheresData = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [
        Math.sin(i * 0.5) * 3, 
        Math.cos(i * 0.3) * 1.5, 
        Math.sin(i * 0.2) * 2
      ] as [number, number, number],
      size: 0.1 + Math.random() * 0.2,
      hue: i * 0.05
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.mouse.x * Math.PI * 0.15,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        state.mouse.y * Math.PI * 0.05,
        0.05
      )
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Title removed - now shown in UI only */}
      
      {/* 3D Abstract Artwork */}
      <group position={[0, 0, 0]}>
        {/* Neon Grid - Removed */}
        
        {/* Abstract Spheres - now using memoized data */}
        {spheresData.map((sphere, i) => (
          <mesh 
            key={i} 
            position={sphere.position}
          >
            <sphereGeometry args={[sphere.size, 16, 16]} />
            <MeshDistortMaterial
              color={new THREE.Color().setHSL(sphere.hue, 0.9, 0.6)}
              emissive={new THREE.Color().setHSL(sphere.hue, 0.9, 0.6)}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
              distort={0.3}
              speed={2}
            />
          </mesh>
        ))}
        
        {/* Central Complex Object */}
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1.5, 0.4, 128, 32, 2, 5]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.1}
            metalness={1}
            emissive="#00ffaa"
            emissiveIntensity={0.5}
            wireframe={true}
          />
        </mesh>
      </group>
    </group>
  )
} 