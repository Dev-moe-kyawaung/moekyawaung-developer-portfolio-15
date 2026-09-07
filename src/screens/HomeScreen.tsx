import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import AuroraBackground from '../components/AuroraBackground';
import Particles from '../components/Particles';
import GlassPanel from '../components/GlassPanel';
import AIOrb from '../components/AIOrb';
import SectionTitle from '../components/SectionTitle';
import { FEATURED, PROFILE, PROCESS, SKILL_GROUPS, STATS } from '../data/content';
import { colors, gradients, radius, shadow, type } from '../theme';

const TAB_BAR_SPACE = 108;

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const openAssistant = () => navigation.navigate('Assistant');
  const openWork = () => navigation.navigate('Work');

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <Particles width={width} area={{ top: 0, height: Math.max(500, height * 0.9) }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: TAB_BAR_SPACE + 24 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        {/* ---------- status strip ---------- */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.statusRow}>
          <View style={styles.dotLive} />
          <Text style={styles.statusText}>Available for new work · Q3</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.statusMeta}>{PROFILE.location}</Text>
        </Animated.View>

        {/* ---------- hero ---------- */}
        <View style={styles.hero}>
          <Animated.View entering={FadeInDown.duration(700).springify().damping(16)}>
            <AIOrb size={112} />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(620).delay(80)}
            style={styles.name}
          >
            {PROFILE.name}
          </Animated.Text>

          <Animated.View entering={FadeInDown.duration(620).delay(120)} style={styles.roleRow}>
            <LinearGradient
              colors={gradients.accent }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.roleTick}
            />
            <Text style={styles.roleText}>{PROFILE.role}</Text>
          </Animated.View>

          <Animated.Text entering={FadeInDown.duration(700).delay(180)} style={styles.headline}>
            {PROFILE.hero.lead}{' '}
            <Text style={styles.headlineAccent}>{PROFILE.hero.accent}</Text>
            {PROFILE.hero.tail}
          </Animated.Text>

          <Animated.Text entering={FadeInDown.duration(700).delay(260)} style={styles.sub}>
            {PROFILE.sub}
          </Animated.Text>

          {/* CTA row */}
          <Animated.View entering={FadeInDown.duration(700).delay(330)} style={styles.ctaRow}>
            <Pressable
              onPress={openAssistant}
              style={({ pressed }) => [styles.ctaPrimary, pressed && { transform: [{ scale: 0.975 }], opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Ask about my work"
            >
              <LinearGradient
                colors={gradients.primary }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="sparkles" size={17} color="#fff" />
              <Text style={styles.ctaPrimaryText}>Ask about my work</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>

            <Pressable
              onPress={openWork}
              style={({ pressed }) => [styles.ctaGhost, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="View case studies"
            >
              <Ionicons name="albums-outline" size={17} color={colors.text} />
              <Text style={styles.ctaGhostText}>Case studies</Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* ---------- stats ---------- */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <Animated.View
              key={s.label}
              entering={FadeInDown.duration(520).delay(380 + i * 70).springify().damping(18)}
              style={styles.statCell}
            >
              <GlassPanel style={styles.statCard} padded={false} animate={false}>
                <Ionicons name={s.icon as any} size={15} color={colors.violet} style={{ marginBottom: 8 }} />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </GlassPanel>
            </Animated.View>
          ))}
        </View>

        {/* ---------- AI motif / capability teaser ---------- */}
        <View style={styles.section}>
          <SectionTitle
            eyebrow="Core capability"
            title="Where the depth is"
            actionLabel="Full stack"
            onAction={() => navigation.navigate('StackScreen')}
            delay={80}
          />
          <View style={styles.capGrid}>
            {SKILL_GROUPS.map((g, i) => (
              <Animated.View
                key={g.id}
                entering={FadeInDown.duration(500).delay(120 + i * 60).springify().damping(18)}
                style={{ flex: 1 }}
              >
                <Pressable onPress={() => navigation.navigate('StackScreen')}>
                  {({ pressed }) => (
                    <GlassPanel style={[styles.capCard, pressed && { borderColor: colors.glassHairStrong }]} animate={false}>
                      <LinearGradient
                        colors={g.accent }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.capIcon}
                      >
                        <Ionicons name={g.icon as any} size={16} color="#08091A" />
                      </LinearGradient>
                      <Text style={styles.capTitle} numberOfLines={1}>{g.title}</Text>
                      <Text style={styles.capYears}>{g.years} · {Math.round(g.level * 100)}%</Text>
                    </GlassPanel>
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* ---------- featured work ---------- */}
        <View style={styles.section}>
          <SectionTitle
            eyebrow="Selected work"
            title="Case studies"
            actionLabel="See all"
            onAction={openWork}
            delay={80}
          />
          {FEATURED.map((p, i) => (
            <Animated.View
              key={p.id}
              entering={FadeInDown.duration(560).delay(140 + i * 110).springify().damping(18)}
            >
              <Pressable
                onPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
                style={({ pressed }) => pressed && { transform: [{ scale: 0.99 }], opacity: 0.94 }}
              >
                <GlassPanel style={styles.featureCard} glow="soft" animate={false}>
                  <LinearGradient
                    colors={p.accent }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featureIcon}
                  >
                    <Ionicons name={p.icon as any} size={24} color="#07081A" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <View style={styles.featureTitleRow}>
                      <Text style={styles.featureTitle}>{p.title}</Text>
                      <Text style={styles.featureYear}>{p.year}</Text>
                    </View>
                    <Text style={styles.featureTagline} numberOfLines={2}>{p.tagline}</Text>
                    <View style={styles.metricRow}>
                      {p.metrics.slice(0, 3).map((m) => (
                        <View key={m.label} style={styles.metricChip}>
                          <Text style={styles.metricValue}>{m.value}</Text>
                          <Text style={styles.metricLabel}>{m.label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                </GlassPanel>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* ---------- process ---------- */}
        <View style={styles.section}>
          <SectionTitle eyebrow="Operating model" title="How I work" delay={60} />
          {PROCESS.map((step, i) => (
            <Animated.View
              key={step.step}
              entering={FadeInDown.duration(520).delay(120 + i * 90).springify().damping(18)}
            >
              <GlassPanel style={styles.processCard} animate={false}>
                <View style={styles.processLeft}>
                  <Text style={styles.processStep}>{step.step}</Text>
                  <View style={styles.processLine} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.processTitleRow}>
                    <Ionicons name={step.icon as any} size={15} color={colors.cyan} />
                    <Text style={styles.processTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.processBody}>{step.body}</Text>
                </View>
              </GlassPanel>
            </Animated.View>
          ))}
        </View>

        {/* ---------- closing CTA ---------- */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <GlassPanel style={styles.closeCard} glow="accent" animate={false}>
            <View style={styles.closeRow}>
              <AIOrb size={54} />
              <View style={{ flex: 1 }}>
                <Text style={styles.closeTitle}>Ask the assistant</Text>
                <Text style={styles.closeBody}>
                  \u201cShow Android apps\u201d, \u201cView AI projects\u201d, \u201cSee GitHub\u201d — it answers from real case notes.
                </Text>
              </View>
            </View>
            <Pressable
              onPress={openAssistant}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.85 }]}
            >
              <LinearGradient
                colors={gradients.accent }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="chatbubble-ellipses" size={16} color="#06111F" />
              <Text style={styles.closeBtnText}>Start a conversation</Text>
            </Pressable>
          </GlassPanel>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  dotLive: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  statusText: { color: colors.green, fontSize: type.tiny, fontWeight: '800', letterSpacing: 0.6 },
  statusMeta: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '600' },

  hero: { alignItems: 'center', paddingHorizontal: 22, marginBottom: 30 },
  name: {
    marginTop: 18,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3.4,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  roleTick: { width: 18, height: 3, borderRadius: radius.pill },
  roleText: { color: colors.violet, fontSize: type.small, fontWeight: '700', letterSpacing: 0.4 },

  headline: {
    marginTop: 18,
    fontSize: type.display,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
    textAlign: 'center',
  },
  headlineAccent: { color: colors.violet },
  sub: {
    marginTop: 14,
    fontSize: type.body,
    lineHeight: 23,
    color: colors.textDim,
    textAlign: 'center',
    maxWidth: 400,
  },

  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 26, flexWrap: 'wrap', justifyContent: 'center' },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadow.glow,
  },
  ctaPrimaryText: { color: '#fff', fontWeight: '800', fontSize: type.body, letterSpacing: 0.2 },
  ctaGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassHairStrong,
    backgroundColor: colors.glass,
  },
  ctaGhostText: { color: colors.text, fontWeight: '700', fontSize: type.body },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 10,
  },
  statCell: { flex: 1 },
  statCard: { alignItems: 'flex-start', paddingVertical: 13, paddingHorizontal: 10 },
  statValue: { fontSize: 18, fontWeight: '900', color: colors.text, letterSpacing: -0.6 },
  statLabel: { fontSize: 10, color: colors.textFaint, marginTop: 3, fontWeight: '600' },

  section: { paddingHorizontal: 20, marginTop: 34 },

  capGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  capCard: { paddingVertical: 15, paddingHorizontal: 14, gap: 9 },
  capIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capTitle: { color: colors.text, fontSize: type.small, fontWeight: '800' },
  capYears: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '600' },

  featureCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12, padding: 16 },
  featureIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureTitle: { fontSize: type.h3, fontWeight: '800', color: colors.text, letterSpacing: -0.2 },
  featureYear: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '700' },
  featureTagline: { color: colors.textDim, fontSize: type.small, lineHeight: 19, marginTop: 3 },
  metricRow: { flexDirection: 'row', gap: 14, marginTop: 10 },
  metricChip: { alignItems: 'flex-start' },
  metricValue: { color: colors.cyan, fontSize: type.small, fontWeight: '900' },
  metricLabel: { color: colors.textFaint, fontSize: 9.5, fontWeight: '600', marginTop: 1 },

  processCard: { flexDirection: 'row', gap: 14, marginBottom: 10, padding: 16 },
  processLeft: { alignItems: 'center', width: 26 },
  processStep: { color: colors.violet, fontSize: type.tiny, fontWeight: '900', letterSpacing: 1 },
  processLine: { flex: 1, width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 6 },
  processTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  processTitle: { color: colors.text, fontSize: type.body, fontWeight: '800' },
  processBody: { color: colors.textDim, fontSize: type.small, lineHeight: 20, marginTop: 5 },

  closeCard: { padding: 20, gap: 16 },
  closeRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  closeTitle: { fontSize: type.h3, fontWeight: '800', color: colors.text },
  closeBody: { color: colors.textDim, fontSize: type.small, lineHeight: 19, marginTop: 4 },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  closeBtnText: { color: '#06111F', fontWeight: '900', fontSize: type.body },
});
