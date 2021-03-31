import {
  AppConfig,
  UserSession,
  showConnect,
  FinishedTxData,
} from '@stacks/connect';
import { openSTXTransfer } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

import { Config, ConfigOptions } from './types';

const stacksNetwork =
  process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';

let stxMeContainer: HTMLDivElement | null = null;
let donationAddress: string | null = null;

let config: Config = {
  showAddress: true,
  appDetails: { name: 'STX Me', icon: '' },
  buttonText: 'Send Me STX',
  successMessage: 'Thanks for your donation!',
};

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: config.appDetails,
    finished: injectDonateInput,
    userSession: userSession,
  });
}

function handleDonationSuccess({ txId }: FinishedTxData) {
  if (!stxMeContainer) {
    return;
  }

  // Clear the container
  stxMeContainer.innerHTML = '';

  const thankYouMessage = document.createElement('p');
  thankYouMessage.classList.add('stx-me__thank-you');
  thankYouMessage.innerText = config.successMessage;

  const transactionLink = document.createElement('a');
  transactionLink.classList.add('stx-me__transaction-link');
  transactionLink.innerText = 'View your transaction';
  transactionLink.href = `https://explorer.stacks.co/txid/${txId}?chain=${stacksNetwork}`;
  transactionLink.target = '_blank';

  stxMeContainer.appendChild(thankYouMessage);
  stxMeContainer.appendChild(transactionLink);
}

function handleDonationError(error: any) {
  console.error(error);

  if (!stxMeContainer) {
    return;
  }

  injectDonateButton();

  const errorMessage = document.createElement('p');
  errorMessage.classList.add('stx-me__error');
  errorMessage.innerText = 'Something went wrong, please try again.';

  stxMeContainer.prepend(errorMessage);
}

function handleDonation() {
  // Make sure the user is authenticated
  if (!userSession.isUserSignedIn()) {
    authenticate();
    return;
  }

  if (!donationAddress) {
    console.error('No STX donation address exists.');
    return;
  }

  const donationInput = document.querySelector(
    '#stx-me .stx-me__input'
  ) as HTMLInputElement;

  // Convert HTML input value into a donation amount
  // 1 STX --> 1,000,000 microstacks
  // https://docs.blockstack.org/build-apps/guides/transaction-signing#prompt-to-transfer-stx
  const amount = `${(Number.parseFloat(donationInput?.value) || 0) * 1000000}`;

  try {
    openSTXTransfer({
      recipient: donationAddress,
      amount,
      memo: 'STX Me Donation',
      network:
        stacksNetwork === 'mainnet' ? new StacksMainnet() : new StacksTestnet(),
      appDetails: config.appDetails,
      onFinish: handleDonationSuccess,
    });
  } catch (error) {
    handleDonationError(error);
  }
}

function injectDonateInput() {
  // Make sure the user is authenticated
  if (!userSession.isUserSignedIn()) {
    authenticate();
    return;
  }

  if (!stxMeContainer) {
    return;
  }

  // Clear the container
  stxMeContainer.innerHTML = '';

  const donationAmountInput = document.createElement('input');
  donationAmountInput.classList.add('stx-me__input');
  donationAmountInput.type = 'number';
  donationAmountInput.placeholder = '0.000000 STX';

  const signTransactionButton = document.createElement('button');
  signTransactionButton.classList.add('stx-me__button');
  signTransactionButton.classList.add('donate');
  signTransactionButton.innerHTML = 'Donate';

  stxMeContainer.appendChild(donationAmountInput);

  stxMeContainer.appendChild(signTransactionButton);
  signTransactionButton.addEventListener('click', handleDonation);
}

function injectDonateButton() {
  if (!stxMeContainer) {
    return;
  }

  // Clear the container
  stxMeContainer.innerHTML = '';

  const donateButton = document.createElement('button');
  donateButton.classList.add('stx-me__button');
  donateButton.innerHTML = config.buttonText;

  stxMeContainer.appendChild(donateButton);
  donateButton.addEventListener('click', injectDonateInput);
}

function mergeConfig(config: Config, configOptions?: ConfigOptions) {
  if (!configOptions) {
    return;
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

export function me(walletAddress: string, configOptions?: ConfigOptions) {
  // Store the wallet address that will receive donations
  donationAddress = walletAddress;

  // Ensure the STX Me container exists on the DOM
  stxMeContainer = document.querySelector('#stx-me');
  if (!stxMeContainer) {
    console.error('STX Me container not found.');
    return;
  }

  mergeConfig(config, configOptions);

  injectDonateButton();
}
