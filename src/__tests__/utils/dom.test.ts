import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import * as connect from '@stacks/connect';

import { defaultConfig } from '../../utils/config';

import {
  authenticate,
  injectDonateButton,
  injectDonateInput,
  handleDonation,
  handleDonationError,
  handleDonationSuccess,
} from '../../utils/dom';

jest.mock('@stacks/connect');
const mockedConnect = connect as jest.Mocked<typeof connect>;

beforeEach(() => {
  document.body.appendChild(defaultConfig.container);
});

test('can inject donate button on the DOM', () => {
  injectDonateButton(defaultConfig);

  const donateButton = document.querySelector('.stx-me__button');

  expect(donateButton).toHaveTextContent(defaultConfig.buttonText);
});

test('clears existing container before injecting the donate button', () => {
  console.error = jest.fn();

  const container = document.querySelector('#stx-me');

  const div = document.createElement('div');
  div.classList.add('test-container');
  div.setAttribute('data-testid', 'Test div');
  container?.appendChild(div);

  injectDonateButton(defaultConfig);

  expect(div).not.toBeInTheDocument();
});

test('clicking on donate button injects input', () => {
  // Fake authenticated user
  defaultConfig.userSession.isUserSignedIn = () => true;

  injectDonateButton(defaultConfig);

  userEvent.click(document.querySelector('.stx-me__button') as HTMLDivElement);

  const donateInput = document.querySelector('.stx-me__input');

  expect(donateInput).toBeInTheDocument();

  // Reset authenticated user
  defaultConfig.userSession.isUserSignedIn = () => false;
});

test('clicking on donate button prompts a user to authenticate', () => {
  injectDonateButton(defaultConfig);

  userEvent.click(document.querySelector('.stx-me__button') as HTMLDivElement);

  expect(connect.showConnect).toHaveBeenCalled();
});

test('clicking on donate confirmation button handles a donation', () => {
  // Fake authenticated user
  defaultConfig.userSession.isUserSignedIn = () => true;

  injectDonateInput(defaultConfig);

  userEvent.click(document.querySelector('.stx-me__button') as HTMLDivElement);

  expect(connect.openSTXTransfer).toHaveBeenCalled();

  // Reset authenticated user
  defaultConfig.userSession.isUserSignedIn = () => false;
});

test('displays a wallet address if config is set', () => {
  // Fake authenticated user
  defaultConfig.userSession.isUserSignedIn = () => true;

  // Show wallet address
  defaultConfig.showAddress = true;

  injectDonateInput(defaultConfig);

  const walletAddress = document.querySelector(
    '.stx-me__address'
  ) as HTMLDivElement;

  expect(walletAddress).toBeInTheDocument();
  expect(walletAddress.innerText).toBe(defaultConfig.walletAddress);

  // Reset default config
  defaultConfig.userSession.isUserSignedIn = () => false;
  defaultConfig.showAddress = false;
});

test('clicking on donate confirmation button prompts a user to authenticate', () => {
  injectDonateInput(defaultConfig);

  userEvent.click(document.querySelector('.stx-me__button') as HTMLDivElement);

  expect(connect.showConnect).toHaveBeenCalled();
});

test('handles donation error', () => {
  handleDonationError(defaultConfig, new Error('Transaction failed.'));

  const donateError = document.querySelector(
    '.stx-me__error'
  ) as HTMLParagraphElement;

  expect(donateError).toBeInTheDocument();
  expect(donateError.innerText).toBe('Something went wrong, please try again.');

  // Renders button so user can try again
  const donateButton = document.querySelector('.stx-me__button');

  expect(donateButton).toHaveTextContent(defaultConfig.buttonText);
});

test('handles successful transaction', () => {
  handleDonationSuccess(defaultConfig, '12345');

  const thankYouMessage = document.querySelector(
    '.stx-me__thank-you'
  ) as HTMLParagraphElement;

  expect(thankYouMessage.innerText).toBe(defaultConfig.successMessage);

  const transactionLink = document.querySelector(
    '.stx-me__transaction-link'
  ) as HTMLAnchorElement;

  expect(transactionLink.innerText).toBe('View your transaction');
  expect(transactionLink.href).toBe(
    `https://explorer.stacks.co/txid/12345?chain=${defaultConfig.network}`
  );
});

test('injects donation input after successful authentication', () => {
  mockedConnect.showConnect.mockImplementation(({ onFinish }) => {
    if (onFinish)
      onFinish({
        authResponse: 'success',
        userSession: defaultConfig.userSession,
      });
  });

  authenticate(defaultConfig);

  const donateInput = document.querySelector('.stx-me__input');

  expect(donateInput).toBeInTheDocument();
});

test('injects donation success after successful transaction', async () => {
  // Fake authenticated user
  defaultConfig.userSession.isUserSignedIn = () => true;

  mockedConnect.openSTXTransfer.mockImplementation(({ onFinish }) => {
    if (onFinish) {
      // @ts-ignore
      onFinish({ txRaw: '12345', txId: '12345' });
    }

    return Promise.resolve();
  });

  handleDonation(defaultConfig);

  const thankYouMessage = document.querySelector(
    '.stx-me__thank-you'
  ) as HTMLParagraphElement;

  expect(thankYouMessage.innerText).toBe(defaultConfig.successMessage);

  // Reset authenticated user
  defaultConfig.userSession.isUserSignedIn = () => false;
});

test('handles an error when sending transaction', () => {
  // Fake authenticated user
  defaultConfig.userSession.isUserSignedIn = () => true;

  mockedConnect.openSTXTransfer.mockImplementation(() => {
    throw new Error('Transaction failed.');
  });

  handleDonation(defaultConfig);

  const donateError = document.querySelector(
    '.stx-me__error'
  ) as HTMLParagraphElement;

  expect(donateError).toBeInTheDocument();
  expect(donateError.innerText).toBe('Something went wrong, please try again.');

  // Reset authenticated user
  defaultConfig.userSession.isUserSignedIn = () => false;
});

test('handles both mainnet and testnet connections', () => {
  // Fake authenticated user
  defaultConfig.userSession.isUserSignedIn = () => true;

  mockedConnect.openSTXTransfer.mockImplementationOnce(({ network }) => {
    expect(network?.isMainnet()).toBe(false);

    return Promise.resolve();
  });

  handleDonation(defaultConfig);

  defaultConfig.network = 'mainnet';

  mockedConnect.openSTXTransfer.mockImplementationOnce(({ network }) => {
    expect(network?.isMainnet()).toBe(true);

    return Promise.resolve();
  });

  handleDonation(defaultConfig);

  // Reset authenticated user
  defaultConfig.userSession.isUserSignedIn = () => false;
});
