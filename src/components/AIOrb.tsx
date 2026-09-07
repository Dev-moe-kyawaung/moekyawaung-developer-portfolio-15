import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients } from '../theme';

function OrbitingDot({ size, radius, duration, color, reverse }: any) {
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${spin.value * (reverse ? -360 : 360)}deg` },
      { translateX: radius },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: 0, height: 0, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.95,
          shadowRadius: 8,
          elevation: 6,
        }}
      />
    </Animated.View>
  );
}

function Arc({
  size,
  thickness,
  color,
  duration,
  reverse,
  opacity,
}: {
  size: number;
  thickness: number;
  color: string;
  duration: number;
  reverse?: boolean;
  opacity: number;
}) {
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * (reverse ? -360 : 360)}deg` }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: 'transparent',
          borderTopColor: color,
          borderRightColor: color,
          opacity,
        },
        style,
      ]}
    />
  );
}

/**
 * The AI-assistant motif: a pulsing gradient core wrapped in counter-rotating
 * arcs with orbiting motes. Used as the hero signature and the chat avatar.
 */
export default function AIOrb({ size = 120, animated = true }: { size?: number; animated?: boolean }) {
  const breathe = useSharedValue(0);
  const swirl = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    breathe.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    swirl.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.linear }), -1, false);
  }, [animated]);

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.94 + 0.09 * breathe.value }],
    opacity: 0.88 + 0.12 * breathe.value,
  }));

  const swirlStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swirl.value * 360}deg` }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.14 * breathe.value }],
    opacity: 0.35 - 0.16 * breathe.value,
  }));

  const core = size * 0.42;
  const ring = size * 0.68;

  return (
    <View style={[styles.wrap, { width: size, height: size }]} pointerEvents="none">
      {/* outer halo */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'rgba(139,92,246,0.35)',
          },
          haloStyle,
        ]}
      />

      <Arc size={size * 0.92} thickness={Math.max(1.5, size * 0.014)} color="rgba(167,139,250,0.55)" duration={14000} opacity={0.9} />
      <Arc size={size * 0.82} thickness={Math.max(1.2, size * 0.012)} color="rgba(34,211,238,0.6)" duration={10000} reverse opacity={0.85} />
      <Arc size={size * 0.72} thickness={Math.max(1, size * 0.01)} color="rgba(232,121,249,0.45)" duration={18000} opacity={0.7} />

      <OrbitingDot size={size * 0.075} radius={size * 0.46} duration={7000} color={colors.cyan} />
      <OrbitingDot size={size * 0.055} radius={size * 0.36} duration={5200} reverse color={colors.pink} />
      <OrbitingDot size={size * 0.045} radius={size * 0.46} duration={11000} reverse color={colors.violet} />

      {/* gradient core with an inner swirl */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: core,
            height: core,
            borderRadius: core / 2,
            overflow: 'hidden',
            shadowColor: colors.purple,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: size * 0.18,
            elevation: 12,
          },
          coreStyle,
        ]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, swirlStyle]}>
          <LinearGradient
            colors={['#C4B5FD', '#8B5CF6', '#3B82F6', '#22D3EE', '#C4B5FD'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View
          style={{
            position: 'absolute',
            left: core * 0.16,
            top: core * 0.14,
            width: core * 0.34,
            height: core * 0.34,
            borderRadius: core,
            backgroundColor: 'rgba(255,255,255,0.5)',
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
