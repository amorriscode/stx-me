import '@testing-library/jest-dom';

import { defaultConfig } from '../utils/config';

import { me } from '../index';

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

  const donateButton = document.querySelector('.stx-me__button');

  expect(donateButton).toHaveTextContent(defaultConfig.buttonText);
});
