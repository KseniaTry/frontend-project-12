export const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN || '', 
  environment: import.meta.env.VITE_ENVIRONMENT || 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
};
