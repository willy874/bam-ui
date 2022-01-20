import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import development from './compile/dev-vue';
import build from './compile/lib-vue';

export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log('VITE', command, mode);
  console.log(`http://localhost:3011/`);

  const env = loadEnv(mode, process.cwd());

  if (command === 'serve') {
    return development(env);
  } else {
    return build(env);
  }
};
