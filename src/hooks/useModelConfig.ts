import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import type { ModelConfig } from '../types/modelConfig';

const defaultConfig: ModelConfig = {
  model: {
    scale: 1.0,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  animations: {
    play: [],
    loop: true,
    timeScale: 1.0,
  },
  lighting: {
    hemisphere: {
      enabled: true,
      skyColor: '#ffffff',
      groundColor: '#444444',
      intensity: 1.0,
    },
    ambient: {
      enabled: false,
      intensity: 0.4,
      color: '#ffffff',
    },
    pointLights: {
      enabled: true,
      distance: 10,
      lights: [
        {
          position: [0, 3, 2],
          intensity: 1,
          distance: 10,
          color: '#ffffff',
        },
      ],
    },
    key: {
      enabled: false,
      position: [5, 10, 5],
      intensity: 0.6,
      color: '#ffffff',
      castShadow: true,
    },
    fill: {
      enabled: false,
      position: [-5, 5, -5],
      intensity: 0.3,
      color: '#88ccff',
    },
    rim: {
      enabled: false,
      position: [0, 5, -10],
      intensity: 0.4,
      color: '#ffffff',
    },
    camera: {
      enabled: false,
      intensity: 0.8,
      color: '#ffffff',
    },
  },
  camera: {
    position: [0, 1, 6],
    fov: 45,
    controls: {
      enablePan: false,
      enableZoom: false,
      minPolarAngle: 60,
      maxPolarAngle: 90,
    },
  },
  shadows: {
    enabled: true,
    ground: {
      visible: true,
      position: [0, -2, 0],
      opacity: 0.3,
    },
  },
};

export const useModelConfig = () => {
  const [config, setConfig] = useState<ModelConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/metabot2/models/metabot.yaml');
        if (response.ok) {
          const yamlText = await response.text();
          const parsedConfig = yaml.load(yamlText) as any;
          // Deep merge to preserve nested structure
          const mergedConfig = {
            ...defaultConfig,
            ...parsedConfig,
            lighting: {
              ...defaultConfig.lighting,
              ...parsedConfig.lighting,
            },
            camera: {
              ...defaultConfig.camera,
              ...parsedConfig.camera,
              controls: {
                ...defaultConfig.camera.controls,
                ...(parsedConfig.camera?.controls || {}),
              },
            },
            shadows: {
              ...defaultConfig.shadows,
              ...parsedConfig.shadows,
              ground: {
                ...defaultConfig.shadows.ground,
                ...(parsedConfig.shadows?.ground || {}),
              },
            },
          };
          setConfig(mergedConfig);
        }
      } catch (error) {
        console.log('YAMLファイルが見つからないため、デフォルト設定を使用します');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading };
};