import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const BlockchainSection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const blocksRef = useRef<THREE.Group>(null)

  const blockInstances = useMemo(() => {
    const instances: { position: THREE.Vector3, scale: number }[] = []
    for (let i = 0; i < 30; i++) {
      instances.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 8
        ),
        scale: 0.3 + Math.random() * 0.4
      })
    }
    return instances
  }, [])

  useFrame((_state) => {
    const t = _state.clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.03, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.1) * 0.1, 0.05)
    }

    if (blocksRef.current) {
      blocksRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        // Add subtle floating motion
        mesh.position.y += Math.sin(t * 0.6 + i * 0.5) * 0.005
        mesh.rotation.x += 0.001 * Math.cos(t * 0.5 + i)
        mesh.rotation.y += 0.001 * Math.sin(t * 0.4 + i)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Floating Blocks Representation */}
      <group ref={blocksRef}>
        {blockInstances.map((instance, i) => (
          <mesh key={i} position={instance.position} scale={instance.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={new THREE.Color().setHSL(0.15 + Math.random() * 0.05, 0.9, 0.6)} // Gold/Yellow hues
              emissive={new THREE.Color().setHSL(0.15 + Math.random() * 0.05, 0.9, 0.6)}
              emissiveIntensity={0.4}
              metalness={0.3}
              roughness={0.6}
              transparent
              opacity={0.85 + Math.random() * 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Simple Connection Lines (less complex than Creativity) */}
      <ConnectionLines blocks={blockInstances} />

    </group>
  )
}

// Enhanced Connection Lines with animated transactions
const ConnectionLines: React.FC<{ blocks: { position: THREE.Vector3 }[] }> = ({ blocks }) => {
  const linesRef = useRef<THREE.Group>(null)

  const lineConnections = useMemo(() => {
    const connections: { start: THREE.Vector3; end: THREE.Vector3; geometry: THREE.BufferGeometry }[] = []
    for (let i = 0; i < blocks.length; i++) {
      // Connect each block to a few random others
      const numConnections = Math.floor(Math.random() * 2) + 1
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * blocks.length)
        if (i === targetIndex) continue

        const points = [blocks[i].position, blocks[targetIndex].position]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        connections.push({
          start: blocks[i].position,
          end: blocks[targetIndex].position,
          geometry
        })
      }
    }
    return connections
  }, [blocks])

  return (
    <group ref={linesRef}>
      {lineConnections.map((connection, i) => (
        <React.Fragment key={i}>
          <line>
            <primitive object={connection.geometry} attach="geometry" />
            <lineBasicMaterial
              attach="material"
              color={new THREE.Color().setHSL(0.15, 0.9, 0.7)}
              linewidth={1}
              opacity={0.3}
              transparent
            />
          </line>
          <TransactionParticle
            start={connection.start}
            end={connection.end}
            delay={i * 0.5}
          />
        </React.Fragment>
      ))}
    </group>
  )
}

// Animated transaction particle moving along connection
const TransactionParticle: React.FC<{
  start: THREE.Vector3;
  end: THREE.Vector3;
  delay: number;
}> = ({ start, end, delay }) => {
  const particleRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.getElapsedTime() + delay) % 3
      const progress = t / 3

      // Lerp between start and end
      particleRef.current.position.lerpVectors(start, end, progress)

      // Pulse effect
      const scale = 0.15 + Math.sin(progress * Math.PI) * 0.1
      particleRef.current.scale.setScalar(scale)

      // Fade in/out
      const material = particleRef.current.material as THREE.MeshStandardMaterial
      material.opacity = Math.sin(progress * Math.PI) * 0.8
    }
  })

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshStandardMaterial
        color={new THREE.Color().setHSL(0.15, 1, 0.7)}
        emissive={new THREE.Color().setHSL(0.15, 1, 0.7)}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
} 