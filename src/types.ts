export interface AppDetails {
  name: string;
  icon: string;
}

export interface ConfigOptions {
  showAddress?: boolean;
  appDetails?: AppDetails;
  successMessage?: string;
}

export interface Config {
  showAddress: boolean;
  appDetails: AppDetails;
  successMessage: string;
}
