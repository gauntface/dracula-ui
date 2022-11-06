import {BRIGHT_COLORS, FROM_COLORS, TO_COLORS} from './config/colors.js';

const OPACITY = [10, 20, 30, 40, 50, 60, 70, 80, 90];

function generateGradientVar(from, to) {
  return {
    name: `--${from}-${to}`,
    value: `linear-gradient(
      var(--gradient-degree),
      var(--${from}) 0%,
      var(--${to}) 100%
    )`,
  };
}

function generateOpacityVar(color, opacity) {
  return {
    name: `--${color}-${opacity}0`,
    value: `hsl(170deg 100% 75% / 0.${opacity})`,
  }
}

export default function generate(outdir) {
  const vars = {};
  for (const c of BRIGHT_COLORS) {
    for (const o of OPACITY) {
      const { name, value } = generateOpacityVar(c, o)
      vars[name] = value;
    }
  }

  for (let i = 0; i < FROM_COLORS.length; i++) {
    const from = FROM_COLORS[i];
    const to = TO_COLORS[i];
    const { name, value } = generateGradientVar(from, to)
    vars[name] = value;
  }

  return vars;
}
