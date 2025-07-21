import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface RobotProps {
  onClick?: () => void;
}

const Robot = ({ onClick }: RobotProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // 基本的な回転
      meshRef.current.rotation.y += 0.005;
      
      // クリック時のアニメーション
      if (isAnimating) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
      }
    }
  });

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    onClick?.();
  };

  return (
    <group onClick={handleClick}>
      {/* ロボットのボディ */}
      <Box ref={meshRef} args={[1.5, 2, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </Box>
      
      {/* ロボットの頭 */}
      <Box args={[1, 1, 0.8]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#7bb8e8" metalness={0.6} roughness={0.2} />
      </Box>
      
      {/* 目 */}
      <Box args={[0.2, 0.2, 0.1]} position={[-0.3, 1.5, 0.5]}>
        <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
      </Box>
      <Box args={[0.2, 0.2, 0.1]} position={[0.3, 1.5, 0.5]}>
        <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
      </Box>
      
      {/* 腕 */}
      <Box args={[0.3, 1.5, 0.3]} position={[-1, 0, 0]}>
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </Box>
      <Box args={[0.3, 1.5, 0.3]} position={[1, 0, 0]}>
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </Box>
    </group>
  );
};

const Robot3D = () => {
  const handleRobotClick = () => {
    console.log('ロボットがクリックされました！');
  };

  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%', 
      height: '100%',
      zIndex: 0
    }}>
      <Canvas 
        camera={{ position: [0, 1, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[0, 10, 5]} intensity={0.4} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#88ccff" />
        <Robot onClick={handleRobotClick} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default Robot3D;