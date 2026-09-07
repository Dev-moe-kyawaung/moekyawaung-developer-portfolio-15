import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients, radius } from '../theme';

const ICONS: Record<string, { active: any; inactive: any; label: string }> = {
  Home: { active: 'home', inactive: 'home-outline', label: 'Home' },
  Work: { active: 'albums', inactive: 'albums-outline', label: 'Work' },
  Assistant: { active: 'sparkles', inactive: 'sparkles-outline', label: 'Ask AI' },
  StackScreen: { active: 'layers', inactive: 'layers-outline', label: 'Stack' },
  Connect: { active: 'paper-plane', inactive: 'paper-plane-outline', label: 'Connect' },
};

function TabItem({
  name,
  focused,
  onPress,
  onLongPress,
}: {
  name: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const cfg = ICONS[name] ?? ICONS.Home;
  const p = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    p.value = withSpring(focused ? 1 : 0, { damping: 15, stiffness: 180 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(p.value, [0, 1], [0.6, 1]) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(p.value, [0, 1], [0, -2]) }, { scale: interpolate(p.value, [0, 1], [1, 1.06]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(p.value, [0, 1], [colors.textFaint, colors.violet]),
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={cfg.label}
      accessibilityState={{ selected: focused }}
    >
      <View style={styles.iconWrap}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.pill, pillStyle]}>
          <LinearGradient
            colors={['rgba(139,92,246,0.35)', 'rgba(59,130,246,0.12)'] as const}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View style={iconStyle}>
          <Ionicons name={focused ? cfg.active : cfg.inactive} size={21} color={focused ? colors.violet : colors.textFaint} />
        </Animated.View>
      </View>
      <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
        {cfg.label}
      </Animated.Text>
    </Pressable>
  );
}

/** Floating glass tab bar with an aurora sheen. */
export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 14 : 10) }]}
    >
      <View style={styles.bar}>
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(139,92,246,0.16)', 'rgba(34,211,238,0.05)', 'rgba(255,255,255,0)'] as const}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)'] as const}
          style={styles.hairline}
        />
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });
          return (
            <TabItem
              key={route.key}
              name={route.name}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(10,12,26,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 14,
  },
  hairline: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 0,
    height: 1,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 2 },
  iconWrap: {
    width: 42,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pill: { borderRadius: 15 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
});
