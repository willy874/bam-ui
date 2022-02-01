import 'colors'
import {
  rollup
} from 'rollup';
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript2'
import cleaner from 'rollup-plugin-cleaner';
import scss from 'rollup-plugin-scss'
import postcss from 'rollup-plugin-postcss-modules'
import dts from 'rollup-plugin-dts';
import autoprefixer from 'autoprefixer'
import path from 'path';
import fs from 'fs';

const root = process.cwd()
const outputDir = path.join(root, 'dist')


async function build(input, output, callback) {
  let bundle;
  let buildFailed = false;
  try {
    const bundle = await rollup(input);
    await generateOutputs(bundle, output, callback);
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }
  if (bundle) {
    await bundle.close();
  }
  if (buildFailed) {
    process.exit(1);
  }
}

async function generateOutputs(bundle, output, callback) {
  for (const outputOptions of output) {
    const chunkData = await bundle.generate(outputOptions);
    for (const chunk of chunkData.output) {
      if (chunk.type === 'asset') {
        // 
      } else {
        await callback(chunk)
      }
    }
  }
}

const plugins = [
  image(),
  typescript(),
  resolve(),
  commonjs()
]

const indexInputOption = {
  input: path.join(root, 'src', 'index.ts'),
  plugins: [
    ...plugins,
    scss(),
    cleaner({
      targets: ['dist']
    }),
    postcss.default({
      plugins: [autoprefixer()],
      extract: true,
      modules: {}
    })
  ]
}

const outputOption = {
  name: 'bam-ui',
  file: path.join(root, 'dist', 'index.js'),
  format: 'esm'
}

const inputOptions = {
  input: path.join(root, 'src', 'packages', 'index.ts'),
  plugins,
};

const outputOptionsList = [{
    name: 'bam-ui',
    file: path.join(root, 'dist', 'index.cjs.js'),
    format: 'cjs'
  },
  {
    name: 'bam-ui',
    file: path.join(root, 'dist', 'index.umd.js'),
    format: 'umd'
  },
  {
    name: 'bam-ui',
    file: path.join(root, 'dist', 'index.esm.js'),
    format: 'esm'
  }
];



const typeInputOptions = {
  input: path.join(root, 'src', 'packages', 'index.ts'),
  plugins: [dts()],
};

const typeOutputOption = {
  name: 'bam-ui',
  file: "dist/types.d.ts",
  format: "es"
}

export default async function main() {
  try {
    await build(indexInputOption, [outputOption], async (chunk) => {
      if (!fs.existsSync(outputDir)) {
        await fs.promises.mkdir(outputDir)
      }
      await fs.promises.writeFile(path.join(outputDir, chunk.fileName), chunk.code)
      console.log(`Bundle ${chunk.fileName} build.`.blue);
    });

    await build(inputOptions, outputOptionsList, async (chunk) => {
      await fs.promises.writeFile(path.join(outputDir, chunk.fileName), chunk.code)
      console.log(`Bundle ${chunk.fileName} build.`.blue);
    });

    await build(typeInputOptions, [typeOutputOption], async (chunk) => {
      await fs.promises.writeFile(path.join(outputDir, chunk.fileName), chunk.code)
      console.log(`Bundle ${chunk.fileName} build.`.blue);
    });
  } catch (error) {
    console.log(error);
  }
}