import { EnvironmentPlugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
export default {
  plugins: [
    new EnvironmentPlugin(...Object.keys(process.env)),// This will expose all environment variables to the client
    new Dotenv({ path: './.env' }),
  ],
};
