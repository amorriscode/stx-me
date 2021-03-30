import { AppConfig, UserSession, showConnect } from '@stacks/connect';

export function init(walletAddress: string) {
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });

  function authenticate() {
    showConnect({
      appDetails: {
        name: 'My App',
        icon: window.location.origin + '/my-app-logo.svg',
      },
      redirectTo: '/',
      finished: () => {
        let userData = userSession.loadUserData();
        console.log(userData);
      },
      userSession: userSession,
    });
  }
  console.log(walletAddress);
  authenticate();
}
