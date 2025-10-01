import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export const EverythingAtOnceSection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)
  const centralObjectRef = useRef<THREE.Mesh>(null)

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
    const t = state.clock.getElapsedTime()

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

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * 0.3
      ringsRef.current.rotation.y = t * 0.2
      ringsRef.current.rotation.z = t * 0.1
    }

    // Pulse central object
    if (centralObjectRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.1
      centralObjectRef.current.scale.setScalar(scale)
      centralObjectRef.current.rotation.x += 0.005
      centralObjectRef.current.rotation.y += 0.01
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
        
        {/* Orbiting Ring System */}
        <group ref={ringsRef}>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, 0]}>
              <torusGeometry args={[2 + i * 0.5, 0.05, 16, 100]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(0.3 + i * 0.2, 0.9, 0.6)}
                emissive={new THREE.Color().setHSL(0.3 + i * 0.2, 0.9, 0.6)}
                emissiveIntensity={1.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>

        {/* Central Complex Object with glow */}
        <mesh ref={centralObjectRef} position={[0, 0, 0]}>
          <torusKnotGeometry args={[1.5, 0.4, 128, 32, 2, 5]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.1}
            metalness={1}
            emissive="#00ffaa"
            emissiveIntensity={2}
            wireframe={true}
          />
        </mesh>

        {/* Particle trails effect */}
        <TrailParticles />
      </group>
    </group>
  )
}

// Particle trail component
const TrailParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2
      const radius = 2.5
      temp.push(
        Math.cos(angle) * radius,
        Math.sin(angle * 3) * 0.5,
        Math.sin(angle) * radius
      )
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const t = state.clock.getElapsedTime()
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        const angle = (i / positions.length) * Math.PI * 2 + t
        const radius = 2.5 + Math.sin(t + i * 0.1) * 0.3
        positions[i] = Math.cos(angle) * radius
        positions[i + 1] = Math.sin(angle * 3 + t) * 0.5
        positions[i + 2] = Math.sin(angle) * radius
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[particles, 3]}
          attach="attributes-position"
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00ffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
} 