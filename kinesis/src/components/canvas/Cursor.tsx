import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAppStore } from '../../store/useAppStore';
import * as THREE from 'three';

export function Cursor() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Pegamos o estado do cursor do nosso Store
  const cursorTarget = useAppStore((state) => state.cursor);
  const isHandDetected = useAppStore((state) => state.isAiReady); // Usando isAiReady por enquanto como "ativo"

  // useThree nos dá o tamanho exato da tela visível em unidades 3D
  const { viewport } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    // 1. Calcular a posição real no mundo 3D
    // Multiplicamos a coordenada normalizada (-1 a 1) pela metade do tamanho da tela
    const targetX = cursorTarget.x * (viewport.width / 2);
    const targetY = cursorTarget.y * (viewport.height / 2);

    // 2. Suavização (Lerp) - Para o movimento não ficar "travado"
    // Move 15% da distância a cada frame
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.15;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.15;

    // 3. Efeito visual: Gira o cursor
    meshRef.current.rotation.x += 0.02;
    meshRef.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Geometria: Um icosaedro parece mais "tech" que uma esfera perfeita */}
      <icosahedronGeometry args={[0.3, 1]} /> 
      
      {/* Material: Brilha no escuro (Emissive) */}
      <meshStandardMaterial 
        color="#00f3ff" 
        emissive="#00f3ff"
        emissiveIntensity={2}
        wireframe={true}
      />
      
      {/* Uma luzinha pontual seguindo o cursor para iluminar objetos próximos */}
      <pointLight distance={3} intensity={5} color="#00f3ff" />
    </mesh>
  );
}