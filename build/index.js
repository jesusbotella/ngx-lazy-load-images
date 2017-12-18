'use strict';

// Node Dependencies
const path = require('path');
const camelCase = require('camelcase');

// Compilation Dependencies
const ngc = require('@angular/compiler-cli/src/main').main;
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Utils
const inlineResources = require('./inline-resources');
const relativeCopy = require('./utils').relativeCopy;

// Scaffolding Paths
const libName = require('../package.json').name;
const rootFolder = path.join(__dirname);
const compilationFolder = path.join(rootFolder, 'out-tsc');
const srcFolder = path.join(rootFolder, '../lib');
const distFolder = path.join(rootFolder, '../dist');
const tempLibFolder = path.join(compilationFolder, 'lib');
const es5OutputFolder = path.join(compilationFolder, 'lib-es5');
const es2015OutputFolder = path.join(compilationFolder, 'lib-es2015');

return Promise.resolve()
  .then(() => 
    // Copy library to temporary folder and inline html/css.
    relativeCopy(`**/*`, srcFolder, tempLibFolder)
    .then(() => inlineResources(tempLibFolder))
    .then(() => console.log('Inlining succeeded.'))
  )
  .then(() =>
    // TypeScript Compilation
    Promise.all([
      ngc({ project: `${tempLibFolder}/tsconfig.lib.json` }), // Compile to ES2015.
      ngc({ project: `${tempLibFolder}/tsconfig.es5.json` }) // Compile to ES5.
    ])
    .then(([es2015ExitCode, es5ExitCode]) => 
      es2015ExitCode === 0 && es5ExitCode === 0 ?
        Promise.resolve() : Promise.reject()
    )
    .then(() => console.log('TypeScript compilation succeeded.'))
  )
  .then(() =>
    // Copy typings and metadata to `dist/` folder.
    relativeCopy('**/*.d.ts', es2015OutputFolder, distFolder)
    .then(() => relativeCopy('**/*.metadata.json', es2015OutputFolder, distFolder))
    .then(() => console.log('Typings and metadata copy succeeded.'))
  )
  .then(() => {
    // Bundle lib.

    // Base configuration.
    const es5Entry = path.join(es5OutputFolder, `${libName}.js`);
    const es2015Entry = path.join(es2015OutputFolder, `${libName}.js`);

    const webpackBaseConfig = {
      output: {
        library: camelCase(libName)
      },
      devtool: 'source-map',
      externals: [/^@angular\//]
    };

    // UMD bundle.
    const umdConfig = Object.assign({}, webpackBaseConfig, {
      entry: es5Entry,
      output: {
        path: path.join(distFolder, 'bundles'),
        filename: `${libName}.umd.js`,
        libraryTarget: 'umd'
      }
    });

    // Minified UMD bundle.
    const minifiedUmdConfig = Object.assign({}, webpackBaseConfig, {
      entry: es5Entry,
      output: {
        path: path.join(distFolder, 'bundles'),
        filename: `${libName}.umd.min.js`,
        libraryTarget: 'umd'
      },
      plugins: [
        new UglifyJsPlugin({sourceMap: true})
      ]
    });

    // ESM+ES5 flat module bundle.
    const fesm5config = Object.assign({}, webpackBaseConfig, {
      entry: es5Entry,
      output: {
        path: path.join(distFolder),
        filename: `${libName}.es5.js`,
      }
    });

    // ESM+ES2015 flat module bundle.
    const fesm2015config = Object.assign({}, webpackBaseConfig, {
      entry: es2015Entry,
      output: {
        path: path.join(distFolder),
        filename: `${libName}.js`,
      }
    });

    const allBundles = [
      umdConfig,
      minifiedUmdConfig,
      fesm5config,
      fesm2015config
    ]

    return new Promise((resolve, reject) => {
      webpack(allBundles, (err, stats) => {
        if (err) {
          reject(err);
        }

        resolve(stats);
      });
    })
    .then(() => console.log('All bundles generated successfully.'))
  })
  .then(() => 
    // Copy package files
    relativeCopy('LICENSE', rootFolder, distFolder)
    .then(() => relativeCopy('package.json', rootFolder, distFolder))
    .then(() => relativeCopy('README.md', rootFolder, distFolder))
    .then(() => console.log('Package files copy succeeded.'))
  )
  .catch(err => {
    console.error('\Build failed. See below for errors.\n');
    console.error(err);
    process.exit(1);
  });