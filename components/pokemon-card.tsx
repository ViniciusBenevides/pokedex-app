import { Image } from 'expo-image';
import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/favorite-button';
import { TypeBadge } from '@/components/type-badge';
import { usePokemonDetail } from '@/hooks/use-pokemons';
import { useFavoritesStore } from '@/store/favorites-store';
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

type Props = {
  id: number;
  name: string;
  image: string;
  onPress?: () => void;
};

function PokemonCardComponent({ id, name, image, onPress }: Props) {
  const detail = usePokemonDetail(id);
  const types = detail.data?.types?.map((t) => t.type.name) ?? [];
  const primaryType = types[0];
  const accent = useMemo(() => getTypeStyle(primaryType ?? 'normal'), [primaryType]);

  const toggle = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => Boolean(s.items[id]));

  const handleFavorite = () => {
    toggle({ id, name, image, types });
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: accent.soft },
        pressed && styles.pressed,
      ]}>
      <View style={styles.headerRow}>
        <Text style={styles.id}>{formatPokemonId(id)}</Text>
        <FavoriteButton active={isFavorite} onPress={handleFavorite} size={20} />
      </View>

      <View style={styles.artworkWrapper}>
        <View style={[styles.artworkBackdrop, { backgroundColor: accent.bg }]} />
        <Image source={image} style={styles.artwork} contentFit="contain" transition={180} />
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {capitalize(name)}
        </Text>
        <View style={styles.typesRow}>
          {types.length > 0 ? (
            types.slice(0, 2).map((t) => <TypeBadge key={t} type={t} size="sm" />)
          ) : (
            <View style={styles.typePlaceholder} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const PokemonCard = memo(PokemonCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  id: {
    ...typography.mono,
    color: palette.ink,
    opacity: 0.55,
  },
  artworkWrapper: {
    marginTop: spacing.sm,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkBackdrop: {
    position: 'absolute',
    bottom: -10,
    width: '85%',
    height: 50,
    borderRadius: radius.pill,
    opacity: 0.22,
  },
  artwork: {
    width: '95%',
    height: '100%',
  },
  body: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  name: {
    ...typography.subtitle,
    color: palette.ink,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    minHeight: 20,
  },
  typePlaceholder: {
    height: 20,
    width: 50,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
