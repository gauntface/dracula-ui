import * as  path from 'path';
import {writeFile, mkdir} from 'node:fs/promises';
import {BRIGHT_COLORS, FROM_COLORS, TO_COLORS} from './config/colors.js';

const OPACITY = [10, 20, 30, 40, 50, 60, 70, 80, 90];

function generateGradientVar(from, to) {
  return `--${from}-${to}:
  linear-gradient(
    var(--gradient-degree),
    var(--${from}) 0%,
    var(--${to}) 100%
  );`;
}

function generateOpacityVar(color, opacity) {
  return `--${color}-${opacity}0: hsl(170deg 100% 75% / 0.${opacity});`
}

export default async function generate(outdir) {
  const bgdir = path.join(outdir, 'variables');
  await mkdir(bgdir, {
    recursive: true,
  });
  const file = path.join(bgdir, '_gen-colors.css');

  const rules = [];
  for (const c of BRIGHT_COLORS) {
    for (const o of OPACITY) {
      rules.push(generateOpacityVar(c, o));
    }
  }

  for (let i = 0; i < FROM_COLORS.length; i++) {
    const from = FROM_COLORS[i];
    const to = TO_COLORS[i];
    rules.push(generateGradientVar(from, to));
  }

  await writeFile(file, `:root {
  ${rules.join("\n")}
}`);
}
