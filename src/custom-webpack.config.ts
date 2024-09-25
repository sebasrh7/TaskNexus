import { EnvironmentPlugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
export default {
  plugins: [new EnvironmentPlugin(...Object.keys(process.env)), new Dotenv()],
};
