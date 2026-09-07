import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import AuroraBackground from '../components/AuroraBackground';
import Particles from '../components/Particles';
import GlassPanel from '../components/GlassPanel';
import { LEARNING, PROCESS, SKILL_GROUPS, SkillGroup } from '../data/content';
import { colors, radius, type } from '../theme';

function SkillBar({ level, accent, delay }: { level: number; accent: readonly [string, string]; delay: number }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(delay, withTiming(level, { duration: 1100, easing: Easing.out(Easing.cubic) }));
  }, []);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));

  return (
    <View style={styles.barTrack}>
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)'] as const}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.barFill, style]}>
        <LinearGradient
          colors={accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

function GroupCard({ g, index }: { g: SkillGroup; index: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(520).delay(100 + index * 90).springify().damping(18)}>
      <GlassPanel style={styles.groupCard} animate={false}>
        <View style={styles.groupHead}>
          <LinearGradient
            colors={g.accent }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.groupIcon}
          >
            <Ionicons name={g.icon as any} size={17} color="#07081A" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.groupTitle}>{g.title}</Text>
            <Text style={styles.groupYears}>{g.years}</Text>
          </View>
          <Text style={[styles.groupPct, { color: g.accent[0] }]}>{Math.round(g.level * 100)}%</Text>
        </View>

        <Text style={styles.groupBlurb}>{g.blurb}</Text>

        <SkillBar level={g.level} accent={g.accent} delay={260 + index * 90} />

        <View style={styles.chipWrap}>
          {g.skills.map((s) => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>
      </GlassPanel>
    </Animated.View>
  );
}

export default function StackScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <AuroraBackground intensity={0.7} />
      <Particles width={width} area={{ top: 0, height: 420 }} count={14} />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 130, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.eyebrow}>Capabilities</Text>
          <Text style={styles.h1}>The stack, honestly weighted</Text>
          <Text style={styles.lead}>
            Depth where it changes outcomes. Enough range to own a feature from discovery to Play Store — and the judgement to know when not to use AI.
          </Text>
        </Animated.View>

        {/* product thinking callout */}
        <Animated.View entering={FadeInDown.duration(560).delay(80)} style={{ marginTop: 20 }}>
          <GlassPanel style={styles.callout} glow="accent" animate={false}>
            <View style={styles.calloutHead}>
              <Ionicons name="bulb-outline" size={16} color={colors.pink} />
              <Text style={styles.calloutTitle}>Product thinking is part of the stack</Text>
            </View>
            <Text style={styles.calloutBody}>
              The most valuable change in the ZayGo case study was removing four screens. Tooling does not decide that — judgement does.
            </Text>
            <View style={styles.calloutPills}>
              {['Discovery', 'Funnel analysis', 'Experimentation', 'Metric definition'].map((p) => (
                <View key={p} style={styles.calloutPill}>
                  <Text style={styles.calloutPillText}>{p}</Text>
                </View>
              ))}
            </View>
          </GlassPanel>
        </Animated.View>

        <View style={{ gap: 12, marginTop: 22 }}>
          {SKILL_GROUPS.map((g, i) => (
            <GroupCard key={g.id} g={g} index={i} />
          ))}
        </View>

        {/* currently learning */}
        <Animated.View entering={FadeInDown.duration(520).delay(260)} style={{ marginTop: 28 }}>
          <Text style={styles.subTitle}>Currently learning</Text>
          <View style={styles.learnWrap}>
            {LEARNING.map((l) => (
              <View key={l} style={styles.learnChip}>
                <Ionicons name="trending-up-outline" size={12} color={colors.cyan} />
                <Text style={styles.learnText}>{l}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* how it maps to delivery */}
        <Animated.View entering={FadeInDown.duration(520).delay(300)} style={{ marginTop: 28 }}>
          <Text style={styles.subTitle}>How the stack maps to delivery</Text>
          <View style={{ gap: 8, marginTop: 12 }}>
            {PROCESS.map((p) => (
              <GlassPanel key={p.step} style={styles.mapCard} animate={false} sheen={false}>
                <Ionicons name={p.icon as any} size={15} color={colors.violet} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapTitle}>{p.title}</Text>
                  <Text style={styles.mapBody}>{p.body}</Text>
                </View>
              </GlassPanel>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  eyebrow: {
    fontSize: type.tiny,
    letterSpacing: 2,
    fontWeight: '900',
    color: colors.violet,
    textTransform: 'uppercase',
  },
  h1: { fontSize: type.h1, fontWeight: '900', color: colors.text, letterSpacing: -0.8, marginTop: 8 },
  lead: { fontSize: type.small, lineHeight: 20, color: colors.textDim, marginTop: 8, maxWidth: 460 },

  callout: { padding: 18 },
  calloutHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calloutTitle: { fontSize: type.body, fontWeight: '800', color: colors.text, flex: 1 },
  calloutBody: { color: colors.textDim, fontSize: type.small, lineHeight: 20, marginTop: 8 },
  calloutPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 13 },
  calloutPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(236,72,153,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.3)',
  },
  calloutPillText: { color: '#F9A8D4', fontSize: type.tiny, fontWeight: '700' },

  groupCard: { padding: 17 },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  groupTitle: { fontSize: type.h3, fontWeight: '800', color: colors.text, letterSpacing: -0.2 },
  groupYears: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '700', marginTop: 2 },
  groupPct: { fontSize: type.body, fontWeight: '900' },
  groupBlurb: { color: colors.textDim, fontSize: type.small, lineHeight: 20, marginTop: 12 },

  barTrack: {
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginTop: 13,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 14 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: { color: colors.textDim, fontSize: 11, fontWeight: '700' },

  subTitle: { fontSize: type.h3, fontWeight: '800', color: colors.text, letterSpacing: -0.2 },
  learnWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  learnChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.32)',
    backgroundColor: 'rgba(34,211,238,0.09)',
  },
  learnText: { color: '#A5F3FC', fontSize: type.small, fontWeight: '700' },

  mapCard: { flexDirection: 'row', gap: 12, padding: 15, alignItems: 'flex-start' },
  mapTitle: { color: colors.text, fontSize: type.small, fontWeight: '800' },
  mapBody: { color: colors.textFaint, fontSize: type.small, lineHeight: 19, marginTop: 4 },
});
