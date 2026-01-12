import { Canvas } from '@react-three/fiber';
import { Stars, Grid } from '@react-three/drei';
import { Cursor } from './Cursor';

export function Scene() {
  return (
    <div id="canvas-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        
        {/* === AMBIENTE === */}
        <color attach="background" args={['#050505']} />
        
        {/* Estrelas ao fundo para dar profundidade */}
        <Stars radius={50} count={2000} factor={4} fade speed={1} />
        
        {/* Grid no chão (efeito Tron/Cyberpunk) */}
        {/* Rotacionamos para parecer um "piso" infinito */}
        <group rotation={[Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
           <Grid 
             args={[20, 20]} 
             cellColor="#1a1a1a" 
             sectionColor="#00f3ff" 
             fadeDistance={15} 
           />
        </group>

        {/* Luz Ambiente suave */}
        <ambientLight intensity={0.5} />

        {/* === OBJETOS INTERATIVOS === */}
        <Cursor />

      </Canvas>
    </div>
  );
}