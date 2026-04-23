import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/design';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Buscar Pokémon...' }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={palette.muted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {value.length > 0 ? (
        <Pressable
          hitSlop={10}
          onPress={() => onChangeText('')}
          accessibilityLabel="Limpar busca"
          accessibilityRole="button">
          <Ionicons name="close-circle" size={18} color={palette.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: palette.line,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: palette.ink,
    padding: 0,
  },
});
