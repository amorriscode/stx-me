import { Config, ConfigOptions } from '../types';

export function mergeConfig(config: Config, configOptions?: ConfigOptions) {
  if (!configOptions) {
    return config;
  }

  return {
    ...config,
    ...configOptions,
    appDetails: {
      ...config.appDetails,
      ...configOptions.appDetails,
    },
  };
}
