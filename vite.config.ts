import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import development from './compile/dev';
import build from './compile/lib';

export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log(`http://localhost:3011/`);

  const env: Env = loadEnv(mode, process.cwd());

  if (command === 'serve') {
    return development(env);
  } else {
    return build(env);
  }
};
