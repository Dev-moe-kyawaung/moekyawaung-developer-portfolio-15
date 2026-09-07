import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import AuroraBackground from '../components/AuroraBackground';
import Particles from '../components/Particles';
import GlassPanel from '../components/GlassPanel';
import AIOrb from '../components/AIOrb';
import { CONTACT_METHODS, PROFILE } from '../data/content';
import { colors, gradients, radius, shadow, type } from '../theme';

export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const open = (url: string) => Linking.openURL(url).catch(() => {});

  const submit = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError('Add a valid email so Moe can reply.');
      return;
    }
    if (message.trim().length < 12) {
      setError('A sentence or two on the problem helps a lot.');
      return;
    }
    setError(null);
    const subject = encodeURIComponent(`Portfolio enquiry — from ${email.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— sent from the portfolio app`);
    const url = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    Linking.openURL(url)
      .then(() => setSent(true))
      .catch(() => setError('No mail app available — email ' + PROFILE.email + ' directly.'));
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <AuroraBackground intensity={0.7} />
      <Particles width={width} area={{ top: 0, height: 420 }} count={14} />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 140, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.eyebrow}>Connect</Text>
          <Text style={styles.h1}>Let's build something intelligent</Text>
          <Text style={styles.lead}>
            Open to product engineering roles and select freelance work — especially Android + AI. Fastest reply is email.
          </Text>
        </Animated.View>

        {/* availability */}
        <Animated.View entering={FadeInDown.duration(560).delay(80)} style={{ marginTop: 20 }}>
          <GlassPanel style={styles.avail} glow="accent" animate={false}>
            <View style={styles.availRow}>
              <AIOrb size={62} />
              <View style={{ flex: 1 }}>
                <View style={styles.availTag}>
                  <View style={styles.pulse} />
                  <Text style={styles.availTagText}>Available · new engagements</Text>
                </View>
                <Text style={styles.availBody}>
                  Based in {PROFILE.location.split('·')[0].trim()}. Comfortable across APAC and European time zones, async-first.
                </Text>
              </View>
            </View>
          </GlassPanel>
        </Animated.View>

        {/* contact methods */}
        <View style={styles.methods}>
          {CONTACT_METHODS.map((m, i) => (
            <Animated.View
              key={m.id}
              entering={FadeInDown.duration(480).delay(140 + i * 70).springify().damping(18)}
              style={{ width: '100%' }}
            >
              <Pressable onPress={() => open(m.url)} style={({ pressed }) => pressed && { opacity: 0.82, transform: [{ scale: 0.99 }] }}>
                <GlassPanel style={styles.methodCard} animate={false}>
                  <LinearGradient
                    colors={m.accent }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.methodIcon}
                  >
                    <Ionicons name={m.icon as any} size={17} color="#07081A" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitle}>{m.title}</Text>
                    <Text style={styles.methodValue}>{m.value}</Text>
                  </View>
                  <Ionicons name="open-outline" size={16} color={colors.textFaint} />
                </GlassPanel>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* message composer */}
        <Animated.View entering={FadeInDown.duration(540).delay(420)} style={{ marginTop: 26 }}>
          <Text style={styles.subTitle}>Send a message</Text>
          <GlassPanel style={styles.form} animate={false}>
            <Text style={styles.fieldLabel}>Your email</Text>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError(null);
              }}
              placeholder="you@company.com"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              accessibilityLabel="Your email address"
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>What are you building?</Text>
            <TextInput
              value={message}
              onChangeText={(t) => {
                setMessage(t);
                setError(null);
              }}
              placeholder="A sentence or two on the problem, the stage, and what good looks like in 90 days."
              placeholderTextColor={colors.textFaint}
              style={[styles.input, styles.textarea]}
              multiline
              accessibilityLabel="Your message"
            />

            {error ? (
              <Animated.View entering={FadeIn.duration(220)} style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color={colors.red} />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            ) : null}

            {sent ? (
              <Animated.View entering={FadeIn.duration(300)} style={styles.sentRow}>
                <View style={styles.sentCheck}>
                  <Ionicons name="checkmark" size={12} color="#05121A" />
                </View>
                <Text style={styles.sentText}>Opening your mail app — thanks for reaching out.</Text>
              </Animated.View>
            ) : null}

            <Pressable
              onPress={submit}
              style={({ pressed }) => [styles.submit, pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] }]}
              accessibilityRole="button"
              accessibilityLabel="Compose email"
            >
              <LinearGradient
                colors={gradients.primary }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="paper-plane" size={16} color="#fff" />
              <Text style={styles.submitText}>Compose email</Text>
            </Pressable>

            <Text style={styles.formNote}>
              This opens your mail app with the message pre-filled. Nothing is stored or tracked.
            </Text>
          </GlassPanel>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(520)} style={styles.footer}>
          <AIOrb size={38} />
          <Text style={styles.footerText}>
            Designed and built by {PROFILE.name}.{'\n'}Kotlin · Jetpack Compose · Firebase · on-device AI.
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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

  avail: { padding: 18 },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  availTag: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  pulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  availTagText: { color: colors.green, fontSize: type.tiny, fontWeight: '900', letterSpacing: 0.4 },
  availBody: { color: colors.textDim, fontSize: type.small, lineHeight: 19, marginTop: 6 },

  methods: { gap: 10, marginTop: 16 },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 },
  methodIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  methodTitle: { color: colors.textFaint, fontSize: 9.5, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  methodValue: { color: colors.text, fontSize: type.body, fontWeight: '700', marginTop: 3 },

  subTitle: { fontSize: type.h3, fontWeight: '800', color: colors.text, marginBottom: 12, letterSpacing: -0.2 },
  form: { padding: 18 },
  fieldLabel: {
    color: colors.textFaint,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.glassHair,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: type.body,
    outlineStyle: 'none',
  } as any,
  textarea: { minHeight: 108, textAlignVertical: 'top', lineHeight: 21 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  errorText: { color: colors.red, fontSize: type.small, fontWeight: '600', flex: 1 },
  sentRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 12 },
  sentCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentText: { color: colors.green, fontSize: type.small, fontWeight: '700', flex: 1 },

  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingVertical: 15,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: 18,
    ...shadow.glow,
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: type.body },
  formNote: { color: colors.textFaint, fontSize: type.tiny, lineHeight: 16, marginTop: 12, textAlign: 'center' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footerText: { flex: 1, color: colors.textFaint, fontSize: type.tiny, lineHeight: 17 },
});
