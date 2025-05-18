import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export const CreativitySection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.Group>(null)
  
  // Create memoized nodes data to prevent reset on scroll
  const nodesData = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      hue: 0.65 + Math.random() * 0.2
    }));
  }, []);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.mouse.x * Math.PI * 0.15 + t * 0.05,
        0.05
      )
    }
    
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        mesh.position.y = Math.sin(t * 0.5 + i * 0.2) * 0.2
        
        // Only set opacity if it's a material that supports it
        if (mesh.material instanceof THREE.Material && 'opacity' in mesh.material) {
          mesh.material.opacity = THREE.MathUtils.lerp(
            mesh.material.opacity,
            0.6 + Math.sin(t + i) * 0.4,
            0.1
          )
        }
      })
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Title removed - now shown in UI only */}
      
      {/* Neural Network Representation - Center this group */}
      <group>
        <group ref={nodesRef}>
          {/* Create neural network nodes - now using memoized data */}
          {nodesData.map((node, i) => (
            <mesh key={i} position={node.position}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color={new THREE.Color().setHSL(node.hue, 0.9, 0.6)}
                emissive={new THREE.Color().setHSL(node.hue, 0.9, 0.6)}
                emissiveIntensity={0.8}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
        
        {/* Connection lines */}
        <ConnectionLines />
        
        {/* Central brain structure */}
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#330033"
            wireframe={true}
            emissive="#ff00ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  )
}

const ConnectionLines: React.FC = () => {
  const linesRef = useRef<THREE.Group>(null)
  
  // Create all line geometries once and preserve them
  const lineGeometries = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const points: THREE.Vector3[] = []
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      )
      const endPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      )
      
      points.push(startPoint)
      // Add some curve points
      for (let j = 1; j < 5; j++) {
        points.push(new THREE.Vector3(
          THREE.MathUtils.lerp(startPoint.x, endPoint.x, j / 5) + (Math.random() - 0.5) * 0.5,
          THREE.MathUtils.lerp(startPoint.y, endPoint.y, j / 5) + (Math.random() - 0.5) * 0.5,
          THREE.MathUtils.lerp(startPoint.z, endPoint.z, j / 5) + (Math.random() - 0.5) * 0.5
        ))
      }
      points.push(endPoint)
      
      const curve = new THREE.CatmullRomCurve3(points)
      const curvePoints = curve.getPoints(50)
      
      // Create and return the actual geometry object
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
      
      return {
        geometry,
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.9, 0.6)
      }
    });
  }, []);
  
  // Initialize positions ref to track animated positions
  const positionsRef = useRef<{ [key: number]: Float32Array }>({});
  
  // Create initial position data and store it
  useMemo(() => {
    lineGeometries.forEach((line, i) => {
      // Clone the original positions to use as a starting reference
      const originalPositions = line.geometry.attributes.position.array.slice();
      positionsRef.current[i] = originalPositions as Float32Array;
    });
  }, [lineGeometries]);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    lineGeometries.forEach((line, i) => {
      const positions = positionsRef.current[i];
      if (!positions) return;
      
      // Apply animations to our stored positions
      for (let j = 0; j < positions.length; j += 3) {
        // Only modify Y positions to create wave effect
        positions[j + 1] = positions[j + 1] + Math.sin(t * 0.5 + i + j * 0.01) * 0.001;
      }
      
      // Update the geometry with our modified positions
      line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      line.geometry.attributes.position.needsUpdate = true;
    });
  })
  
  return (
    <group ref={linesRef}>
      {lineGeometries.map((line, i) => (
        <line key={i}>
          <primitive object={line.geometry} attach="geometry" />
          <lineBasicMaterial 
            attach="material" 
            color={line.color} 
            linewidth={1} 
            opacity={0.6} 
            transparent 
          />
        </line>
      ))}
    </group>
  )
} 