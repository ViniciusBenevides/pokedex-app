import { Image } from 'expo-image';
import { memo, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { NearbyPin } from '@/hooks/use-nearby-pins';
import { Marker } from '@/components/rn-maps';
import { officialArtwork } from '@/services/pokeapi';
import { palette } from '@/theme/design';

type Props = {
  pin: NearbyPin;
  onPress: () => void;
};

const BUBBLE_SIZE = 52;
const IS_ANDROID = Platform.OS === 'android';

function PokemonPinComponent({ pin, onPress }: Props) {
  // On Android the Marker rasterizes its children into a bitmap. If we stop
  // tracking changes too early the snapshot freezes a half-drawn circle; if
  // tracking never starts at all (e.g. we remount with tracksViewChanges=false)
  // the marker captures nothing and the pin disappears. So: start tracking on,
  // wait for the image to load, give the GPU a few frames to finish drawing
  // the rounded border + image, then flip tracking off for a clean snapshot.
  const [tracksChanges, setTracksChanges] = useState(true);

  useEffect(() => {
    if (!IS_ANDROID) {
      setTracksChanges(false);
      return;
    }
    // Safety net so the marker doesn't re-render forever if onLoad never fires.
    const t = setTimeout(() => setTracksChanges(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleLoaded = () => {
    if (!IS_ANDROID) return;
    // Wait a handful of frames so Android finishes compositing the rounded
    // border before we freeze the bitmap.
    setTimeout(() => setTracksChanges(false), 350);
  };

  return (
    <Marker
      coordinate={pin.coordinate}
      title={pin.name}
      description="Pokémon selvagem à espreita"
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracksChanges}>
      <View
        style={styles.container}
        collapsable={false}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS>
        <View style={styles.bubble}>
          <Image
            source={officialArtwork(pin.pokemonId)}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
            onLoad={handleLoaded}
            onError={handleLoaded}
          />
        </View>
      </View>
    </Marker>
  );
}

export const PokemonPin = memo(PokemonPinComponent);

const styles = StyleSheet.create({
  container: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: palette.red,
  },
  image: {
    width: BUBBLE_SIZE - 16,
    height: BUBBLE_SIZE - 16,
  },
});
