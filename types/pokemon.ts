export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export type PokemonType = {
  slot: number;
  type: { name: string; url: string };
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

export type PokemonSprites = {
  front_default: string | null;
  other?: {
    ['official-artwork']?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
    home?: {
      front_default: string | null;
    };
  };
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  sprites: PokemonSprites;
  stats: PokemonStat[];
  abilities: { ability: { name: string }; is_hidden: boolean; slot: number }[];
};

export type TypeListResponse = {
  count: number;
  results: { name: string; url: string }[];
};

export type TypeDetailResponse = {
  name: string;
  pokemon: { pokemon: { name: string; url: string }; slot: number }[];
};

export type FavoritePokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  favoritedAt: number;
};

export type SortOption = 'id-asc' | 'name-asc';
