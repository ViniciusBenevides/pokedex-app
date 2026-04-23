import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { capitalize, getTypeStyle, palette, radius, spacing, typography } from '@/theme/design';
import type { SortOption } from '@/types/pokemon';

const CHIP_HEIGHT = 36;
const ROW_HEIGHT = 60;

type Props = {
  types: string[];
  typesLoading?: boolean;
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
  sort: SortOption;
  onChangeSort: (sort: SortOption) => void;
};

export function FilterChips({
  types,
  typesLoading,
  selectedType,
  onSelectType,
  sort,
  onChangeSort,
}: Props) {
  const nextSort: SortOption = sort === 'id-asc' ? 'name-asc' : 'id-asc';
  const sortLabel = sort === 'id-asc' ? 'Nº' : 'A-Z';

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        <Pressable
          onPress={() => onChangeSort(nextSort)}
          style={({ pressed }) => [styles.chipSort, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Alterar ordenação para ${nextSort}`}>
          <Text style={styles.sortLabel}>Ordenar</Text>
          <View style={styles.sortValue}>
            <Text style={styles.sortValueText}>{sortLabel}</Text>
          </View>
        </Pressable>

        <View style={styles.divider} />

        <Chip
          label="Todos"
          selected={selectedType === null}
          onPress={() => onSelectType(null)}
        />

        {typesLoading && types.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <View key={`skel-${i}`} style={styles.chipSkeleton} />
            ))
          : types.map((t) => (
              <Chip
                key={t}
                label={capitalize(t)}
                color={getTypeStyle(t).bg}
                selected={selectedType === t}
                onPress={() => onSelectType(selectedType === t ? null : t)}
              />
            ))}
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  color,
  selected,
  onPress,
}: {
  label: string;
  color?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const bg = selected ? color ?? palette.ink : palette.white;
  const fg = selected ? palette.white : palette.ink;
  const border = selected ? 'transparent' : palette.line;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, borderColor: border },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}>
      {color && !selected ? <View style={[styles.dot, { backgroundColor: color }]} /> : null}
      <Text style={[styles.chipText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: ROW_HEIGHT,
  },
  row: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: CHIP_HEIGHT,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    ...typography.caption,
    fontSize: 11,
  },
  chipSort: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.ink,
    height: CHIP_HEIGHT,
    paddingLeft: spacing.lg,
    paddingRight: 5,
    borderRadius: radius.pill,
    gap: spacing.sm,
  },
  sortLabel: {
    ...typography.caption,
    color: palette.white,
    fontSize: 11,
  },
  sortValue: {
    backgroundColor: palette.yellow,
    paddingHorizontal: 10,
    height: CHIP_HEIGHT - 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  sortValueText: {
    ...typography.caption,
    color: palette.ink,
    fontSize: 11,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: palette.line,
    marginHorizontal: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipSkeleton: {
    width: 80,
    height: CHIP_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: palette.line,
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.75,
  },
});
