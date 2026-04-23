import { Image } from 'expo-image';
import { memo, useCallback, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

import type { NearbyPin } from '@/hooks/use-nearby-pins';
import { Marker } from '@/components/rn-maps';
import { officialArtwork } from '@/services/pokeapi';
import { palette } from '@/theme/design';

// Android Marker snapshots its children once, before rounded borders and
// remote images finish painting, which produces the classic "1/4 circle".
// Fix: pre-render the pin offscreen (outside MapView — MapView only accepts
// Marker/Polyline as children) and capture it to a PNG data URI with
// react-native-view-shot. The real Marker then just shows a static bitmap
// with tracksViewChanges={false} — nothing to race against.

const OUTER = 52;
const BORDER = 3;
const INNER = OUTER - BORDER * 2;
const IMG = INNER - 8;
const IS_ANDROID = Platform.OS === 'android';

type PinProps = {
  pin: NearbyPin;
  onPress: () => void;
  bitmap?: string;
};

function PokemonPinComponent({ pin, onPress, bitmap }: PinProps) {
  if (IS_ANDROID) {
    if (!bitmap) return null;
    return (
      <Marker
        coordinate={pin.coordinate}
        title={pin.name}
        description="Pokémon selvagem à espreita"
        onPress={onPress}
        anchor={{ x: 0.5, y: 0.5 }}
        tracksViewChanges={false}>
        <Image source={{ uri: bitmap }} style={styles.markerImage} contentFit="contain" />
      </Marker>
    );
  }

  return (
    <Marker
      coordinate={pin.coordinate}
      title={pin.name}
      description="Pokémon selvagem à espreita"
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}>
      <PinBubble pokemonId={pin.pokemonId} />
    </Marker>
  );
}

export const PokemonPin = memo(PokemonPinComponent);

type CaptureProps = {
  pokemonId: number;
  onCapture: (uri: string) => void;
};

export function PokemonPinCapture({ pokemonId, onCapture }: CaptureProps) {
  const shotRef = useRef<ViewShot>(null);

  const capture = useCallback(async () => {
    if (!shotRef.current) return;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    try {
      const shot = shotRef.current as unknown as { capture: () => Promise<string> };
      const uri = await shot.capture();
      onCapture(uri);
    } catch {
      // Swallow — the map just won't show this particular pin.
    }
  }, [onCapture]);

  return (
    <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
      <PinBubble pokemonId={pokemonId} onImageLoad={capture} />
    </ViewShot>
  );
}

type BubbleProps = {
  pokemonId: number;
  onImageLoad?: () => void;
};

function PinBubble({ pokemonId, onImageLoad }: BubbleProps) {
  return (
    <View style={styles.outer} collapsable={false}>
      <View style={styles.inner}>
        <Image
          source={officialArtwork(pokemonId)}
          style={styles.image}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={0}
          onLoadEnd={onImageLoad}
          onError={onImageLoad}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    backgroundColor: palette.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: IMG,
    height: IMG,
  },
  markerImage: {
    width: OUTER,
    height: OUTER,
  },
});
