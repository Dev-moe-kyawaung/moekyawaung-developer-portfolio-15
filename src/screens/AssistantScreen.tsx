import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import AuroraBackground from '../components/AuroraBackground';
import Particles from '../components/Particles';
import AIOrb from '../components/AIOrb';
import RichText from '../components/RichText';
import { GREETING, SUGGESTED_QUESTIONS, answerFor, ChatAction } from '../lib/chat';
import { colors, gradients, radius, shadow, type } from '../theme';

type Msg = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  actions?: ChatAction[];
  followUps?: string[];
};

const STORAGE_KEY = 'moe-portfolio-chat-v1';

function TypingDot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 620, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: 0.3 + 0.7 * v.value,
    transform: [{ translateY: -3 * v.value }],
  }));
  return <Animated.View style={[styles.typingDot, style]} />;
}

function TypingIndicator() {
  return (
    <View style={[styles.bubbleRow, { alignItems: 'flex-start' }]}>
      <View style={styles.aiAvatar}>
        <AIOrb size={30} />
      </View>
      <Animated.View
        entering={FadeIn.duration(240)}
        exiting={FadeOut.duration(120)}
        style={[styles.bubble, styles.aiBubble]}
      >
        <View style={styles.typingRow}>
          <TypingDot delay={0} />
          <TypingDot delay={170} />
          <TypingDot delay={340} />
        </View>
      </Animated.View>
    </View>
  );
}

export default function AssistantScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [messages, setMessages] = useState<Msg[]>([
    { id: 'welcome', role: 'ai', text: GREETING, followUps: SUGGESTED_QUESTIONS.slice(0, 3) },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [restored, setRestored] = useState(false);

  // restore conversation
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) {
          const parsed = JSON.parse(raw) as Msg[];
          if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
        }
      } catch {
        /* storage unavailable — fall back to a fresh thread */
      } finally {
        if (alive) setRestored(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!restored) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40))).catch(() => {});
  }, [messages, restored]);

  const send = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean || typing) return;
      const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', text: clean };
      setMessages((m) => [...m, userMsg]);
      setInput('');
      setTyping(true);

      const intent = answerFor(clean);
      const delay = Math.min(1400, 520 + clean.length * 12);

      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: `a-${Date.now()}`,
            role: 'ai',
            text: intent.reply,
            actions: intent.actions,
            followUps: intent.followUps,
          },
        ]);
      }, delay);
    },
    [typing]
  );

  const runAction = useCallback(
    (a: ChatAction) => {
      if (a.type === 'link' && a.url) {
        Linking.openURL(a.url).catch(() => {});
        return;
      }
      if (a.projectId) {
        navigation.navigate('ProjectDetail', { projectId: a.projectId });
      } else if (a.screen) {
        navigation.navigate(a.screen);
      }
    },
    [navigation]
  );

  const clearChat = () => {
    setMessages([{ id: 'welcome', role: 'ai', text: GREETING, followUps: SUGGESTED_QUESTIONS.slice(0, 3) }]);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  const inverted = useMemo(() => [...messages].reverse(), [messages]);
  const suggestions = messages[messages.length - 1]?.followUps ?? SUGGESTED_QUESTIONS.slice(0, 3);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <AuroraBackground intensity={0.9} />
      <Particles width={width} area={{ top: 0, height: 400 }} count={16} />

      {/* ---------- header ---------- */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AIOrb size={46} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>MOE · Assistant</Text>
          <View style={styles.headerStatusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerStatus}>Grounded in real case notes</Text>
          </View>
        </View>
        <Pressable
          onPress={clearChat}
          hitSlop={10}
          style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.7 }]}
          accessibilityLabel="Clear conversation"
        >
          <Ionicons name="refresh-outline" size={17} color={colors.textDim} />
        </Pressable>
      </View>

      {/* ---------- messages ---------- */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={inverted}
          keyExtractor={(m: Msg) => m.id}
          inverted
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 8 }}
          ListFooterComponent={
            <View style={styles.suggestBlock}>
              <Text style={styles.suggestTitle}>SUGGESTED QUESTIONS</Text>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <Animated.View key={q} entering={FadeInDown.duration(420).delay(i * 60)}>
                  <Pressable onPress={() => send(q)} style={({ pressed }) => [styles.suggestChip, pressed && { opacity: 0.75 }]}>
                    <Ionicons name="sparkles-outline" size={13} color={colors.violet} />
                    <Text style={styles.suggestText}>{q}</Text>
                    <Ionicons name="arrow-forward" size={12} color={colors.textFaint} />
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          }
          renderItem={({ item }: { item: Msg }) =>
            item.role === 'user' ? (
              <Animated.View entering={FadeInDown.duration(320)} style={[styles.bubbleRow, styles.userRow]}>
                <View style={styles.bubbleWrap}>
                  <LinearGradient
                    colors={gradients.primary }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.bubble, styles.userBubble]}
                  >
                    <Text style={styles.userText}>{item.text}</Text>
                  </LinearGradient>
                </View>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown.duration(400)} style={[styles.bubbleRow, { alignItems: 'flex-start' }]}>
                <View style={styles.aiAvatar}>
                  <AIOrb size={30} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[styles.bubble, styles.aiBubble]}>
                    <RichText text={item.text} accentColor={colors.violet} />
                  </View>

                  {item.actions?.length ? (
                    <View style={styles.actionRow}>
                      {item.actions.map((a) => (
                        <Pressable
                          key={a.label}
                          onPress={() => runAction(a)}
                          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.75 }]}
                        >
                          <Ionicons name={a.icon as any} size={13} color={colors.violet} />
                          <Text style={styles.actionText}>{a.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              </Animated.View>
            )
          }
        />
      </View>

      {typing ? (
        <View style={styles.typingHost} pointerEvents="none">
          <TypingIndicator />
        </View>
      ) : null}

      {/* ---------- follow-ups ---------- */}
      {suggestions?.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.followRow}
        >
          {suggestions.map((q) => (
            <Pressable key={q} onPress={() => send(q)} style={({ pressed }) => [styles.followChip, pressed && { opacity: 0.7 }]}>
              <Text style={styles.followText} numberOfLines={1}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {/* ---------- composer ---------- */}
      <View style={[styles.composerHost, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about Android, AI, Firebase, GitHub…"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => send(input)}
            blurOnSubmit={false}
            multiline
            maxLength={400}
            accessibilityLabel="Message the assistant"
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              !input.trim() && { opacity: 0.4 },
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
            accessibilityLabel="Send message"
          >
            <LinearGradient
              colors={gradients.primary }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* FlatList handles the message thread; this keeps the composer pinned below it. */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: type.body, fontWeight: '900', color: colors.text, letterSpacing: 0.6 },
  headerStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  headerStatus: { color: colors.textFaint, fontSize: type.tiny, fontWeight: '600' },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassHair,
  },

  suggestBlock: { paddingTop: 6, paddingBottom: 18 },
  suggestTitle: {
    color: colors.textFaint,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  suggestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.28)',
    backgroundColor: 'rgba(139,92,246,0.09)',
    marginBottom: 8,
  },
  suggestText: { flex: 1, color: colors.text, fontSize: type.small, fontWeight: '700' },

  bubbleRow: { flexDirection: 'row', gap: 9, marginTop: 12 },
  userRow: { justifyContent: 'flex-end' },
  bubbleWrap: { maxWidth: '84%' },
  aiAvatar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: { maxWidth: '88%', borderRadius: 20, padding: 14 },
  aiBubble: {
    backgroundColor: 'rgba(139,92,246,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.24)',
    borderTopLeftRadius: 8,
    flexShrink: 1,
  },
  userBubble: { borderBottomRightRadius: 8, ...shadow.glow },
  userText: { color: '#fff', fontSize: type.body, lineHeight: 22, fontWeight: '600' },

  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, paddingLeft: 2 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.45)',
    backgroundColor: 'rgba(139,92,246,0.14)',
  },
  actionText: { color: colors.violet, fontSize: type.small, fontWeight: '800' },

  typingHost: { paddingHorizontal: 18, paddingBottom: 4 },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 3 },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.violet,
    opacity: 0.5,
  },

  followRow: { gap: 8, paddingHorizontal: 18, paddingBottom: 10, alignItems: 'center' },
  followChip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassHairStrong,
    backgroundColor: colors.glass,
    maxWidth: 240,
  },
  followText: { color: colors.textDim, fontSize: type.small, fontWeight: '700' },

  composerHost: { paddingHorizontal: 14 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 9,
    padding: 8,
    paddingLeft: 16,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(12,15,31,0.88)',
    borderWidth: 1,
    borderColor: colors.glassHairStrong,
    ...shadow.card,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: type.body,
    lineHeight: 21,
    maxHeight: 110,
    paddingVertical: 9,
    outlineStyle: 'none',
  } as any,
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
