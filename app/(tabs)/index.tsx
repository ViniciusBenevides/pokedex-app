import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterChips } from '@/components/filter-chips';
import { PokemonCard } from '@/components/pokemon-card';
import { ScreenHeader } from '@/components/screen-header';
import { SearchBar } from '@/components/search-bar';
import { SkeletonCard } from '@/components/skeleton-card';
import { EmptyState, ErrorState } from '@/components/state-views';
import {
  applySort,
  useInfinitePokemons,
  usePokemonTypes,
  type PokemonSummary,
} from '@/hooks/use-pokemons';
import { palette, radius, spacing, typography } from '@/theme/design';
import type { SortOption } from '@/types/pokemon';

const NUM_COLUMNS = 2;

export default function PokemonsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('id-asc');

  const types = usePokemonTypes();
  const {
    items,
    mode,
    isLoading,
    isError,
    error,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfinitePokemons(selectedType, search);

  const visibleItems = useMemo(() => applySort(items, sort), [items, sort]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PokemonSummary>) => (
      <View style={styles.cell}>
        <PokemonCard id={item.id} name={item.name} image={item.image} />
      </View>
    ),
    [],
  );

  const handleEndReached = useCallback(() => {
    if (mode === 'paginated' && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [mode, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showingInitialSkeleton = isLoading && items.length === 0;

  const subtitle = useMemo(() => {
    if (mode === 'search') {
      return `Buscando em toda a Pokédex...`;
    }
    if (mode === 'type') {
      return `Filtrando por tipo: ${selectedType}`;
    }
    return items.length > 0
      ? `${items.length} carregados — role para mais`
      : 'Carregando criaturas...';
  }, [mode, selectedType, items.length]);

  if (isError) {
    return (
      <View style={styles.screen}>
        <ScreenHeader eyebrow="Pokédex" title="Explore" subtitle="Descubra todos os Pokémons" />
        <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        eyebrow="Pokédex"
        title="Explore"
        subtitle={subtitle}
        right={
          <View style={styles.counterBubble}>
            <Text style={styles.counterValue}>{visibleItems.length}</Text>
            <Text style={styles.counterLabel}>visíveis</Text>
          </View>
        }
      />

      <View style={styles.controls}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <FilterChips
        types={types.data ?? []}
        typesLoading={types.isLoading}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        sort={sort}
        onChangeSort={setSort}
      />

      {showingInitialSkeleton ? (
        <View style={[styles.grid, { paddingBottom: insets.bottom + 120 }]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.cell}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : visibleItems.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Nada encontrado"
          description={
            mode === 'search'
              ? `Nenhum Pokémon com "${search}". Tente outro nome ou número.`
              : 'Tente outro nome, número ou limpe os filtros.'
          }
          action={
            search || selectedType
              ? {
                  label: 'Limpar filtros',
                  onPress: () => {
                    setSearch('');
                    setSelectedType(null);
                  },
                }
              : undefined
          }
        />
      ) : (
        <FlatList
          data={visibleItems}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 120 }]}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.8}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          ListFooterComponent={
            mode === 'paginated' && hasNextPage ? (
              <LoadMoreButton
                loading={isFetchingNextPage}
                onPress={fetchNextPage}
                loadedCount={items.length}
              />
            ) : mode === 'paginated' && !hasNextPage ? (
              <View style={styles.footerEnd}>
                <Text style={styles.footerEndLabel}>Você viu todos os {items.length} Pokémons ✨</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

function LoadMoreButton({
  loading,
  onPress,
  loadedCount,
}: {
  loading: boolean;
  onPress: () => void;
  loadedCount: number;
}) {
  return (
    <View style={styles.footerWrapper}>
      <Pressable
        onPress={onPress}
        disabled={loading}
        style={({ pressed }) => [
          styles.loadMore,
          loading && styles.loadMoreLoading,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Carregar mais Pokémons">
        {loading ? (
          <>
            <ActivityIndicator size="small" color={palette.white} />
            <Text style={styles.loadMoreLabel}>Carregando...</Text>
          </>
        ) : (
          <>
            <Text style={styles.loadMoreLabel}>Carregar mais</Text>
            <View style={styles.loadMoreBadge}>
              <Ionicons name="arrow-down" size={14} color={palette.ink} />
            </View>
          </>
        )}
      </Pressable>
      <Text style={styles.footerHint}>{loadedCount} já carregados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  controls: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  counterBubble: {
    alignItems: 'center',
    backgroundColor: palette.ink,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  counterValue: {
    ...typography.title,
    color: palette.yellow,
    fontSize: 20,
    lineHeight: 22,
  },
  counterLabel: {
    ...typography.caption,
    color: palette.white,
    fontSize: 9,
    opacity: 0.8,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  cell: {
    flex: 1 / NUM_COLUMNS,
    minWidth: 0,
  },
  footerWrapper: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  loadMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.ink,
    paddingLeft: spacing.xl,
    paddingRight: spacing.sm,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  loadMoreLoading: {
    paddingRight: spacing.xl,
  },
  loadMoreLabel: {
    ...typography.caption,
    color: palette.white,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  loadMoreBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  footerHint: {
    ...typography.caption,
    color: palette.muted,
    fontSize: 10,
  },
  footerEnd: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  footerEndLabel: {
    ...typography.body,
    color: palette.muted,
    fontSize: 13,
  },
});
