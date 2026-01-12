import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';
import * as THREE from 'three';

export function JarvisHand() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  
  const cursorTarget = useAppStore((state) => state.cursor);
  const isClicking = useAppStore((state) => state.isClicking); // <--- LENDO O CLIQUE
  
  const { viewport } = useThree();
  const [dataStream, setDataStream] = useState("READY");

  // Cores do Jarvis
  const colorIdle = new THREE.Color("#00f3ff"); // Azul
  const colorActive = new THREE.Color("#ffaa00"); // Laranja (Clique)

  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Posição
    const targetX = cursorTarget.x * (viewport.width / 2);
    const targetY = cursorTarget.y * (viewport.height / 2);
    
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.2;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.2;

    // 2. Animação baseada no CLIQUE
    const targetScale = isClicking ? 0.8 : 1.2; // Encolhe ao clicar
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Rotação Acelera ao clicar
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += isClicking ? 0.2 : 0.02;
    }

    // Texto muda
    if (Math.random() > 0.9) {
      setDataStream(isClicking ? "INTERACTING..." : "SCANNING...");
    }
  });

  return (
    <group ref={groupRef}>
      {/* Esfera Central (Muda de cor) */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={isClicking ? colorActive : colorIdle} />
      </mesh>

      {/* Anel Externo */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.4, 0.01, 16, 100]} />
        <meshBasicMaterial 
          color={isClicking ? colorActive : colorIdle} 
          transparent opacity={0.5} 
          wireframe 
        />
      </mesh>

      {/* Texto */}
      <Text
        position={[0.6, 0.2, 0]} 
        fontSize={0.15}
        color={isClicking ? "#ffaa00" : "#00f3ff"}
      >
        {dataStream}
      </Text>
    </group>
  );
}