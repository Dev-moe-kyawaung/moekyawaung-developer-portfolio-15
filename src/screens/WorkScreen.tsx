import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import AuroraBackground from '../components/AuroraBackground';
import Particles from '../components/Particles';
import GlassPanel from '../components/GlassPanel';
import { CATEGORIES, Category, PROJECTS, Project } from '../data/content';
import { colors, gradients, radius, type } from '../theme';

function ProjectCard({ p, index, onPress }: { p: Project; index: number; onPress: () => void }) {
  return (
    <Animated.View entering={FadeInDown.duration(480).delay(Math.min(index, 6) * 70).springify().damping(18)}>
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { transform: [{ scale: 0.985 }], opacity: 0.94 }}>
        <GlassPanel style={styles.card} animate={false}>
          <LinearGradient
            pointerEvents="none"
            colors={[`${p.accent[0]}22`, 'rgba(0,0,0,0)'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardRow}>
            <LinearGradient
              colors={p.accent }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cover}
            >
              <Text style={styles.coverText}>{p.monogram}</Text>
              <Ionicons name={p.icon as any} size={14} color="rgba(8,9,26,0.6)" style={{ marginTop: 2 }} />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>{p.title}</Text>
                <Text style={styles.year}>{p.year}</Text>
              </View>
              <Text style={styles.tagline} numberOfLines={2}>{p.tagline}</Text>
              <View style={styles.chipRow}>
                {p.tags.slice(0, 3).map((t) => (
                  <View key={t} style={styles.chip}>
                    <Text style={styles.chipText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.metricStrip}>
            {p.metrics.map((m, i) => (
              <React.Fragment key={m.label}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.metricCell}>
                  <Text style={styles.metricValue}>{m.value}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerTags}>
              {p.categories.map((c) => (
                <Text key={c} style={styles.footerTag}>
                  {c === 'ai' ? 'AI/ML' : c.toUpperCase()}
                </Text>
              ))}
            </View>
            <View style={styles.readMore}>
              <Text style={styles.readMoreText}>Read case study</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.violet} />
            </View>
          </View>
        </GlassPanel>
      </Pressable>
    </Animated.View>
  );
}

export default function WorkScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const data = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(filter as Category))),
    [filter]
  );

  const header = (
    <View>
      <Animated.View entering={FadeIn.duration(500)} style={styles.headerBlock}>
        <Text style={styles.eyebrow}>Case studies</Text>
        <Text style={styles.h1}>Work that moved a number</Text>
        <Text style={styles.lead}>
          Five projects, each told the same way: the product decision, the technical challenge, and what actually changed afterwards.
        </Text>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((c) => {
          const active = filter === c.key;
          return (
            <Pressable
              key={c.key}
              onPress={() => setFilter(c.key)}
              style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && { opacity: 0.7 }]}
            >
              {active ? (
                <LinearGradient
                  colors={gradients.primary }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.count}>
        {data.length} {data.length === 1 ? 'project' : 'projects'}
        {filter !== 'all' ? ` · filtered` : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <AuroraBackground intensity={0.75} />
      <Particles width={width} area={{ top: 0, height: 420 }} count={16} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item, index }) => (
          <ProjectCard
            p={item}
            index={index}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 130, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <GlassPanel style={styles.empty}>
            <Ionicons name="file-tray-outline" size={30} color={colors.textFaint} />
            <Text style={styles.emptyTitle}>Nothing in this category yet</Text>
            <Text style={styles.emptyBody}>Try another filter — most projects span Android, AI and backend.</Text>
          </GlassPanel>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerBlock: { marginBottom: 18 },
  eyebrow: {
    fontSize: type.tiny,
    letterSpacing: 2,
    fontWeight: '900',
    color: colors.violet,
    textTransform: 'uppercase',
  },
  h1: { fontSize: type.h1, fontWeight: '900', color: colors.text, letterSpacing: -0.8, marginTop: 8 },
  lead: { fontSize: type.small, lineHeight: 20, color: colors.textDim, marginTop: 8, maxWidth: 460 },

  filterRow: { gap: 8, paddingRight: 20, paddingVertical: 4 },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassHair,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  filterChipActive: { borderColor: 'rgba(167,139,250,0.6)' },
  filterText: { color: colors.textDim, fontSize: type.small, fontWeight: '700' },
  filterTextActive: { color: '#fff' },
  count: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '700', marginTop: 14, marginBottom: 12, letterSpacing: 0.5 },

  card: { marginBottom: 14, padding: 16 },
  cardRow: { flexDirection: 'row', gap: 14 },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: { fontSize: 17, fontWeight: '900', color: '#07081A', letterSpacing: 0.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: type.h3, fontWeight: '800', color: colors.text, letterSpacing: -0.2 },
  year: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '700' },
  tagline: { color: colors.textDim, fontSize: type.small, lineHeight: 19, marginTop: 3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 9 },
  chip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipText: { color: colors.textDim, fontSize: 10, fontWeight: '700' },

  metricStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  metricCell: { flex: 1 },
  metricValue: { color: colors.cyan, fontSize: type.body, fontWeight: '900', letterSpacing: -0.3 },
  metricLabel: { color: colors.textFaint, fontSize: 10, fontWeight: '600', marginTop: 2 },
  divider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 10 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 13 },
  footerTags: { flexDirection: 'row', gap: 8, flex: 1 },
  footerTag: { color: colors.textFaint, fontSize: 9.5, fontWeight: '800', letterSpacing: 0.8 },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  readMoreText: { color: colors.violet, fontSize: type.small, fontWeight: '800' },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 34 },
  emptyTitle: { color: colors.text, fontSize: type.body, fontWeight: '800' },
  emptyBody: { color: colors.textFaint, fontSize: type.small, textAlign: 'center' },
});
