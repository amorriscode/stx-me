import { AppConfig, UserSession } from '@stacks/connect';

import { Config, ConfigOptions } from '../types';

const container = document.createElement('div');
container.id = 'stx-me';

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const defaultConfig: Config = {
  showAddress: false,
  appDetails: {
    name: `${document.title}`,
    icon: '/favicon.ico',
  },
  buttonText: 'Send Me STX',
  successMessage: 'Thanks for your donation!',
  walletAddress: 'INVALID_WALLET_ADDRESS',
  network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
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
