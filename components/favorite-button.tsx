import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { palette, radius } from '@/theme/design';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
  variant?: 'floating' | 'flat';
};

export function FavoriteButton({ active, onPress, size = 22, variant = 'floating' }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withSpring(1.25, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 }),
      );
    }
  }, [active, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(
        active ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
      );
    }
    onPress();
  };

  return (
    <Pressable
      hitSlop={8}
      onPress={handlePress}
      style={({ pressed }) => [
        variant === 'floating' ? styles.floating : styles.flat,
        pressed && { opacity: 0.7 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={active ? 'heart' : 'heart-outline'}
          size={size}
          color={active ? palette.red : variant === 'floating' ? palette.ink : palette.muted}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floating: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flat: {
    padding: 6,
  },
});
