import { resolve } from 'path';

export function pathResolve(dir: string | string[], ...dirs: string[]) {
  if (typeof dir === 'string') {
    if (dirs && dirs.length) {
      return resolve(process.cwd(), '.', dir, ...dirs);
    }
    return resolve(process.cwd(), '.', dir);
  }
  return resolve(process.cwd(), '.', ...dir);
}
