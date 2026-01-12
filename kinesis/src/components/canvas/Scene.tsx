import { Canvas } from '@react-three/fiber';
import { Stars, Grid } from '@react-three/drei';
import { JarvisHand } from './JarvisHand';

export function Scene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ alpha: true }} /* <--- ISSO DEIXA O FUNDO TRANSPARENTE */
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Grid no chão */}
      <group rotation={[Math.PI / 3, 0, 0]} position={[0, -3, -10]}>
         <Grid 
           args={[30, 30]} 
           cellColor="#00f3ff" 
           sectionColor="#ffffff" 
           fadeDistance={20}
         />
      </group>

      <Stars radius={50} count={1000} factor={3} fade speed={2} />
      <JarvisHand />
    </Canvas>
  );
}