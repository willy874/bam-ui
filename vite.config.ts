import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import development from './compile/dev';
import build from './compile/lib';

export default async ({ command, mode }: ConfigEnv): Promise<UserConfig> => {
  const env: Env = loadEnv(mode, process.cwd());
  const config = command === 'serve' ? development(env) : build(env);
  return config;
};
