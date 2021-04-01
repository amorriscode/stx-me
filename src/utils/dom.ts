import { showConnect, FinishedTxData, openSTXTransfer } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

import { Config } from '../types';

export function authenticate(config: Config) {
  const { appDetails, userSession } = config;

  showConnect({
    appDetails,
    onFinish: () => injectDonateInput(config),
    userSession,
  });
}

export async function handleDonation(config: Config) {
  const { userSession, walletAddress, network } = config;

  // Make sure the user is authenticated
  if (!userSession.isUserSignedIn()) {
    authenticate(config);
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
      recipient: walletAddress,
      amount,
      memo: 'STX Me Donation',
      network:
        network === 'mainnet' ? new StacksMainnet() : new StacksTestnet(),
      appDetails: config.appDetails,
      onFinish: ({ txId }: FinishedTxData) =>
        handleDonationSuccess(config, txId),
    });
  } catch (error) {
    handleDonationError(config, error);
  }
}

export function handleDonationSuccess(config: Config, txId: string) {
  const { container, network } = config;

  // Clear the container
  container.innerHTML = '';

  const thankYouMessage = document.createElement('p');
  thankYouMessage.classList.add('stx-me__thank-you');
  thankYouMessage.innerText = config.successMessage;

  const transactionLink = document.createElement('a');
  transactionLink.classList.add('stx-me__transaction-link');
  transactionLink.innerText = 'View your transaction';
  transactionLink.href = `https://explorer.stacks.co/txid/${txId}?chain=${network}`;
  transactionLink.target = '_blank';

  container.appendChild(thankYouMessage);
  container.appendChild(transactionLink);
}

export function handleDonationError(config: Config, error: any) {
  const { container } = config;

  console.error(error);

  injectDonateButton(config);

  const errorMessage = document.createElement('p');
  errorMessage.classList.add('stx-me__error');
  errorMessage.innerText = 'Something went wrong, please try again.';

  container.prepend(errorMessage);
}

export function injectDonateInput(config: Config) {
  const { container } = config;

  // Clear the container
  container.innerHTML = '';

  const donationAmountInput = document.createElement('input');
  donationAmountInput.classList.add('stx-me__input');
  donationAmountInput.type = 'number';
  donationAmountInput.placeholder = '0.000000 STX';

  const signTransactionButton = document.createElement('button');
  signTransactionButton.classList.add('stx-me__button');
  signTransactionButton.classList.add('donate');
  signTransactionButton.innerHTML = 'Donate';

  container.appendChild(donationAmountInput);

  container.appendChild(signTransactionButton);
  signTransactionButton.addEventListener('click', () => handleDonation(config));
}

export function injectDonateButton(config: Config) {
  const { container, buttonText, userSession } = config;

  // Clear the container
  container.innerHTML = '';

  const donateButton = document.createElement('button');
  donateButton.classList.add('stx-me__button');
  donateButton.innerHTML = buttonText;

  function handleClick() {
    // Make sure the user is authenticated
    if (!userSession.isUserSignedIn()) {
      authenticate(config);
      return;
    }

    injectDonateInput(config);
  }

  container.appendChild(donateButton);
  donateButton.addEventListener('click', handleClick);
}
