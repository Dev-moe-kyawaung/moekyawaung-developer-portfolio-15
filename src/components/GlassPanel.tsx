import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, gradients, radius, shadow } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Soft inner highlight that sells the glass edge. */
  sheen?: boolean;
  glow?: 'none' | 'soft' | 'accent' | 'mint' | 'amber';
  padded?: boolean;
  entranceDelay?: number;
  animate?: boolean;
};

const GLOWS: Record<string, string> = {
  none: 'transparent',
  soft: '#6366F1',
  accent: '#8B5CF6',
  mint: '#22D3EE',
  amber: '#FBBF24',
};

/** Frosted panel: translucent fill, hairline border, top sheen and optional glow. */
export default function GlassPanel({
  children,
  style,
  sheen = true,
  glow = 'none',
  padded = true,
  entranceDelay = 0,
  animate = true,
}: Props) {
  const glowStyle: ViewStyle =
    glow === 'none'
      ? {}
      : {
          shadowColor: GLOWS[glow],
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.32,
          shadowRadius: 26,
          elevation: 8,
        };

  const Wrapper: any = animate ? Animated.View : View;

  return (
    <Wrapper
      entering={animate ? FadeInDown.duration(520).delay(entranceDelay).springify().damping(18) : undefined}
      style={[
        styles.base,
        padded && styles.padded,
        glowStyle,
        shadow.card,
        style,
      ]}
    >
      {sheen ? (
        <LinearGradient
          pointerEvents="none"
          colors={gradients.sheen }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.glass,
    borderColor: colors.glassHair,
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  padded: {
    padding: 18,
  },
});
