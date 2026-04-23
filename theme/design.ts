import { Platform } from 'react-native';

export const palette = {
  red: '#DC0A2D',
  redDark: '#A80621',
  blue: '#30A7D7',
  yellow: '#FFCB05',
  cream: '#F6F8FC',
  white: '#FFFFFF',
  ink: '#1A1A1A',
  graphite: '#2A2B2E',
  muted: '#6B7280',
  line: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F2F7',
  success: '#16A34A',
  danger: '#EF4444',
  overlay: 'rgba(0,0,0,0.35)',
};

export const typeColors: Record<string, { bg: string; text: string; soft: string }> = {
  normal: { bg: '#A8A77A', text: '#FFFFFF', soft: '#EDECD6' },
  fire: { bg: '#EE8130', text: '#FFFFFF', soft: '#FDE0C6' },
  water: { bg: '#6390F0', text: '#FFFFFF', soft: '#D5E0FB' },
  electric: { bg: '#F7D02C', text: '#1A1A1A', soft: '#FDF2B8' },
  grass: { bg: '#7AC74C', text: '#FFFFFF', soft: '#DBF0C9' },
  ice: { bg: '#96D9D6', text: '#1A1A1A', soft: '#DFF5F4' },
  fighting: { bg: '#C22E28', text: '#FFFFFF', soft: '#F2C9C7' },
  poison: { bg: '#A33EA1', text: '#FFFFFF', soft: '#E9CFE9' },
  ground: { bg: '#E2BF65', text: '#1A1A1A', soft: '#F7EACB' },
  flying: { bg: '#A98FF3', text: '#FFFFFF', soft: '#E5DCFB' },
  psychic: { bg: '#F95587', text: '#FFFFFF', soft: '#FCCFDC' },
  bug: { bg: '#A6B91A', text: '#FFFFFF', soft: '#E4EAB5' },
  rock: { bg: '#B6A136', text: '#FFFFFF', soft: '#EAE3BB' },
  ghost: { bg: '#735797', text: '#FFFFFF', soft: '#D5C9E1' },
  dragon: { bg: '#6F35FC', text: '#FFFFFF', soft: '#D5C3FE' },
  dark: { bg: '#705746', text: '#FFFFFF', soft: '#D5CCC7' },
  steel: { bg: '#B7B7CE', text: '#1A1A1A', soft: '#E8E8F0' },
  fairy: { bg: '#D685AD', text: '#FFFFFF', soft: '#F2D6E4' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 24,
  pill: 999,
};

export const shadow = Platform.select({
  ios: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
    soft: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
  },
  default: {
    card: { elevation: 3 },
    soft: { elevation: 1 },
  },
})!;

export const typography = {
  display: {
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  mono: {
    fontSize: 13,
    fontWeight: '700' as const,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
};

export function getTypeStyle(type: string) {
  return typeColors[type.toLowerCase()] ?? { bg: palette.muted, text: palette.white, soft: palette.line };
}

export function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}
