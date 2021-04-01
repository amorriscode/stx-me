import { ConfigOptions } from './types';
import { mergeConfig, defaultConfig } from './utils/config';
import { injectDonateButton } from './utils/dom';

export function me(walletAddress: string, configOptions?: ConfigOptions) {
  // Ensure we have a wallet address
  if (!walletAddress) {
    console.error('No STX donation address exists.');
    return;
  }

  // Ensure the STX Me container exists on the DOM
  const container = document.querySelector('#stx-me') as HTMLDivElement;
  if (!container) {
    console.error('STX Me container not found.');
    return;
  }

  const config = mergeConfig({ ...defaultConfig, container }, configOptions);

  injectDonateButton(config);
}
