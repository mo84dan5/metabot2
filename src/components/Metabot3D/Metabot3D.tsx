import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface MetabotProps {
  onClick?: () => void;
}

// カメラに追従するライト
const CameraLight = () => {
  const { camera } = useThree();
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <directionalLight 
        ref={lightRef}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
    </>
  );
};

// GLBモデルを使ったmetabot
const MetabotGLB = ({ onClick }: MetabotProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { scene, animations } = useGLTF('/metabot2/models/metabot.glb');
  const { actions } = useAnimations(animations, scene);

  // アニメーションの再生
  useEffect(() => {
    // すべてのアニメーションを再生（存在する場合）
    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) {
          action.play();
        }
      });
    }
  }, [actions]);

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      // クリック時のバウンスアニメーション
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
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
        <primitive object={scene} scale={1} />
      </group>
    </Center>
  );
};

// デフォルトのmetabot（GLBがロードできない場合のフォールバック）
const MetabotDefault = ({ onClick }: MetabotProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      // クリック時のバウンスアニメーション
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
  });

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    onClick?.();
  };

  return (
    <group ref={meshRef} onClick={handleClick}>
      {/* metabotのボディ */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2, 1]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* metabotの頭 */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
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
      <mesh position={[-1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
};

// エラーバウンダリーで包まれたMetabot
const MetabotWithFallback = ({ onClick }: MetabotProps) => {
  return (
    <Suspense fallback={<MetabotDefault onClick={onClick} />}>
      <MetabotGLB onClick={onClick} />
    </Suspense>
  );
};

const Metabot3D = () => {
  const handleMetabotClick = () => {
    console.log('metabotがクリックされました！');
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
        shadows
      >
        {/* 環境光 */}
        <ambientLight intensity={0.4} />
        
        {/* キーライト（上から） */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.6} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* フィルライト（横から） */}
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.3} 
          color="#88ccff" 
        />
        
        {/* リムライト（後ろから） */}
        <directionalLight 
          position={[0, 5, -10]} 
          intensity={0.4} 
          color="#ffffff" 
        />
        
        {/* カメラからのライト */}
        <CameraLight />
        
        {/* 地面の影用プレーン（オプション） */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        
        <MetabotWithFallback onClick={handleMetabotClick} />
        
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

// GLBモデルのプリロード
useGLTF.preload('/metabot2/models/metabot.glb');

export default Metabot3D;