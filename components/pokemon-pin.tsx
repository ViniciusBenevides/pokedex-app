import { Image } from 'expo-image';
import { memo, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import type { NearbyPin } from '@/hooks/use-nearby-pins';
import { Marker } from '@/components/rn-maps';
import { officialArtwork } from '@/services/pokeapi';
import { palette } from '@/theme/design';

type Props = {
  pin: NearbyPin;
  onPress: () => void;
};

const SIZE = 52;
const BORDER = 3;
const IMAGE_SIZE = SIZE - BORDER * 2 - 8;
const IS_ANDROID = Platform.OS === 'android';

function PokemonPinComponent({ pin, onPress }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Safety net: freeze the marker bitmap after 4s even if onLoad never fires.
  useEffect(() => {
    if (!IS_ANDROID) return;
    const t = setTimeout(() => setImageLoaded(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Marker
      coordinate={pin.coordinate}
      title={pin.name}
      description="Pokémon selvagem à espreita"
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={IS_ANDROID ? !imageLoaded : false}>
      <View style={styles.container} collapsable={false}>
        {/* SVG renders the red ring + white inner circle as a single atomic
            native drawable, avoiding the Android Marker snapshot bug where
            borderRadius + borderWidth gets clipped mid-paint. */}
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2} fill={palette.red} />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={SIZE / 2 - BORDER}
            fill={palette.white}
          />
        </Svg>
        <Image
          source={officialArtwork(pin.pokemonId)}
          style={styles.image}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={0}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      </View>
    </Marker>
  );
}

export const PokemonPin = memo(PokemonPinComponent);

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
