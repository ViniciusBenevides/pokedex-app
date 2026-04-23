import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { extractIdFromUrl, officialArtwork, pokeapi } from '@/services/pokeapi';
import type { PokemonListItem, SortOption } from '@/types/pokemon';

export const PAGE_SIZE = 30;
const FULL_INDEX_LIMIT = 2000;

export type PokemonSummary = {
  id: number;
  name: string;
  image: string;
};

export type SourceMode = 'paginated' | 'type' | 'search';

export function usePokemonTypes() {
  return useQuery({
    queryKey: ['pokemon-types'],
    queryFn: ({ signal }) => pokeapi.types(signal),
    select: (data) =>
      data.results
        .map((t) => t.name)
        .filter((name) => name !== 'unknown' && name !== 'shadow' && name !== 'stellar'),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

function toSummary(item: PokemonListItem): PokemonSummary {
  const id = extractIdFromUrl(item.url);
  return { id, name: item.name, image: officialArtwork(id) };
}

function matchesSearch(p: PokemonSummary, query: string): boolean {
  if (!query) return true;
  return p.name.includes(query) || String(p.id) === query;
}

/**
 * Unified list of Pokémons combining three modes:
 * - paginated: the infinite list (when there's no search and no type filter).
 * - type: all Pokémons of the selected type (from /type/{name}).
 * - search: filtered against the full Pokémon index (so search is global,
 *   not limited to what pagination has loaded).
 */
export function useInfinitePokemons(typeFilter: string | null, searchQuery: string) {
  const search = searchQuery.trim().toLowerCase();
  const hasSearch = search.length > 0;
  const needsFullIndex = !typeFilter && hasSearch;

  const infinite = useInfiniteQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: ({ pageParam = 0, signal }) => pokeapi.list(PAGE_SIZE, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !typeFilter,
  });

  const typed = useQuery({
    queryKey: ['pokemons', 'by-type', typeFilter],
    queryFn: ({ signal }) => pokeapi.byType(typeFilter as string, signal),
    enabled: Boolean(typeFilter),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const index = useQuery({
    queryKey: ['pokemons', 'index'],
    queryFn: async ({ signal }) => {
      const data = await pokeapi.list(FULL_INDEX_LIMIT, 0, signal);
      return data.results.map(toSummary);
    },
    enabled: needsFullIndex,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const items: PokemonSummary[] = useMemo(() => {
    if (needsFullIndex) {
      if (!index.data) return [];
      return index.data.filter((p) => matchesSearch(p, search));
    }
    if (typeFilter) {
      if (!typed.data) return [];
      const list = typed.data.pokemon.map((p) => toSummary(p.pokemon));
      return hasSearch ? list.filter((p) => matchesSearch(p, search)) : list;
    }
    if (!infinite.data) return [];
    return infinite.data.pages.flatMap((page) => page.results.map(toSummary));
  }, [needsFullIndex, index.data, typeFilter, typed.data, infinite.data, search, hasSearch]);

  const mode: SourceMode = needsFullIndex ? 'search' : typeFilter ? 'type' : 'paginated';
  const activeIsLoading =
    mode === 'search' ? index.isLoading : mode === 'type' ? typed.isLoading : infinite.isLoading;
  const activeIsError =
    mode === 'search' ? index.isError : mode === 'type' ? typed.isError : infinite.isError;
  const activeError =
    mode === 'search' ? index.error : mode === 'type' ? typed.error : infinite.error;
  const activeRefetch =
    mode === 'search' ? index.refetch : mode === 'type' ? typed.refetch : infinite.refetch;

  return {
    items,
    mode,
    isLoading: activeIsLoading,
    isError: activeIsError,
    error: activeError,
    refetch: activeRefetch,
    isFetchingNextPage: mode === 'paginated' ? infinite.isFetchingNextPage : false,
    hasNextPage: mode === 'paginated' ? Boolean(infinite.hasNextPage) : false,
    fetchNextPage: () => {
      if (mode === 'paginated' && infinite.hasNextPage && !infinite.isFetchingNextPage) {
        infinite.fetchNextPage();
      }
    },
  };
}

export function usePokemonDetail(nameOrId: string | number | null) {
  return useQuery({
    queryKey: ['pokemon-detail', nameOrId],
    queryFn: ({ signal }) => pokeapi.detail(nameOrId as string | number, signal),
    enabled: nameOrId !== null && nameOrId !== '',
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });
}

export function applySort(items: PokemonSummary[], sort: SortOption): PokemonSummary[] {
  if (sort === 'name-asc') {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }
  return [...items].sort((a, b) => a.id - b.id);
}
