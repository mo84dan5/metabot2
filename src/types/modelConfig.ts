export interface ModelConfig {
  model: {
    scale: number;
    position: [number, number, number];
    rotation: [number, number, number];
  };
  material?: {
    envMapIntensity?: number;
    emissiveIntensity?: number;
    metalnessScale?: number;
    roughnessScale?: number;
  };
  animations: {
    play: string[];
    loop: boolean;
    timeScale: number;
  };
  lighting: {
    hemisphere: {
      enabled: boolean;
      skyColor: string;
      groundColor: string;
      intensity: number;
    };
    ambient: {
      enabled: boolean;
      intensity: number;
      color: string;
    };
    pointLights: {
      enabled: boolean;
      distance: number;
      lights: Array<{
        position: [number, number, number];
        intensity: number;
        distance: number;
        color: string;
      }>;
    };
    key: {
      enabled: boolean;
      position: [number, number, number];
      intensity: number;
      color: string;
      castShadow: boolean;
    };
    fill: {
      enabled: boolean;
      position: [number, number, number];
      intensity: number;
      color: string;
    };
    rim: {
      enabled: boolean;
      position: [number, number, number];
      intensity: number;
      color: string;
    };
    camera: {
      enabled: boolean;
      intensity: number;
      color: string;
    };
  };
  camera: {
    position: [number, number, number];
    fov: number;
    controls: {
      enablePan: boolean;
      enableZoom: boolean;
      minPolarAngle: number;
      maxPolarAngle: number;
    };
  };
  shadows: {
    enabled: boolean;
    ground: {
      visible: boolean;
      position: [number, number, number];
      opacity: number;
    };
  };
  rendering?: {
    toneMapping?: 'NoTone' | 'Linear' | 'Reinhard' | 'Cineon' | 'ACESFilmic';
    toneMappingExposure?: number;
    environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
    environmentEnabled?: boolean;
  };
}