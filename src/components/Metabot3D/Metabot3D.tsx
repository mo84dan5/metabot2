import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useModelConfig } from '../../hooks/useModelConfig';
import type { ModelConfig } from '../../types/modelConfig';

interface MetabotProps {
  onClick?: () => void;
  config: ModelConfig;
}

// カメラに追従するライト
const CameraLight = ({ config }: { config: ModelConfig['lighting']['camera'] }) => {
  const { camera } = useThree();
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (lightRef.current && config.enabled) {
      lightRef.current.position.copy(camera.position);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  if (!config.enabled) return null;

  return (
    <directionalLight 
      ref={lightRef}
      intensity={config.intensity}
      color={config.color}
      castShadow
    />
  );
};

// GLBモデルを使ったmetabot
const MetabotGLB = ({ onClick, config }: MetabotProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { scene, animations } = useGLTF('/metabot2/models/metabot.glb');
  const { actions } = useAnimations(animations, scene);
  
  // デバッグ用ログ
  useEffect(() => {
    console.log('GLB model loaded:', scene);
    console.log('Model scale config:', config.model.scale);
  }, [scene, config.model.scale]);

  // モデルの変換を適用
  useEffect(() => {
    if (scene) {
      // GLBモデルのsceneに直接スケールを適用（参考コードと同じ方法）
      scene.scale.set(config.model.scale, config.model.scale, config.model.scale);
      
      // 位置
      scene.position.set(...config.model.position);
      
      // 回転（度数法からラジアンに変換）
      scene.rotation.set(
        THREE.MathUtils.degToRad(config.model.rotation[0]),
        THREE.MathUtils.degToRad(config.model.rotation[1]),
        THREE.MathUtils.degToRad(config.model.rotation[2])
      );
      
      // 参考コードと同じように、frustumCulledをfalseに設定
      scene.traverse((object) => {
        object.frustumCulled = false;
      });
    }
  }, [scene, config.model]);

  // アニメーションの再生
  useEffect(() => {
    if (actions) {
      // すべてのアニメーションを停止
      Object.values(actions).forEach(action => action?.stop());

      // 指定されたアニメーションを再生
      if (config.animations.play.length > 0) {
        // 特定のアニメーションのみ再生
        config.animations.play.forEach(animName => {
          const action = actions[animName];
          if (action) {
            action.setLoop(
              config.animations.loop ? THREE.LoopRepeat : THREE.LoopOnce,
              config.animations.loop ? Infinity : 1
            );
            action.timeScale = config.animations.timeScale;
            action.play();
          }
        });
      } else {
        // すべてのアニメーションを再生
        Object.values(actions).forEach(action => {
          if (action) {
            action.setLoop(
              config.animations.loop ? THREE.LoopRepeat : THREE.LoopOnce,
              config.animations.loop ? Infinity : 1
            );
            action.timeScale = config.animations.timeScale;
            action.play();
          }
        });
      }
    }
  }, [actions, config.animations]);

  useFrame((state) => {
    if (scene && isAnimating) {
      // クリック時のバウンスアニメーション
      scene.position.y = config.model.position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
  });

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    onClick?.();
  };

  return (
    <primitive object={scene} onClick={handleClick} />
  );
};

// デフォルトのmetabot（GLBがロードできない場合のフォールバック）
const MetabotDefault = ({ onClick, config }: MetabotProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(config.model.scale);
      meshRef.current.position.set(...config.model.position);
      meshRef.current.rotation.set(
        THREE.MathUtils.degToRad(config.model.rotation[0]),
        THREE.MathUtils.degToRad(config.model.rotation[1]),
        THREE.MathUtils.degToRad(config.model.rotation[2])
      );
    }
  }, [config.model]);

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      meshRef.current.position.y = config.model.position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
  });

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
    onClick?.();
  };

  return (
    <group ref={meshRef} onClick={handleClick}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2, 1]} />
        <meshStandardMaterial color="#5a9fd4" metalness={0.6} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.8]} />
        <meshStandardMaterial color="#7bb8e8" metalness={0.6} roughness={0.2} />
      </mesh>
      
      <mesh position={[-0.3, 1.5, 0.5]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.3, 1.5, 0.5]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>
      
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
const MetabotWithFallback = ({ onClick, config }: MetabotProps) => {
  return (
    <Suspense fallback={<MetabotDefault onClick={onClick} config={config} />}>
      <MetabotGLB onClick={onClick} config={config} />
    </Suspense>
  );
};

// ポイントライトをモデル周囲に配置する関数
const generateLightPositions = (basePosition: [number, number, number], distance: number): [number, number, number][] => {
  const [x, y, z] = basePosition;
  const positions: [number, number, number][] = [];
  
  // 全ての組み合わせを生成（+d, -d, 0）
  const offsets = [distance, -distance, 0];
  
  offsets.forEach(dx => {
    offsets.forEach(dy => {
      offsets.forEach(dz => {
        // 全てが0の場合はスキップ
        if (dx === 0 && dy === 0 && dz === 0) return;
        positions.push([x + dx, y + dy, z + dz]);
      });
    });
  });
  
  return positions;
};

const Metabot3D = () => {
  const { config, loading } = useModelConfig();
  const handleMetabotClick = () => {
    console.log('metabotがクリックされました！');
  };

  if (loading) {
    return <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
  }

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
        camera={{ 
          position: config.camera.position, 
          fov: config.camera.fov 
        }}
        style={{ background: 'transparent' }}
        shadows={config.shadows.enabled}
      >
        {/* 半球ライト */}
        {config.lighting.hemisphere.enabled && (
          <hemisphereLight
            args={[config.lighting.hemisphere.skyColor, config.lighting.hemisphere.groundColor, config.lighting.hemisphere.intensity]}
          />
        )}
        
        {/* 環境光 */}
        {config.lighting.ambient.enabled && (
          <ambientLight 
            intensity={config.lighting.ambient.intensity} 
            color={config.lighting.ambient.color}
          />
        )}
        
        {/* ポイントライト群 */}
        {config.lighting.pointLights.enabled && (
          <>
            {/* 設定で指定されたライト */}
            {config.lighting.pointLights.lights.map((light, index) => (
              <pointLight
                key={`config-light-${index}`}
                position={light.position}
                intensity={light.intensity}
                distance={light.distance}
                color={light.color}
              />
            ))}
            {/* モデル周囲に自動生成されるライト */}
            {generateLightPositions([0, 0, 0], config.lighting.pointLights.distance).map((position, index) => (
              <pointLight
                key={`generated-light-${index}`}
                position={position}
                intensity={1}
                distance={10}
                color="#ffffff"
              />
            ))}
          </>
        )}
        
        {/* キーライト */}
        {config.lighting.key.enabled && (
          <directionalLight 
            position={config.lighting.key.position} 
            intensity={config.lighting.key.intensity} 
            color={config.lighting.key.color}
            castShadow={config.lighting.key.castShadow}
            shadow-mapSize={[2048, 2048]}
          />
        )}
        
        {/* フィルライト */}
        {config.lighting.fill.enabled && (
          <directionalLight 
            position={config.lighting.fill.position} 
            intensity={config.lighting.fill.intensity} 
            color={config.lighting.fill.color}
          />
        )}
        
        {/* リムライト */}
        {config.lighting.rim.enabled && (
          <directionalLight 
            position={config.lighting.rim.position} 
            intensity={config.lighting.rim.intensity} 
            color={config.lighting.rim.color}
          />
        )}
        
        {/* カメラからのライト */}
        <CameraLight config={config.lighting.camera} />
        
        {/* 地面の影 */}
        {config.shadows.enabled && config.shadows.ground.visible && (
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={config.shadows.ground.position} 
            receiveShadow
          >
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={config.shadows.ground.opacity} />
          </mesh>
        )}
        
        <MetabotWithFallback onClick={handleMetabotClick} config={config} />
        
        <OrbitControls 
          enablePan={config.camera.controls.enablePan} 
          enableZoom={config.camera.controls.enableZoom}
          minPolarAngle={THREE.MathUtils.degToRad(config.camera.controls.minPolarAngle)}
          maxPolarAngle={THREE.MathUtils.degToRad(config.camera.controls.maxPolarAngle)}
        />
      </Canvas>
    </div>
  );
};

// GLBモデルのプリロード
useGLTF.preload('/metabot2/models/metabot.glb');

export default Metabot3D;