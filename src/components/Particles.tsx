import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, seeded } from '../theme';

const PALETTE = [
  'rgba(167,139,250,0.95)',
  'rgba(99,102,241,0.9)',
  'rgba(34,211,238,0.9)',
  'rgba(232,121,249,0.85)',
  'rgba(129,140,248,0.9)',
];

type ParticleConfig = {
  x: number;
  y: number;
  size: number;
  color: string;
  travel: number;
  sway: number;
  duration: number;
  delay: number;
  peak: number;
  pulse: boolean;
};

function Particle({ cfg, width }: { cfg: ParticleConfig; width: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      cfg.delay,
      withRepeat(
        withTiming(1, { duration: cfg.duration, easing: Easing.inOut(Easing.quad) }),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const p = t.value;
    // rise with a gentle horizontal sway, fade in and out over the cycle
    const opacity = Math.sin(Math.PI * p) * cfg.peak;
    const scale = cfg.pulse ? 0.7 + 0.5 * Math.sin(Math.PI * p) : 1;
    return {
      opacity,
      transform: [
        { translateX: cfg.sway * Math.sin(p * Math.PI * 2) },
        { translateY: -cfg.travel * p },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: cfg.x,
          top: cfg.y,
          width: cfg.size,
          height: cfg.size,
          borderRadius: cfg.size / 2,
          backgroundColor: cfg.color,
          shadowColor: cfg.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 6,
          elevation: 4,
        },
        style,
      ]}
    />
  );
}

/**
 * Ambient "data motes" — slow rising particles with a soft glow.
 * Positions come from a seeded RNG so they never re-shuffle on re-render.
 */
export default function Particles({
  count = 26,
  area = { top: 0, height: 720 },
  width,
}: {
  count?: number;
  area?: { top: number; height: number };
  width: number;
}) {
  const configs = useMemo<ParticleConfig[]>(() => {
    const rnd = seeded(9137);
    const list: ParticleConfig[] = [];
    for (let i = 0; i < count; i++) {
      const big = rnd() > 0.82;
      list.push({
        x: rnd() * (width - 12) + 6,
        y: area.top + rnd() * area.height,
        size: big ? 3.6 + rnd() * 2.2 : 1.6 + rnd() * 2,
        color: PALETTE[Math.floor(rnd() * PALETTE.length)],
        travel: 40 + rnd() * 110,
        sway: -18 + rnd() * 36,
        duration: 7000 + rnd() * 9000,
        delay: rnd() * 7000,
        peak: big ? 0.75 : 0.5,
        pulse: big,
      });
    }
    return list;
  }, [count, width, area.top, area.height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {configs.map((cfg, i) => (
        <Particle key={i} cfg={cfg} width={width} />
      ))}
    </View>
  );
}

export { colors };
