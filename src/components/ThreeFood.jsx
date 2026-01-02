import { useRef } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

// Simple 3D Burger/Plate Component (using primitives since we don't have a model file)
function FoodModel() {
  const meshRef = useRef();
  const plateRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (plateRef.current) {
      plateRef.current.rotation.y -= 0.005;
    }
  });

  return (
    <group>
      {/* Plate */}
      <mesh ref={plateRef} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Bottom Bun */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#D2691E" roughness={0.8} />
      </mesh>

      {/* Patty */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.15, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Cheese */}
      <mesh ref={meshRef} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 32]} />
        <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Top Bun */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#D2691E" roughness={0.8} />
      </mesh>

      {/* Sesame Seeds */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.6,
            0.3,
            Math.sin((i / 8) * Math.PI * 2) * 0.6
          ]}
          rotation={[0, (i / 8) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.1, 0.05, 0.05]} />
          <meshStandardMaterial color="#FFF8DC" />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeFood() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff6b35" />
        
        <FoodModel />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

