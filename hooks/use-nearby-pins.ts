import { useMemo } from 'react';

import type { LocationCoords } from '@/hooks/use-location';

export type NearbyPin = {
  id: string;
  name: string;
  coordinate: LocationCoords;
  pokemonId: number;
};

const POKEMON_NAMES: { id: number; name: string }[] = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 25, name: 'Pikachu' },
  { id: 39, name: 'Jigglypuff' },
  { id: 52, name: 'Meowth' },
  { id: 54, name: 'Psyduck' },
  { id: 63, name: 'Abra' },
  { id: 66, name: 'Machop' },
  { id: 74, name: 'Geodude' },
  { id: 129, name: 'Magikarp' },
  { id: 133, name: 'Eevee' },
  { id: 143, name: 'Snorlax' },
  { id: 151, name: 'Mew' },
  { id: 152, name: 'Chikorita' },
  { id: 155, name: 'Cyndaquil' },
  { id: 158, name: 'Totodile' },
  { id: 196, name: 'Espeon' },
  { id: 197, name: 'Umbreon' },
];

function randomOffsetDegrees(radiusMeters: number, latitude: number): LocationCoords {
  const u = Math.random();
  const v = Math.random();
  const w = (radiusMeters / 111_320) * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const latOffset = w * Math.cos(t);
  const lonOffset = (w * Math.sin(t)) / Math.cos((latitude * Math.PI) / 180);
  return { latitude: latOffset, longitude: lonOffset };
}

/**
 * Generates random pins inside a radius around the given coordinates.
 * Pins are stable as long as the coordinates and count don't change,
 * so re-renders don't jitter the map.
 */
export function useNearbyPins(
  center: LocationCoords | null,
  count: number = 8,
  radiusMeters: number = 600,
): NearbyPin[] {
  return useMemo<NearbyPin[]>(() => {
    if (!center) return [];
    const pins: NearbyPin[] = [];
    for (let i = 0; i < count; i += 1) {
      const offset = randomOffsetDegrees(radiusMeters, center.latitude);
      const poke = POKEMON_NAMES[Math.floor(Math.random() * POKEMON_NAMES.length)];
      pins.push({
        id: `${i}-${poke.id}-${Date.now()}`,
        name: poke.name,
        pokemonId: poke.id,
        coordinate: {
          latitude: center.latitude + offset.latitude,
          longitude: center.longitude + offset.longitude,
        },
      });
    }
    return pins;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.latitude, center?.longitude, count, radiusMeters]);
}
