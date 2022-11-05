import * as  path from 'path';
import {writeFile, mkdir} from 'node:fs/promises';

const SIZES = ['none', 'xxs', 'xs', 'sm', 'md', 'lg'];

async function generateCSS(outdir, name, size, cssfn, opts) {
  const selector = `drac-${name}-${size}${opts.suffix || ''}`
  const rules = cssfn(size);
  const css = `.${selector} ${opts.selector || ''} {
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

  for (const s of SIZES) {
    await generateCSS(bgdir, name, s, cssfn, opts);
  }
}
