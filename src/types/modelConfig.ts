export interface ModelConfig {
  model: {
    scale: number;
    position: [number, number, number];
    rotation: [number, number, number];
  };
  animations: {
    play: string[];
    loop: boolean;
    timeScale: number;
  };
  lighting: {
    ambient: {
      intensity: number;
      color: string;
    };
    key: {
      position: [number, number, number];
      intensity: number;
      color: string;
      castShadow: boolean;
    };
    fill: {
      position: [number, number, number];
      intensity: number;
      color: string;
    };
    rim: {
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
}