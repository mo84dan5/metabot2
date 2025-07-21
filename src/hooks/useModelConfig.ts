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
    ambient: {
      intensity: 0.4,
      color: '#ffffff',
    },
    key: {
      position: [5, 10, 5],
      intensity: 0.6,
      color: '#ffffff',
      castShadow: true,
    },
    fill: {
      position: [-5, 5, -5],
      intensity: 0.3,
      color: '#88ccff',
    },
    rim: {
      position: [0, 5, -10],
      intensity: 0.4,
      color: '#ffffff',
    },
    camera: {
      enabled: true,
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
          const parsedConfig = yaml.load(yamlText) as ModelConfig;
          setConfig({ ...defaultConfig, ...parsedConfig });
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