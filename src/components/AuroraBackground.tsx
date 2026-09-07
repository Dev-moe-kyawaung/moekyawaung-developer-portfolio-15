import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients } from '../theme';

type BlobProps = {
  colorsList: readonly string[];
  size: number;
  left: number;
  top: number;
  duration: number;
  driftX: number;
  driftY: number;
  baseOpacity: number;
  delay?: number;
};

function AuroraBlob({
  colorsList,
  size,
  left,
  top,
  duration,
  driftX,
  driftY,
  baseOpacity,
  delay = 0,
}: BlobProps) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [duration]);

  const style = useAnimatedStyle(() => {
    const p = t.value;
    return {
      transform: [
        { translateX: driftX * p },
        { translateY: driftY * p },
        { scale: 0.92 + 0.18 * p },
      ],
      opacity: baseOpacity * (0.65 + 0.35 * p),
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colorsList as any}
        start={{ x: 0.15, y: 0.05 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

/**
 * Slow-drifting aurora ribbons behind every screen. Purely decorative,
 * fully pointer-transparent, and cheap: a handful of UI-thread gradients.
 */
export default function AuroraBackground({ intensity = 1 }: { intensity?: number }) {
  const { width, height } = useWindowDimensions();

  const blobs = useMemo(() => {
    const unit = Math.max(width, height);
    return [
      {
        colorsList: gradients.auroraA,
        size: unit * 0.95,
        left: -width * 0.42,
        top: -height * 0.22,
        duration: 16000,
        driftX: width * 0.14,
        driftY: height * 0.08,
        baseOpacity: 0.9 * intensity,
      },
      {
        colorsList: gradients.auroraB,
        size: unit * 0.8,
        left: width * 0.42,
        top: -height * 0.14,
        duration: 19000,
        driftX: -width * 0.12,
        driftY: height * 0.12,
        baseOpacity: 0.85 * intensity,
      },
      {
        colorsList: gradients.auroraC,
        size: unit * 0.7,
        left: width * 0.3,
        top: height * 0.42,
        duration: 22000,
        driftX: -width * 0.1,
        driftY: -height * 0.1,
        baseOpacity: 0.7 * intensity,
      },
      {
        colorsList: gradients.auroraD,
        size: unit * 0.62,
        left: -width * 0.3,
        top: height * 0.62,
        duration: 18000,
        driftX: width * 0.1,
        driftY: -height * 0.09,
        baseOpacity: 0.6 * intensity,
      },
    ];
  }, [width, height, intensity]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
      {blobs.map((b, i) => (
        <AuroraBlob key={i} {...b} delay={i * 400} />
      ))}
      {/* Deep vignette so text always sits on enough contrast */}
      <LinearGradient
        colors={[
          'rgba(5,6,14,0.55)',
          'rgba(5,6,14,0.18)',
          'rgba(5,6,14,0.55)',
          'rgba(5,6,14,0.92)',
        ] as const}
        locations={[0, 0.28, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(5,6,14,0)', 'rgba(5,6,14,0.85)', '#05060E'] as const}
        locations={[0.6, 0.9, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
