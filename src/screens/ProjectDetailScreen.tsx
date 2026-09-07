import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import AuroraBackground from '../components/AuroraBackground';
import Particles from '../components/Particles';
import GlassPanel from '../components/GlassPanel';
import { getProject, nextProject } from '../data/content';
import { colors, gradients, radius, shadow, type } from '../theme';

function SectionHeading({ n, title, delay }: { n: string; title: string; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(480).delay(delay).springify().damping(18)} style={styles.secHead}>
      <View style={styles.secNum}>
        <Text style={styles.secNumText}>{n}</Text>
      </View>
      <Text style={styles.secTitle}>{title}</Text>
    </Animated.View>
  );
}

export default function ProjectDetailScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const project = getProject(route?.params?.projectId);
  const next = nextProject(project.id);

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      /* ignore — link simply does not resolve on this device */
    }
  };

  return (
    <View style={styles.root}>
      <AuroraBackground intensity={0.8} />
      <Particles width={width} area={{ top: 0, height: 460 }} count={18} />

      {/* floating back bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          hitSlop={8}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={19} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        {project.links[0] ? (
          <Pressable
            onPress={() => openLink(project.links[0].url)}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
            hitSlop={8}
            accessibilityLabel={`Open ${project.title} link`}
          >
            <Ionicons name="open-outline" size={17} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 68, paddingBottom: 130, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- hero ---------- */}
        <Animated.View entering={FadeIn.duration(500)}>
          <GlassPanel style={styles.heroCard} glow="soft" animate={false}>
            <LinearGradient
              pointerEvents="none"
              colors={[`${project.accent[0]}2E`, 'rgba(0,0,0,0)'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={project.accent }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroIcon}
            >
              <Ionicons name={project.icon as any} size={28} color="#07081A" />
            </LinearGradient>
            <Text style={styles.heroTitle}>{project.title}</Text>
            <Text style={styles.heroTagline}>{project.tagline}</Text>
            <View style={styles.metaRow}>
              <Meta icon="person-outline" label="Role" value={project.role} />
              <Meta icon="calendar-outline" label="Timeline" value={`${project.duration} · ${project.year}`} />
              <Meta icon="people-outline" label="Team" value={project.team} />
            </View>
          </GlassPanel>
        </Animated.View>

        {/* ---------- metrics ---------- */}
        <View style={styles.metricsRow}>
          {project.metrics.map((m, i) => (
            <Animated.View
              key={m.label}
              entering={FadeInDown.duration(460).delay(90 + i * 80).springify().damping(18)}
              style={{ flex: 1 }}
            >
              <GlassPanel style={styles.metricCard} animate={false}>
                <Text style={styles.metricValue}>{m.value}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </GlassPanel>
            </Animated.View>
          ))}
        </View>

        {/* ---------- summary ---------- */}
        <Animated.View entering={FadeInDown.duration(500).delay(160)}>
          <GlassPanel style={styles.summaryCard} animate={false} sheen={false}>
            <Ionicons name="document-text-outline" size={16} color={colors.violet} />
            <Text style={styles.summaryText}>{project.summary}</Text>
          </GlassPanel>
        </Animated.View>

        {/* ---------- 01 product decisions ---------- */}
        <SectionHeading n="01" title="Product decisions" delay={120} />
        {project.decisions.map((d, i) => (
          <Animated.View key={d.title} entering={FadeInDown.duration(480).delay(160 + i * 80).springify().damping(18)}>
            <GlassPanel style={styles.blockCard} animate={false}>
              <View style={styles.blockTitleRow}>
                <View style={[styles.bullet, { backgroundColor: `${project.accent[0]}` }]} />
                <Text style={styles.blockTitle}>{d.title}</Text>
              </View>
              <Text style={styles.blockBody}>{d.body}</Text>
            </GlassPanel>
          </Animated.View>
        ))}

        {/* ---------- 02 technical challenges ---------- */}
        <SectionHeading n="02" title="Technical challenges" delay={80} />
        {project.challenges.map((c, i) => (
          <Animated.View key={c.title} entering={FadeInDown.duration(480).delay(120 + i * 80).springify().damping(18)}>
            <GlassPanel style={styles.blockCard} animate={false}>
              <View style={styles.blockTitleRow}>
                <Ionicons name="hardware-chip-outline" size={15} color={colors.cyan} />
                <Text style={styles.blockTitle}>{c.title}</Text>
              </View>
              <Text style={styles.blockBody}>{c.body}</Text>
            </GlassPanel>
          </Animated.View>
        ))}

        {/* ---------- 03 outcomes ---------- */}
        <SectionHeading n="03" title="Measurable outcomes" delay={80} />
        <Animated.View entering={FadeInDown.duration(500).delay(140)}>
          <GlassPanel style={styles.outcomeCard} glow="mint" animate={false}>
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(34,211,238,0.10)', 'rgba(0,0,0,0)'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {project.outcomes.map((o, i) => (
              <View key={o} style={styles.outcomeRow}>
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={11} color="#05121A" />
                </View>
                <Text style={styles.outcomeText}>{o}</Text>
                {i < project.outcomes.length - 1 ? <View style={styles.outcomeDivider} /> : null}
              </View>
            ))}
          </GlassPanel>
        </Animated.View>

        {/* ---------- stack ---------- */}
        <SectionHeading n="04" title="Stack & tooling" delay={60} />
        <Animated.View entering={FadeInDown.duration(500).delay(120)} style={styles.stackWrap}>
          {project.stack.map((s) => (
            <View key={s} style={styles.stackChip}>
              <Text style={styles.stackChipText}>{s}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ---------- links ---------- */}
        <View style={styles.linkRow}>
          {project.links.map((l) => (
            <Pressable
              key={l.label}
              onPress={() => openLink(l.url)}
              style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient
                colors={gradients.primary }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name={l.icon as any} size={16} color="#fff" />
              <Text style={styles.linkText}>{l.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* ---------- next project ---------- */}
        <Pressable
          onPress={() => navigation.push('ProjectDetail', { projectId: next.id })}
          style={({ pressed }) => [styles.nextCard, pressed && { opacity: 0.9 }]}
        >
          <GlassPanel style={{ padding: 16 }} animate={false}>
            <Text style={styles.nextLabel}>NEXT CASE STUDY</Text>
            <View style={styles.nextRow}>
              <LinearGradient
                colors={next.accent }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextIcon}
              >
                <Text style={styles.nextIconText}>{next.monogram}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.nextTitle}>{next.title}</Text>
                <Text style={styles.nextTagline} numberOfLines={1}>{next.tagline}</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.violet} />
            </View>
          </GlassPanel>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Meta({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaHead}>
        <Ionicons name={icon as any} size={12} color={colors.textFaint} />
        <Text style={styles.metaLabel}>{label}</Text>
      </View>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(12,15,31,0.8)',
    borderWidth: 1,
    borderColor: colors.glassHairStrong,
  },

  heroCard: { padding: 20, marginBottom: 14 },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  heroTagline: { fontSize: type.body, lineHeight: 22, color: colors.textDim, marginTop: 6 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  metaItem: { flex: 1, minWidth: 120 },
  metaHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaLabel: { color: colors.textFaint, fontSize: 9.5, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  metaValue: { color: colors.text, fontSize: type.small, fontWeight: '600', marginTop: 4, lineHeight: 18 },

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metricCard: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 },
  metricValue: { fontSize: 21, fontWeight: '900', color: colors.cyan, letterSpacing: -0.6 },
  metricLabel: { fontSize: 10, color: colors.textFaint, fontWeight: '700', marginTop: 4, textAlign: 'center' },

  summaryCard: { flexDirection: 'row', gap: 12, padding: 18, marginBottom: 8 },
  summaryText: { flex: 1, color: colors.text, fontSize: type.body, lineHeight: 23, fontStyle: 'italic' },

  secHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 12 },
  secNum: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(139,92,246,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.35)',
  },
  secNumText: { color: colors.violet, fontSize: type.tiny, fontWeight: '900', letterSpacing: 1 },
  secTitle: { fontSize: type.h2, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },

  blockCard: { padding: 17, marginBottom: 10 },
  blockTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  bullet: { width: 8, height: 8, borderRadius: 4 },
  blockTitle: { flex: 1, fontSize: type.body, fontWeight: '800', color: colors.text },
  blockBody: { color: colors.textDim, fontSize: type.small, lineHeight: 21 },

  outcomeCard: { padding: 18 },
  outcomeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  check: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  outcomeText: { flex: 1, color: colors.text, fontSize: type.small, lineHeight: 21, fontWeight: '600' },
  outcomeDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginLeft: 30, marginVertical: 12, width: '100%' },

  stackWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stackChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  stackChipText: { color: colors.textDim, fontSize: type.small, fontWeight: '700' },

  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadow.glow,
  },
  linkText: { color: '#fff', fontWeight: '800', fontSize: type.small },

  nextCard: { marginTop: 22 },
  nextLabel: { color: colors.textFaint, fontSize: 9.5, fontWeight: '900', letterSpacing: 1.6, marginBottom: 12 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nextIconText: { fontSize: 13, fontWeight: '900', color: '#07081A' },
  nextTitle: { fontSize: type.body, fontWeight: '800', color: colors.text },
  nextTagline: { fontSize: type.tiny, color: colors.textFaint, marginTop: 2 },
});
