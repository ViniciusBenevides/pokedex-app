# Pokédex — Desafio React Native

Aplicativo mobile construído com **React Native + Expo** que consome a [PokeAPI](https://pokeapi.co/) e organiza a experiência em três abas:

1. **Pokémons** — lista (grid) com busca, filtro por tipo, ordenação e scroll infinito.
2. **Mapa** — mapa em tela cheia com pins aleatórios ao redor da localização do usuário. Ao focar a aba, a câmera animiza até um dos pins.
3. **Favoritos** — coleção persistida localmente; pode ser removida individualmente ou por completo.

---

## Como rodar

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm (ou pnpm / yarn — os comandos abaixo usam npm)
- Um destes ambientes para abrir o app:
  - **App Expo Go** no seu celular (iOS / Android) — forma mais rápida.
  - **Simulador iOS** (macOS + Xcode).
  - **Emulador Android** (Android Studio).

### Instalação

```bash
cd pokedex-app
npm install
```

### Executando

```bash
npx expo start
```

Um QR code aparece no terminal. Abra o app **Expo Go** no celular e escaneie, ou pressione `i`/`a` para abrir em simulador iOS / emulador Android.

> **Mapa + Android Emulator:** o Google Maps requer uma API key nativa. Para rodar em emulador Android com mapa funcional, considere usar um **development build** (`npx expo run:android`) configurando a key; em iOS/Expo Go funciona de cara (Apple Maps).

---

## Estrutura de pastas

```
pokedex-app/
├── app/
│   ├── _layout.tsx            # Root: QueryClient, SafeArea, Gesture handler
│   └── (tabs)/
│       ├── _layout.tsx        # 3 tabs (Pokémons, Mapa, Favoritos)
│       ├── index.tsx          # Lista de Pokémons
│       ├── map.tsx            # Mapa com geolocalização + pins
│       └── favorites.tsx      # Coleção favorita
├── components/                 # UI reutilizável (cards, badges, estados)
├── hooks/                      # usePokemons, useLocation, useNearbyPins...
├── services/pokeapi.ts         # Client da PokeAPI, tipado
├── store/favorites-store.ts    # Zustand + persist (AsyncStorage)
├── theme/design.ts             # Design tokens (cores, tipografia, tipos)
├── types/pokemon.ts            # Tipagem forte da PokeAPI
└── app.json                    # Permissões (localização), plugins
```

Hooks customizados isolam lógica de negócio (`useInfinitePokemons`, `usePokemonDetail`, `useLocation`, `useNearbyPins`), mantendo as telas declarativas.

---

## Decisões técnicas adotadas

**Expo + Expo Router.** O template do Expo já resolve bundling, deep linking e file-based routing. Usar Expo Router com uma pasta `(tabs)` entrega navegação nativa tipada e convive muito bem com `useFocusEffect` — essencial para o requisito de animar a câmera sempre que a aba Mapa ganha foco.

**React Query (`@tanstack/react-query`) para dados remotos.** Ele resolve de graça os três problemas mais chatos de uma lista conectada a API pública: paginação infinita (`useInfiniteQuery`), cache com deduplicação (os detalhes de tipo são buscados por card mas compartilhados entre telas) e a tríade estados de loading/error/success. A busca por tipo usa uma query separada (`/type/{name}`) cacheada com `staleTime: Infinity` porque a lista por tipo não muda na prática.

**Zustand + AsyncStorage para favoritos.** Precisamos de estado compartilhado por três telas, persistido entre execuções. Zustand é minimalista (nenhum provider necessário), tem seletores que evitam re-renderizações desnecessárias e o middleware `persist` pluga direto no `@react-native-async-storage/async-storage`. Redux seria exagerado; Context puro obrigaria a rehidratar manualmente.

**StyleSheet + design tokens em vez de Tailwind/NativeWind.** Para uma identidade visual forte (inspirada na Pokédex original — vermelho, amarelo, tipografia pesada, cores por tipo de Pokémon) o controle fino do StyleSheet aliado a um módulo `theme/design.ts` com `palette`, `spacing`, `radius`, `typography` e `typeColors` permitiu compor uma UI coesa sem o custo de setup do NativeWind. Todos os componentes bebem desse mesmo token set.

**react-native-maps + expo-location.** São os padrões do ecossistema Expo; a API de `animateCamera` do MapView casa perfeitamente com o `useFocusEffect` do expo-router para o requisito de zoom ao entrar na aba. A geração de pins usa fórmula de offset em raio (uniforme em metros, corrigindo pela latitude) para que os pins fiquem realmente espalhados em volta do usuário.

**expo-image para artes oficiais.** O `<Image>` do expo-image oferece cache em disco, transições suaves e melhor desempenho em listas do que o `Image` padrão — importante já que cada card carrega um PNG da arte oficial do Pokémon.

**Reanimated para micro-interações.** Animação do ícone de favorito (spring bounce) e shimmer dos skeletons rodam em UI thread via worklets, mantendo 60 fps mesmo enquanto o JS está fazendo paginação.

**TypeScript estrito.** Todos os endpoints tipados em `types/pokemon.ts`, alias `@/*` configurado no `tsconfig` e zero `any` no código — o compilador trava regressões ao evoluir o app.

---

## Comandos úteis

```bash
npx expo start           # Dev server (QR code para Expo Go)
npx expo start --ios     # Abre no iOS simulator
npx expo start --android # Abre no Android emulator
npm run lint             # ESLint (config Expo)
npx tsc --noEmit         # Checagem de tipos
npx expo-doctor          # Valida versões de dependências
```

---

## Testado em

- Expo SDK **54** · React Native **0.81** · React **19.1**
- iOS (Expo Go / simulador) — mapa funciona out of the box.
- Android (Expo Go) — lista, busca, favoritos e permissão de localização OK. Mapa com Google Maps exige dev build configurado.
