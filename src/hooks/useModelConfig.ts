import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import type { ModelConfig } from '../types/modelConfig';

const defaultConfig: ModelConfig = {
  model: {
    scale: 3.0,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  material: {
    envMapIntensity: 2.0,
    emissiveIntensity: 0.5,
    metalnessScale: 1.2,
    roughnessScale: 0.8,
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
    position: [0, 3, 2],
    fov: 75,
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
        console.log('Fetching YAML from:', '/metabot2/models/metabot.yaml');
        console.log('Response status:', response.status);
        if (response.ok) {
          const yamlText = await response.text();
          console.log('YAML text loaded:', yamlText.substring(0, 200));
          const parsedConfig = yaml.load(yamlText) as any;
          console.log('Parsed YAML config:', parsedConfig);
          // Deep merge to preserve nested structure
          const mergedConfig = {
            ...defaultConfig,
            model: {
              ...defaultConfig.model,
              ...(parsedConfig.model || {}),
            },
            material: {
              ...defaultConfig.material,
              ...(parsedConfig.material || {}),
            },
            animations: {
              ...defaultConfig.animations,
              ...(parsedConfig.animations || {}),
            },
            lighting: {
              ...defaultConfig.lighting,
              ...(parsedConfig.lighting || {}),
              hemisphere: {
                ...defaultConfig.lighting.hemisphere,
                ...(parsedConfig.lighting?.hemisphere || {}),
              },
              ambient: {
                ...defaultConfig.lighting.ambient,
                ...(parsedConfig.lighting?.ambient || {}),
              },
              pointLights: {
                ...defaultConfig.lighting.pointLights,
                ...(parsedConfig.lighting?.pointLights || {}),
                lights: parsedConfig.lighting?.pointLights?.lights || defaultConfig.lighting.pointLights.lights,
              },
              key: {
                ...defaultConfig.lighting.key,
                ...(parsedConfig.lighting?.key || {}),
              },
              fill: {
                ...defaultConfig.lighting.fill,
                ...(parsedConfig.lighting?.fill || {}),
              },
              rim: {
                ...defaultConfig.lighting.rim,
                ...(parsedConfig.lighting?.rim || {}),
              },
              camera: {
                ...defaultConfig.lighting.camera,
                ...(parsedConfig.lighting?.camera || {}),
              },
            },
            camera: {
              ...defaultConfig.camera,
              ...(parsedConfig.camera || {}),
              controls: {
                ...defaultConfig.camera.controls,
                ...(parsedConfig.camera?.controls || {}),
              },
            },
            shadows: {
              ...defaultConfig.shadows,
              ...(parsedConfig.shadows || {}),
              ground: {
                ...defaultConfig.shadows.ground,
                ...(parsedConfig.shadows?.ground || {}),
              },
            },
          };
          console.log('Final merged config:', mergedConfig);
          console.log('Lighting config details:', {
            hemisphere: mergedConfig.lighting.hemisphere,
            ambient: mergedConfig.lighting.ambient,
            pointLights: mergedConfig.lighting.pointLights,
            'pointLights.lights count': mergedConfig.lighting.pointLights.lights.length,
          });
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