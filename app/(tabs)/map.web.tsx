import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/state-views';
import { palette } from '@/theme/design';

export default function MapScreen() {
  return (
    <View style={styles.screen}>
      <EmptyState
        icon="map-outline"
        title="Mapa indisponível na web"
        description="O radar de Pokémons usa o mapa nativo e só está disponível no app mobile. Abra a Pokédex no celular para explorar."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.cream,
  },
});
