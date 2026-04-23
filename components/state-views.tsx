import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/theme/design';

type EmptyProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ icon = 'sparkles-outline', title, description, action }: EmptyProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconBubble}>
        <Ionicons name={icon} size={32} color={palette.red} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? (
        <Pressable
          onPress={action.onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonLabel}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type ErrorProps = {
  message?: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.iconBubble, styles.errorBubble]}>
        <Ionicons name="alert-circle-outline" size={32} color={palette.white} />
      </View>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.description}>
        {message ?? 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.'}
      </Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button">
        <Ionicons name="refresh" size={16} color={palette.white} />
        <Text style={styles.buttonLabel}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.huge,
    gap: spacing.md,
  },
  iconBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(220, 10, 45, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  errorBubble: {
    backgroundColor: palette.red,
  },
  title: {
    ...typography.title,
    color: palette.ink,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: palette.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.ink,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  buttonLabel: {
    ...typography.subtitle,
    color: palette.white,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
