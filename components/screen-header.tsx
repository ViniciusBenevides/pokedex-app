import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, spacing, typography } from '@/theme/design';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  right?: React.ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, accent = palette.red, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.eyebrowRow}>
            <View style={[styles.dot, { backgroundColor: accent }]} />
            <View style={[styles.dot, { backgroundColor: palette.yellow }]} />
            <View style={[styles.dot, { backgroundColor: palette.blue }]} />
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: palette.cream,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  left: { flex: 1 },
  right: { marginLeft: spacing.md },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 2,
  },
  eyebrow: {
    marginLeft: spacing.sm,
    ...typography.caption,
    color: palette.muted,
  },
  title: {
    ...typography.display,
    color: palette.ink,
  },
  subtitle: {
    ...typography.body,
    color: palette.muted,
    marginTop: spacing.xs,
  },
});
