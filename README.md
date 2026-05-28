# Pokédex — React Native Challenge

A mobile app built with **React Native + Expo** that consumes the [PokeAPI](https://pokeapi.co/) and organizes the experience into three tabs:

1. **Pokémons** — grid list with search, type filter, sorting, and infinite scroll.
2. **Map** — full-screen map with random pins around the user's location. When the tab is focused, the camera animates to one of the pins.
3. **Favorites** — locally persisted collection; items can be removed individually or all at once.

---

## How to run

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm (or pnpm / yarn — commands below use npm)
- One of the following environments to open the app:
  - **Expo Go app** on your phone (iOS / Android) — fastest option.
  - **iOS Simulator** (macOS + Xcode).
  - **Android Emulator** (Android Studio).

### Installation

```bash
cd pokedex-app
npm install
```

### Running

```bash
npx expo start
```

A QR code will appear in the terminal. Open the **Expo Go** app on your phone and scan it, or press `i`/`a` to open in the iOS simulator / Android emulator.

> **Map + Android Emulator:** Google Maps requires a native API key. To run on an Android emulator with a working map, consider using a **development build** (`npx expo run:android`) with the key configured; on iOS/Expo Go it works out of the box (Apple Maps).

---

## Folder structure

```
pokedex-app/
├── app/
│   ├── _layout.tsx            # Root: QueryClient, SafeArea, Gesture handler
│   └── (tabs)/
│       ├── _layout.tsx        # 3 tabs (Pokémons, Map, Favorites)
│       ├── index.tsx          # Pokémon list
│       ├── map.tsx            # Map with geolocation + pins
│       └── favorites.tsx      # Favorites collection
├── components/                 # Reusable UI (cards, badges, states)
├── hooks/                      # usePokemons, useLocation, useNearbyPins...
├── services/pokeapi.ts         # Typed PokeAPI client
├── store/favorites-store.ts    # Zustand + persist (AsyncStorage)
├── theme/design.ts             # Design tokens (colors, typography, types)
├── types/pokemon.ts            # Strong PokeAPI typings
└── app.json                    # Permissions (location), plugins
```

Custom hooks isolate business logic (`useInfinitePokemons`, `usePokemonDetail`, `useLocation`, `useNearbyPins`), keeping screens declarative.

---

## Technical decisions

**Expo + Expo Router.** The Expo template already handles bundling, deep linking, and file-based routing. Using Expo Router with a `(tabs)` folder delivers typed native navigation and works great with `useFocusEffect` — essential for animating the camera whenever the Map tab comes into focus.

**React Query (`@tanstack/react-query`) for remote data.** It solves the three most painful problems of a list connected to a public API out of the box: infinite pagination (`useInfiniteQuery`), cache with deduplication (type details are fetched per card but shared across screens), and the loading/error/success state triad. Type-based search uses a separate query (`/type/{name}`) cached with `staleTime: Infinity` since the type list never changes in practice.

**Zustand + AsyncStorage for favorites.** We need shared state across three screens, persisted between sessions. Zustand is minimalist (no provider needed), has selectors that prevent unnecessary re-renders, and the `persist` middleware plugs directly into `@react-native-async-storage/async-storage`. Redux would be overkill; plain Context would require manual rehydration.

**StyleSheet + design tokens instead of Tailwind/NativeWind.** For a strong visual identity (inspired by the original Pokédex — red, yellow, heavy typography, per-type Pokémon colors), the fine-grained control of StyleSheet paired with a `theme/design.ts` module containing `palette`, `spacing`, `radius`, `typography`, and `typeColors` allowed composing a cohesive UI without the NativeWind setup cost. All components draw from this same token set.

**react-native-maps + expo-location.** These are the Expo ecosystem standards; the MapView `animateCamera` API pairs perfectly with expo-router's `useFocusEffect` to meet the zoom-on-tab-enter requirement. Pin generation uses a radius offset formula (uniform in meters, corrected for latitude) to ensure pins are truly spread around the user.

**expo-image for official artwork.** `<Image>` from expo-image provides disk caching, smooth transitions, and better list performance than the standard `Image` — important since each card loads an official Pokémon artwork PNG.

**Reanimated for micro-interactions.** The favorite icon animation (spring bounce) and skeleton shimmers run on the UI thread via worklets, maintaining 60 fps even while JS is handling pagination.

**Strict TypeScript.** All endpoints typed in `types/pokemon.ts`, `@/*` alias configured in `tsconfig`, and zero `any` in the codebase — the compiler catches regressions as the app evolves.

---

## Useful commands

```bash
npx expo start           # Dev server (QR code for Expo Go)
npx expo start --ios     # Opens in iOS simulator
npx expo start --android # Opens in Android emulator
npm run lint             # ESLint (Expo config)
npx tsc --noEmit         # Type checking
npx expo-doctor          # Validates dependency versions
```

---

## Tested on

- Expo SDK **54** · React Native **0.81** · React **19.1**
- iOS (Expo Go / simulator) — map works out of the box.
- Android (Expo Go) — list, search, favorites, and location permission OK. Map with Google Maps requires a configured dev build.
