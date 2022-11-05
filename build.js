import { mkdir, rm, cp } from 'node:fs/promises';
import * as path from 'path';
import gencolors from './src/styles-gen/colors.js';
import gendisplay from './src/styles-gen/drac-d.js';
import gencolorvariants from './src/styles-gen/color-variants.js';
import gengradientvariants from './src/styles-gen/gradient-variants.js';

const SRC_DIR = 'src';
const BUILD_DIR = 'build';

const generators = [
  gencolors,
  gendisplay,
  (d) => gencolorvariants(d, 'glow', (color) => {
    return `--glow-color: var(--${color});
  background-color: var(--glow-color);`;
  }),
  (d) => gencolorvariants(d, 'border', (color) => {
    return `border-color: var(--${color});`;
  }),
  (d) => gencolorvariants(d, 'input', (color) => {
    return `--input-border-color: var(--${color});`;
  }),
  (d) => gencolorvariants(d, 'list', (color) => {
    return `color: var(--${color});`;
  }, {
    selector: `li::before`,
  }),
  (d) => gencolorvariants(d, 'scrollbar', (color) => {
    return `--drac-scrollbar-bg: transparent;
--drac-scrollbar-border: var(--${color} -light);
--drac-scrollbar-thumb: var(--${color});
--drac-scrollbar-thumb-hover: var(--${color} -secondary);
overflow: auto;`;
  }),
  (d) => gencolorvariants(d, 'table', (color) => {
    return `border-color: var(--${color});`;
  }, {
    selector: 'td',
  }),
  (d) => gencolorvariants(d, 'table-striped', (color) => {
    return `background-color: var(--${color}-light);`;
  }, {
    selector: 'tr:nth-child(even)',
  }),
  (d) => gencolorvariants(d, 'text', (color) => {
    return `color: var(--${color});`;
  }),
  (d) => gencolorvariants(d, 'text', (color) => {
    return `color: var(--${color}-secondary);`;
  }, {
    suffix: '-secondary',
  }),
  (d) => gencolorvariants(d, 'text', (color) => {
    return `color: var(--${color});`;
  }, {
    suffix: '--hover:hover',
  }),
  (d) => gencolorvariants(d, 'text', (color) => {
    return `color: var(--${color}-secondary);`;
  }, {
    suffix: '-secondary--hover:hover',
  }),
  (d) => gencolorvariants(d, 'bg', (color) => {
    return `background-color: var(--${color});`;
  }),
  (d) => gencolorvariants(d, 'bg', (color) => {
    return `background-color: var(--${color}-secondary);`;
  }, {
    suffix: '-secondary',
  }),
  (d) => gencolorvariants(d, 'bg', (color) => {
    return `background-color: var(--${color}-transparent);`;
  }, {
    suffix: '-transparent',
  }),
  (d) => gengradientvariants(d, 'bg', (from, to) => {
    return `background:
    linear-gradient(
      var(--gradient-degree),
      var(--${from}) 0%,
      var(--${to}) 100%
    );`;
  }),
  (d) => gengradientvariants(d, 'bg', (from, to) => {
    return `background:
    linear-gradient(
      var(--gradient-degree),
      var(--${from}-transparent) 0%,
      var(--${to}-transparent) 100%
    );`;
  }, {
    suffix: '-transparent',
  }),
  (d) => gengradientvariants(d, 'text', (from, to) => {
    return `background-image:
    linear-gradient(
      var(--gradient-degree),
      var(--${from}) 0%,
      var(--${to}) 100%
    );
  background-size: 100%;
  background-clip: text;`;
  }),
  (d) => gengradientvariants(d, 'text', (from, to) => {
    return `background-image:
    linear-gradient(
      var(--gradient-degree),
      var(--${from}) 0%,
      var(--${to}) 100%
    );
  background-size: 100%;
  background-clip: text;`;
  }, {
    suffix: '--hover:hover',
  }),
];

async function generateCSS() {
  const outdir = path.join(BUILD_DIR, 'styles');
  const promises = [];
  for (const g of generators) {
    promises.push(g(outdir));
  }
  await Promise.all(promises);
}

async function start() {
  await rm(BUILD_DIR, {
    recursive: true,
  })
  await mkdir(BUILD_DIR);
  await cp(path.join(SRC_DIR, 'styles'), path.join(BUILD_DIR, 'styles'), {
    recursive: true,
  });

  await generateCSS();
}

start();
