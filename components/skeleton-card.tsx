import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette, radius, shadow, spacing } from '@/theme/design';

export function SkeletonCard() {
  const shimmer = useSharedValue(0.4);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.line, { width: 40 }, shimmerStyle]} />
      <Animated.View style={[styles.circle, shimmerStyle]} />
      <Animated.View style={[styles.line, { width: '70%' }, shimmerStyle]} />
      <Animated.View style={[styles.line, { width: '45%', height: 12 }, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: palette.surfaceAlt,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    minHeight: 210,
    ...shadow.soft,
  },
  circle: {
    width: 78,
    height: 78,
    borderRadius: 40,
    backgroundColor: palette.line,
    alignSelf: 'center',
    marginVertical: spacing.sm,
  },
  line: {
    height: 14,
    borderRadius: 8,
    backgroundColor: palette.line,
  },
});
