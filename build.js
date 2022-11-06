import { mkdir, rm, cp, readFile, writeFile, rmdir } from 'node:fs/promises';
import * as path from 'path';
import gencolors from './src/styles-gen/colors.js';
import gendisplay from './src/styles-gen/drac-d.js';
import gencolorvariants from './src/styles-gen/color-variants.js';
import gengradientvariants from './src/styles-gen/gradient-variants.js';
import gensizevariants from './src/styles-gen/size-variants.js';

import glob from 'glob';
import postcssPresetEnv from 'postcss-preset-env';
import postcss from 'postcss';
import cssnano from 'cssnano';

const SRC_DIR = 'src';
const BUILD_DIR = 'build';

const generators = [
  gencolors,
  gendisplay,

  // Glow
  (d) => gencolorvariants(d, 'glow', (color) => {
    return `--glow-color: var(--${color});
  background-color: var(--glow-color);`;
  }),

  // Border
  (d) => gencolorvariants(d, 'border', (color) => {
    return `border-color: var(--${color});`;
  }),

  // Input
  (d) => gencolorvariants(d, 'input', (color) => {
    return `--input-border-color: var(--${color});`;
  }, {
    state: ':focus'
  }),

  // List
  (d) => gencolorvariants(d, 'list', (color) => {
    return `color: var(--${color});`;
  }, {
    selector: `li::before`,
  }),

  // Scrollbar
  (d) => gencolorvariants(d, 'scrollbar', (color) => {
    return `--drac-scrollbar-bg: transparent;
--drac-scrollbar-border: var(--${color} -light);
--drac-scrollbar-thumb: var(--${color});
--drac-scrollbar-thumb-hover: var(--${color} -secondary);
overflow: auto;`;
  }),

  // Table
  (d) => gencolorvariants(d, 'table', (color) => {
    return `border-color: var(--${color});`;
  }, {
    selector: 'td',
  }),
  (d) => gencolorvariants(d, 'table-striped', (color) => {
    return `background-color: var(--${color}-light);`;
  }, {
    dir: 'table',
    selector: 'tr:nth-child(even)',
  }),

  // Toggle
  (d) => gencolorvariants(d, 'toggle', (color) => {
    return `--active: var(--${color});
    --focus: var(--${color}-secondary);
    --border: var(--${color}-secondary);
    --border-hover: var(--${color});`;
  }),

  // Select
  (d) => gencolorvariants(d, 'select', (color) => {
    return `--border-color: var(--${color});`;
  }),

  // Background
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

  // Tabs
  (d) => gencolorvariants(d, 'tabs', (color) => {
    return `background: var(--${color});
		transform: scaleX(1);
	}

	.drac-tabs-${color} .drac-tab-active .drac-tab-link {
		color: var(--${color});`;
  }, {
    selector: '.drac-tab-active:after',
  }),

  // Text
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

  // Padding
  (d) => gensizevariants(d, 'p', (size) => {
    return `padding: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),
  (d) => gensizevariants(d, 'px', (size) => {
    return `padding-left: var(--spacing-${size});
    padding-right: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),
  (d) => gensizevariants(d, 'py', (size) => {
    return `padding-top: var(--spacing-${size});
    padding-bottom: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),
  (d) => gensizevariants(d, 'pl', (size) => {
    return `padding-left: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),
  (d) => gensizevariants(d, 'pr', (size) => {
    return `padding-right: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),
  (d) => gensizevariants(d, 'pt', (size) => {
    return `padding-top: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),
  (d) => gensizevariants(d, 'pb', (size) => {
    return `padding-bottom: var(--spacing-${size});`;
  }, {
    dir: 'padding',
  }),

  // Margin
  (d) => gensizevariants(d, 'm', (size) => {
    return `margin: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),
  (d) => gensizevariants(d, 'mx', (size) => {
    return `margin-left: var(--spacing-${size});
    margin-right: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),
  (d) => gensizevariants(d, 'my', (size) => {
    return `margin-top: var(--spacing-${size});
    margin-bottom: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),
  (d) => gensizevariants(d, 'ml', (size) => {
    return `margin-left: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),
  (d) => gensizevariants(d, 'mr', (size) => {
    return `margin-right: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),
  (d) => gensizevariants(d, 'mt', (size) => {
    return `margin-top: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),
  (d) => gensizevariants(d, 'mb', (size) => {
    return `margin-bottom: var(--spacing-${size});`;
  }, {
    dir: 'margin',
  }),

  // Height
  (d) => gensizevariants(d, 'h', (size) => {
    return `height: var(--sizing-${size});`;
  }, {
    dir: 'height',
  }),

  // Width
  (d) => gensizevariants(d, 'w', (size) => {
    return `width: var(--sizing-${size});`;
  }, {
    dir: 'width',
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

async function simplifyCSS() {
  const varFiles = glob.sync(path.join(SRC_DIR, '**', 'variables', '*.css'));
  const cssFiles = glob.sync(path.join(BUILD_DIR, '**', '*.css'));
  const plugins = [
    postcssPresetEnv({
      preserve: false,
      importFrom: varFiles,
      autoprefixer: false,
    }),
    cssnano(),
  ];

  const processor = postcss(plugins);
  for (const c of cssFiles) {
    const css = await readFile(c);
    const result = await processor.process(css, { from: c });
    await writeFile(c, result.css);
  }
}

async function start() {
    try {
      await rm(BUILD_DIR, {
        recursive: true,
      })
    } catch  {
      // NOOP
    }
    await mkdir(BUILD_DIR, {
      recursive: true,
    });
    await cp(path.join(SRC_DIR, 'styles'), path.join(BUILD_DIR, 'styles'), {
      recursive: true,
    });
    await rm(path.join(BUILD_DIR, 'styles', 'variables'), {
      recursive: true,
    })

    await generateCSS();

    await simplifyCSS();

}

start();
