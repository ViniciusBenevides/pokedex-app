import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TypeBadge } from '@/components/type-badge';
import {
  capitalize,
  formatPokemonId,
  getTypeStyle,
  palette,
  radius,
  shadow,
  spacing,
  typography,
} from '@/theme/design';
import type { FavoritePokemon } from '@/types/pokemon';

type Props = {
  item: FavoritePokemon;
  onRemove: () => void;
};

function FavoriteCardComponent({ item, onRemove }: Props) {
  const accent = getTypeStyle(item.types[0] ?? 'normal');

  return (
    <View style={[styles.card, { backgroundColor: accent.soft }]}>
      <View style={[styles.artworkBackdrop, { backgroundColor: accent.bg }]} />
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="contain"
            transition={150}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.id}>{formatPokemonId(item.id)}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {capitalize(item.name)}
          </Text>
          <View style={styles.typesRow}>
            {item.types.slice(0, 2).map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </View>
        </View>

        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${item.name} dos favoritos`}>
          <Ionicons name="trash-outline" size={18} color={palette.red} />
        </Pressable>
      </View>
    </View>
  );
}

export const FavoriteCard = memo(FavoriteCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.md,
    overflow: 'hidden',
    ...shadow.soft,
  },
  artworkBackdrop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  imageWrapper: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 72,
    height: 72,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  id: {
    ...typography.mono,
    color: palette.ink,
    opacity: 0.55,
    fontSize: 11,
  },
  name: {
    ...typography.title,
    color: palette.ink,
    fontSize: 19,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
