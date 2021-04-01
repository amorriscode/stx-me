import '@testing-library/jest-dom';

import { defaultConfig } from '../utils/config';
import * as domUtils from '../utils/dom';
import { me } from '../index';

jest.mock('../utils/dom');
const mockedDomUtils = domUtils as jest.Mocked<typeof domUtils>;

test('logs an error and stops execution if no wallet address provided', () => {
  console.error = jest.fn();

  // @ts-ignore
  me();

  expect(console.error).toHaveBeenCalledWith('No STX donation address exists.');
});

test('logs an error and stops execution if STX Me container not found', () => {
  console.error = jest.fn();

  // @ts-ignore
  me('12345');

  expect(console.error).toHaveBeenCalledWith('STX Me container not found.');
});

test('injects donate button upon initialization', () => {
  document.body.appendChild(defaultConfig.container);

  me('12345');

  expect(mockedDomUtils.injectDonateButton).toHaveBeenCalled();
});

test('sets the passed wallet address in the config', () => {
  const walletAddress = '12345';

  me(walletAddress);

  expect(mockedDomUtils.injectDonateButton).toHaveBeenCalledWith({
    ...defaultConfig,
    walletAddress,
  });
});
