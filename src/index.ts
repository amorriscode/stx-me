import { AppConfig, UserSession } from '@stacks/connect';

import { Config, ConfigOptions } from './types';
import { mergeConfig } from './utils/config';
import { injectDonateButton } from './utils/dom';

export function me(walletAddress: string, configOptions?: ConfigOptions) {
  // Ensure the STX Me container exists on the DOM
  const stxMeContainer = document.querySelector('#stx-me') as HTMLDivElement;
  if (!stxMeContainer) {
    console.error('STX Me container not found.');
    return;
  }

  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const defaultConfig: Config = {
    showAddress: true,
    appDetails: { name: 'STX Me', icon: '' },
    buttonText: 'Send Me STX',
    successMessage: 'Thanks for your donation!',
    walletAddress,
    network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
    container: stxMeContainer,
    userSession: new UserSession({ appConfig }),
  };

  const config = mergeConfig(defaultConfig, configOptions);

  injectDonateButton(config);
}
