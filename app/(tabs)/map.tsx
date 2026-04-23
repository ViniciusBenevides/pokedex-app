import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MapView, type MapViewProps } from '@/components/rn-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonPin } from '@/components/pokemon-pin';
import { EmptyState } from '@/components/state-views';
import { useLocation } from '@/hooks/use-location';
import { useNearbyPins, type NearbyPin } from '@/hooks/use-nearby-pins';
import { palette, radius, shadow, spacing, typography } from '@/theme/design';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { coords, status, errorMessage, request } = useLocation();
  const pins = useNearbyPins(coords, 8, 700);
  const mapRef = useRef<MapView | null>(null);
  const lastAnimatedPinIdRef = useRef<string | null>(null);

  const zoomToPin = useCallback((pin: NearbyPin) => {
    mapRef.current?.animateCamera(
      {
        center: pin.coordinate,
        zoom: 17,
        heading: 0,
        pitch: 0,
      },
      { duration: 1200 },
    );
  }, []);

  // Fit all pins when location first becomes available.
  useEffect(() => {
    if (coords && pins.length > 0 && mapRef.current) {
      const coordinates = [coords, ...pins.map((p) => p.coordinate)];
      // Delay a tick so the MapView has a chance to lay out.
      const t = setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 120, right: 60, bottom: 240, left: 60 },
          animated: true,
        });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [coords, pins]);

  // Every time the tab gets focus, zoom to a random pin.
  useFocusEffect(
    useCallback(() => {
      if (pins.length === 0) return;
      // Prefer a pin different from the last one so the animation is visible.
      const candidates = pins.filter((p) => p.id !== lastAnimatedPinIdRef.current);
      const pool = candidates.length > 0 ? candidates : pins;
      const target = pool[Math.floor(Math.random() * pool.length)];
      lastAnimatedPinIdRef.current = target.id;
      // Slight delay so the focus transition is smooth.
      const t = setTimeout(() => zoomToPin(target), 350);
      return () => clearTimeout(t);
    }, [pins, zoomToPin]),
  );

  if (status === 'idle' || status === 'requesting') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={palette.red} size="large" />
        <Text style={styles.centeredLabel}>Localizando você...</Text>
      </View>
    );
  }

  if (status === 'denied' || status === 'error' || !coords) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="location-outline"
          title="Sem localização disponível"
          description={errorMessage ?? 'Precisamos da sua permissão para mostrar Pokémons próximos.'}
          action={{ label: 'Tentar novamente', onPress: request }}
        />
      </View>
    );
  }

  const initialRegion: MapViewProps['initialRegion'] = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        loadingEnabled
        loadingBackgroundColor={palette.cream}
        loadingIndicatorColor={palette.red}>
        {pins.map((pin) => (
          <PokemonPin key={pin.id} pin={pin} onPress={() => zoomToPin(pin)} />
        ))}
      </MapView>

      <View style={[styles.topCard, { top: insets.top + spacing.md }]}>
        <View style={styles.topCardRow}>
          <View style={styles.topCardIcon}>
            <Ionicons name="flash" size={14} color={palette.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topCardTitle}>Radar ativo</Text>
            <Text style={styles.topCardSubtitle}>
              {pins.length} Pokémons avistados perto de você
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => {
          if (pins.length === 0) return;
          const target = pins[Math.floor(Math.random() * pins.length)];
          lastAnimatedPinIdRef.current = target.id;
          zoomToPin(target);
        }}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + 96 },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Focar em um Pokémon aleatório">
        <Ionicons name="shuffle" size={22} color={palette.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.cream,
    gap: spacing.md,
  },
  centeredLabel: {
    ...typography.body,
    color: palette.muted,
  },
  topCard: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  topCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  topCardIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: palette.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCardTitle: {
    ...typography.subtitle,
    color: palette.ink,
    fontSize: 14,
  },
  topCardSubtitle: {
    ...typography.body,
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.red,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: palette.red,
        shadowOpacity: 0.4,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      default: { elevation: 6 },
    }),
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
