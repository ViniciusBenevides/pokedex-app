import { StyleSheet, Text, View } from 'react-native';

import { capitalize, getTypeStyle, radius, spacing, typography } from '@/theme/design';

type Props = {
  type: string;
  size?: 'sm' | 'md';
};

export function TypeBadge({ type, size = 'md' }: Props) {
  const style = getTypeStyle(type);
  const padding = size === 'sm'
    ? { paddingVertical: 2, paddingHorizontal: spacing.sm }
    : { paddingVertical: 4, paddingHorizontal: spacing.md };
  const fontSize = size === 'sm' ? 10 : 12;
  return (
    <View style={[styles.badge, padding, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text, fontSize }]}>{capitalize(type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    letterSpacing: 0.5,
  },
});
