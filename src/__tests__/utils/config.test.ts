import { mergeConfig, defaultConfig } from '../../utils/config';

test('does not modify config without options', () => {
  const config = mergeConfig(defaultConfig);

  for (const key of Object.keys(config)) {
    expect(config[key]).toStrictEqual(defaultConfig[key]);
  }
});

test('can modify options', () => {
  const successMessage = 'Thanks for testing!';
  const config = mergeConfig(defaultConfig, {
    showAddress: false,
    successMessage,
  });

  for (const key of Object.keys(config)) {
    switch (key) {
      case 'showAddress':
        expect(config[key]).toBe(false);
        break;
      case 'successMessage':
        expect(config[key]).toBe(successMessage);
        break;
      default:
        expect(config[key]).toStrictEqual(defaultConfig[key]);
    }
  }
});

test('can modify appDetails', () => {
  const appDetails = { name: 'Test App', icon: 'test.ico' };
  const config = mergeConfig(defaultConfig, { appDetails });

  for (const key of Object.keys(config)) {
    if (key === 'appDetails') {
      expect(config[key]).toStrictEqual(appDetails);
    } else {
      expect(config[key]).toStrictEqual(defaultConfig[key]);
    }
  }
});
