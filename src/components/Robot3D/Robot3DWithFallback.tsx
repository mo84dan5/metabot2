import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface RobotProps {
  onClick?: () => void;
  modelPath: string;
}

type GLTFResult = GLTF & {
  nodes: any;
  materials: any;
};

const RobotModel = ({ onClick, modelPath }: RobotProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const gltf = useGLTF(modelPath) as GLTFResult;

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
    <Center>
      <group ref={meshRef} onClick={handleClick}>
        <primitive object={gltf.scene} scale={1} />
      </group>
    </Center>
  );
};

// デフォルトのロボット（GLBがない場合のフォールバック）
const DefaultRobot = ({ onClick }: { onClick?: () => void }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
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
    <group ref={meshRef} onClick={handleClick}>
      {/* ロボットのボディ */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2, 1]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* ロボットの頭 */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1, 1, 0.8]} />
        <meshStandardMaterial color="#7bb8e8" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* 目 */}
      <mesh position={[-0.3, 1.5, 0.5]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.3, 1.5, 0.5]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>
      
      {/* 腕 */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
};

interface Robot3DWithFallbackProps {
  modelPath?: string;
  onRobotClick?: () => void;
}

const Robot3DWithFallback = ({ 
  modelPath = '/metabot2/models/robot.glb',
  onRobotClick = () => console.log('ロボットがクリックされました！')
}: Robot3DWithFallbackProps) => {
  const [useDefaultModel, setUseDefaultModel] = useState(false);

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
        onError={() => setUseDefaultModel(true)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[0, 10, 5]} intensity={0.4} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#88ccff" />
        
        {useDefaultModel ? (
          <DefaultRobot onClick={onRobotClick} />
        ) : (
          <RobotModel onClick={onRobotClick} modelPath={modelPath} />
        )}
        
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

export default Robot3DWithFallback;