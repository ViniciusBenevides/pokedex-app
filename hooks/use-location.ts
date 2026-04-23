import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

type UseLocationResult = {
  coords: LocationCoords | null;
  status: LocationStatus;
  errorMessage: string | null;
  request: () => Promise<void>;
};

export function useLocation(): UseLocationResult {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const request = useCallback(async () => {
    try {
      setStatus('requesting');
      setErrorMessage(null);
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('denied');
        setErrorMessage('Permissão de localização não concedida.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setStatus('granted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao obter localização.';
      setStatus('error');
      setErrorMessage(message);
    }
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  return { coords, status, errorMessage, request };
}
