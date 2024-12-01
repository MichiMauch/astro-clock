import './loadEnv.js';

export default {
  env: {
    IPGEOLOCATION_API_KEY: process.env.IPGEOLOCATION_API_KEY,
    ASTRONOMY_APP_ID: process.env.ASTRONOMY_APP_ID,
    ASTRONOMY_APP_SECRET: process.env.ASTRONOMY_APP_SECRET,
  },
  // ...existing code...
};
