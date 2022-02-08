import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import development from './build/dev';
import build from './build/lib';

export default async ({ command, mode }: ConfigEnv): Promise<UserConfig> => {
  const env: Env = loadEnv(mode, process.cwd());
  const config = command === 'serve' ? development(env) : build(env);
  return config;
};
