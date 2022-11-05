import * as  path from 'path';
import {writeFile, mkdir} from 'node:fs/promises';
import {ALL_COLORS} from './config/colors.js';

async function generateCSS(outdir, name, color, cssfn, opts) {
  const selector = `drac-${name}-${color}`
  const rules = cssfn(color);
  const css = `.${selector}${opts.suffix || ''} ${opts.selector || ''} {
  ${rules}
}
`;
  await writeFile(path.join(outdir, `${selector}.css`), css);
}

export default async function generate(outdir, name, cssfn, opts = {}) {
  const dirname = opts.dir || name;
  const bgdir = path.join(outdir, dirname);
  await mkdir(bgdir, {
    recursive: true,
  });

  for (const c of ALL_COLORS) {
    await generateCSS(bgdir, name, c, cssfn, opts);
  }
}
