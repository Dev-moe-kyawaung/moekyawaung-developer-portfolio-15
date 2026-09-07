import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, gradients, radius, type } from '../theme';

export default function SectionTitle({
  eyebrow,
  title,
  actionLabel,
  onAction,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  delay?: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(480).delay(delay).springify().damping(18)}
      style={styles.row}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.eyebrowRow}>
          <LinearGradient
            colors={gradients.primary }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tick}
          />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel ? (
        <Pressable
          onPress={onAction}
          hitSlop={10}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    gap: 12,
  },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  tick: { width: 16, height: 3, borderRadius: radius.pill },
  eyebrow: {
    fontSize: type.tiny,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: colors.violet,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: type.h2,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  action: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassHairStrong,
    backgroundColor: colors.glass,
  },
  actionText: { color: colors.textDim, fontSize: type.small, fontWeight: '600' },
});
