import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { FavoritePokemon } from '@/types/pokemon';

type FavoritesState = {
  items: Record<number, FavoritePokemon>;
  hydrated: boolean;
  toggle: (pokemon: Omit<FavoritePokemon, 'favoritedAt'>) => void;
  remove: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: {},
      hydrated: false,

      toggle: (pokemon) =>
        set((state) => {
          const next = { ...state.items };
          if (next[pokemon.id]) {
            delete next[pokemon.id];
          } else {
            next[pokemon.id] = { ...pokemon, favoritedAt: Date.now() };
          }
          return { items: next };
        }),

      remove: (id) =>
        set((state) => {
          if (!state.items[id]) return state;
          const next = { ...state.items };
          delete next[id];
          return { items: next };
        }),

      isFavorite: (id) => Boolean(get().items[id]),

      clear: () => set({ items: {} }),
    }),
    {
      name: 'pokedex-favorites-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

export function useFavoritesList(): FavoritePokemon[] {
  return Object.values(useFavoritesStore((s) => s.items)).sort(
    (a, b) => b.favoritedAt - a.favoritedAt,
  );
}
