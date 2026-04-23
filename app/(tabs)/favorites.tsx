import { Alert, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FavoriteCard } from '@/components/favorite-card';
import { ScreenHeader } from '@/components/screen-header';
import { EmptyState } from '@/components/state-views';
import { useFavoritesList, useFavoritesStore } from '@/store/favorites-store';
import { palette, spacing, typography } from '@/theme/design';
import type { FavoritePokemon } from '@/types/pokemon';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const favorites = useFavoritesList();
  const remove = useFavoritesStore((s) => s.remove);
  const clear = useFavoritesStore((s) => s.clear);

  const confirmClear = () => {
    if (favorites.length === 0) return;
    Alert.alert(
      'Limpar favoritos',
      'Tem certeza que deseja remover todos os Pokémons favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar tudo', style: 'destructive', onPress: () => clear() },
      ],
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<FavoritePokemon>) => (
    <FavoriteCard item={item} onRemove={() => remove(item.id)} />
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        eyebrow="Sua coleção"
        title="Favoritos"
        subtitle={
          favorites.length === 0
            ? 'Toque no coração de um card para começar.'
            : `${favorites.length} Pokémon${favorites.length === 1 ? '' : 's'} guardado${favorites.length === 1 ? '' : 's'}`
        }
        right={
          favorites.length > 0 ? (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{favorites.length}</Text>
            </View>
          ) : undefined
        }
      />

      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Ainda sem favoritos"
          description="Volte para a aba Pokémons e toque no coração dos seus preferidos. Eles ficarão salvos mesmo depois de fechar o app."
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerAction} onPress={confirmClear}>
                Remover todos os favoritos
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  counter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    ...typography.title,
    color: palette.white,
    fontSize: 20,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerAction: {
    ...typography.caption,
    color: palette.red,
    textDecorationLine: 'underline',
  },
});
