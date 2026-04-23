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

// The red "border" is a slightly larger red circle behind the white inner
// circle. Avoiding borderWidth + borderRadius sidesteps the Android Marker
// rasterization bug that renders only a fraction of the stroke.
const OUTER_SIZE = 52;
const RING_THICKNESS = 3;
const INNER_SIZE = OUTER_SIZE - RING_THICKNESS * 2;
const IMAGE_SIZE = INNER_SIZE - 8;
const IS_ANDROID = Platform.OS === 'android';

function PokemonPinComponent({ pin, onPress }: Props) {
  const [tracksChanges, setTracksChanges] = useState(true);

  useEffect(() => {
    if (!IS_ANDROID) {
      setTracksChanges(false);
      return;
    }
    const t = setTimeout(() => setTracksChanges(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleLoaded = () => {
    if (!IS_ANDROID) return;
    setTimeout(() => setTracksChanges(false), 250);
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
        style={styles.outer}
        collapsable={false}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS>
        <View style={styles.inner}>
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
  outer: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    backgroundColor: palette.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
