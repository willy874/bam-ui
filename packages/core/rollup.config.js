import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript2'
import cleaner from 'rollup-plugin-cleaner';
import scss from 'rollup-plugin-scss'
import postcss from 'rollup-plugin-postcss-modules'
import dts from 'rollup-plugin-dts';
import autoprefixer from 'autoprefixer'

const plugins = [
  image(),
  typescript(),
  resolve(),
  commonjs(),
  scss()
]
const external = ['bam-utility-plugin']

export default [{
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm'
    },
    plugins: [
      ...plugins,
      cleaner({
        targets: ['dist']
      }),
      postcss({
        plugins: [autoprefixer()],
        extract: true,
        modules: {}
      })
    ],
    external
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    plugins,
    external
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'bam-ui',
      file: 'dist/index.umd.js',
      format: 'umd'
    },
    plugins,
    external
  },
  {
    input: 'src/packages/index.ts',
    output: [{
      file: "dist/types.d.ts",
      format: "es"
    }],
    plugins: [dts()],
    external
  },
]