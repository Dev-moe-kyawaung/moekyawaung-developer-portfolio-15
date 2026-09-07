import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * Design tokens for the Moe Kyaw Aung portfolio.
 * Dark, aurora-lit, glass-forward.
 */
export const colors = {
  bg: '#05060E',
  bgSoft: '#080A16',
  bgRaised: '#0C0F1F',

  glass: 'rgba(255,255,255,0.045)',
  glassStrong: 'rgba(255,255,255,0.085)',
  glassHair: 'rgba(255,255,255,0.10)',
  glassHairStrong: 'rgba(255,255,255,0.20)',

  text: '#F2F4FF',
  textDim: '#A7AEC9',
  textFaint: '#6E7594',

  purple: '#8B5CF6',
  violet: '#A78BFA',
  indigo: '#6366F1',
  blue: '#3B82F6',
  cyan: '#22D3EE',
  pink: '#E879F9',
  green: '#34D399',
  amber: '#FBBF24',
  red: '#FB7185',
} as const;

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;

export const space = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28, xxl: 40 } as const;

export const type = {
  display: 34,
  h1: 27,
  h2: 20,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

export const font = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });
export const fontMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

export const gradients = {
  primary: ['#8B5CF6', '#5B5BF6'] as const,
  hero: ['#C4B5FD', '#8B5CF6', '#3B82F6'] as const,
  accent: ['#22D3EE', '#6366F1'] as const,
  warm: ['#F0ABFC', '#8B5CF6'] as const,
  mint: ['#34D399', '#22D3EE'] as const,
  amber: ['#FBBF24', '#F97316'] as const,
  auroraA: ['rgba(124,58,237,0.62)', 'rgba(79,70,229,0.18)', 'rgba(0,0,0,0)'] as const,
  auroraB: ['rgba(37,99,235,0.55)', 'rgba(34,211,238,0.14)', 'rgba(0,0,0,0)'] as const,
  auroraC: ['rgba(219,39,119,0.40)', 'rgba(139,92,246,0.14)', 'rgba(0,0,0,0)'] as const,
  auroraD: ['rgba(6,182,212,0.40)', 'rgba(99,102,241,0.12)', 'rgba(0,0,0,0)'] as const,
  sheen: ['rgba(255,255,255,0.085)', 'rgba(255,255,255,0.0)'] as const,
  fadeDown: ['rgba(5,6,14,0)', 'rgba(5,6,14,0.75)', '#05060E'] as const,
} as const;

export const shadow = {
  glow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 10,
  } as ViewStyle,
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  } as ViewStyle,
};

export const textStyles = {
  eyebrow: {
    fontSize: type.tiny,
    letterSpacing: 1.8,
    fontWeight: '700' as TextStyle['fontWeight'],
    textTransform: 'uppercase' as const,
    color: colors.violet,
  },
};

/** Pseudo-random but stable — same seed always yields the same layout. */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
