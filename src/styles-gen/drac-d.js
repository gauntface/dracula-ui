import * as  path from 'path';
import {writeFile, mkdir} from 'node:fs/promises';

const DISPLAYS = ['none', 'block', 'flex', 'grid', 'table', 'inline', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table'];

async function generateDisplay(outdir, display) {
  const selector = `drac-d-${display}`
  const css = `.${selector} {
  display: ${display};
}
`;
  await writeFile(path.join(outdir, `${selector}.css`), css);
}

export default async function generate(outdir) {
  const bgdir = path.join(outdir, 'display');
  await mkdir(bgdir, {
    recursive: true,
  });

  for (const d of DISPLAYS) {
    await generateDisplay(bgdir, d);
  }
}
