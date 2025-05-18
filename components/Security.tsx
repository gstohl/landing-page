import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shaders for the security visualization
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Add some wave distortion to the geometry
    vec3 pos = position;
    pos.x += sin(position.y * 10.0 + time) * 0.05;
    pos.y += cos(position.x * 10.0 + time) * 0.05;
    pos.z += sin(position.x * 10.0 + cos(position.y * 2.0) + time) * 0.05;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    // Grid pattern
    float gridX = step(0.95, mod(vUv.x * 20.0, 1.0));
    float gridY = step(0.95, mod(vUv.y * 20.0, 1.0));
    float grid = gridX + gridY;
    
    // Scanning line
    float scanline = smoothstep(0.0, 0.005, sin(vUv.y * 100.0 - time * 5.0) * 0.5 + 0.5);
    
    // Pulse effect
    float pulse = 0.5 + 0.5 * sin(time * 0.5);
    
    // Edge glow
    float edge = smoothstep(0.5, 0.6, abs(vPosition.x)) + 
                 smoothstep(0.5, 0.6, abs(vPosition.y)) + 
                 smoothstep(0.5, 0.6, abs(vPosition.z));
    
    // Combine effects
    vec3 color = mix(
      vec3(0.0, 0.8, 0.4), // Base color (green)
      vec3(0.0, 1.0, 0.8), // Highlight color (cyan)
      grid + edge * pulse
    );
    
    // Add scanline
    color = mix(color, vec3(0.0, 1.0, 1.0), scanline * 0.3);
    
    // Set final color with opacity
    gl_FragColor = vec4(color, 0.7);
  }
`

export const SecuritySection: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Store uniforms for shader
  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), [])
  
  // Create memoized fragment positions to prevent reset on scroll
  const fragmentsData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const angle = (i / 30) * Math.PI * 2 + Math.random() * 0.2;
      const radius = 2.5 + Math.random() * 1.5;
      return {
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 3,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.1,
        hue: 0.45 + Math.random() * 0.1,
        opacity: 0.7 + Math.random() * 0.2
      };
    });
  }, []);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // Update shader time uniform
    uniforms.time.value = t
    
    // Rotate the entire group
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Title removed - now shown in UI only */}
      
      {/* Central abstract security representation */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
        <boxGeometry args={[2, 2, 2, 8, 8, 8]} /> {/* Use a Box for a 'shield' or 'firewall' feel */}
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          wireframe={true} // Keep wireframe for a techy look
        />
      </mesh>

       {/* Floating digital fragments - now using memoized data */}
       {fragmentsData.map((fragment, i) => (
         <mesh 
           key={i} 
           position={fragment.position} 
           scale={fragment.scale}
         >
           <boxGeometry args={[1, 1, 1]} />
           <meshStandardMaterial 
             color={new THREE.Color().setHSL(fragment.hue, 0.8, 0.5)} // Cyan/Green hues
             emissive={new THREE.Color().setHSL(fragment.hue, 0.8, 0.5)}
             emissiveIntensity={0.6}
             transparent
             opacity={fragment.opacity}
           />
         </mesh>
       ))}
    </group>
  )
} 