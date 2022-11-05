import * as  path from 'path';
import {writeFile, mkdir} from 'node:fs/promises';
import {FROM_COLORS, TO_COLORS} from './config/colors.js';

async function generateCSS(outdir, name, from, to, cssfn, opts) {
  const selector = `drac-${name}-${from}-${to}`
  const css = `.${selector}${opts.suffix || ''} ${opts.selector || ''} {
  ${cssfn(from, to)}
}
`;
  await writeFile(path.join(outdir, `${selector}.css`), css);
}

export default async function generate(outdir, name, cssfn, opts = {}) {
  const bgdir = path.join(outdir, name);
  await mkdir(bgdir, {
    recursive: true,
  });

  for (let i = 0; i < FROM_COLORS.length; i++) {
    const from = FROM_COLORS[i];
    const to = TO_COLORS[i];
    await generateCSS(bgdir, name, from, to, cssfn, opts);
  }
}
