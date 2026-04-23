import type {
  PokemonDetail,
  PokemonListResponse,
  TypeDetailResponse,
  TypeListResponse,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`PokeAPI request failed (${response.status}): ${path}`);
  }
  return (await response.json()) as T;
}

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function officialArtwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export const pokeapi = {
  list: (limit: number, offset: number, signal?: AbortSignal) =>
    request<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`, signal),

  detail: (nameOrId: string | number, signal?: AbortSignal) =>
    request<PokemonDetail>(`/pokemon/${nameOrId}`, signal),

  types: (signal?: AbortSignal) => request<TypeListResponse>(`/type`, signal),

  byType: (type: string, signal?: AbortSignal) =>
    request<TypeDetailResponse>(`/type/${type}`, signal),
};
