import { AppConfig, UserSession } from '@stacks/connect';

import { Config, ConfigOptions } from '../types';

const container = document.createElement('div');
container.id = 'stx-me';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const defaultConfig: Config = {
  showAddress: true,
  appDetails: { name: 'STX Me', icon: '' },
  buttonText: 'Send Me STX',
  successMessage: 'Thanks for your donation!',
  walletAddress: '12345678910',
  network: 'testnet',
  container,
  userSession: new UserSession({ appConfig }),
};

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
