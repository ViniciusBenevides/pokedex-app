import { forwardRef, type ComponentType, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

// Web stubs. On web the map tab renders map.web.tsx (which doesn't render
// any of these), so these components never actually mount in production.
// They exist purely so the bundler can resolve imports from map.tsx /
// pokemon-pin.tsx without pulling in react-native-maps native modules.

type MapStubProps = ViewProps & { children?: ReactNode };

export const MapView = forwardRef<unknown, MapStubProps>(
  function MapViewWebStub({ children, ...props }, _ref) {
    return <View {...(props as ViewProps)}>{children}</View>;
  },
) as unknown as ComponentType<MapStubProps>;

export function Marker({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export type MapViewProps = ViewProps & {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
};
