export enum ENVIRONMENT_ENUM {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === ENVIRONMENT_ENUM.DEVELOPMENT;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === ENVIRONMENT_ENUM.PRODUCTION;
}
