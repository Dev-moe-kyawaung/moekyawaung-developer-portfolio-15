import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { colors } from '../theme';

/** Splits **bold** segments out of a line into styled spans. */
function renderLine(line: string, base: StyleProp<TextStyle>, accentColor: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={[base, { color: accentColor, fontWeight: '800' }]}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return (
      <Text key={i} style={base}>
        {part}
      </Text>
    );
  });
}

/**
 * Minimal rich text for chat bubbles: paragraphs, bulleted lines and **bold**.
 * Keeps assistant answers readable without pulling in a markdown dependency.
 */
export default function RichText({
  text,
  style,
  accentColor = colors.violet,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  accentColor?: string;
}) {
  const lines = text.split('\n');
  return (
    <View>
      {lines.map((raw, i) => {
        const line = raw.trimEnd();
        if (line.trim() === '') {
          return <View key={i} style={{ height: 10 }} />;
        }
        const isBullet = /^\s*[\u2022\-\u00b7]/.test(line);
        const content = isBullet ? line.replace(/^\s*[\u2022\-\u00b7]\s*/, '') : line;
        const isNumbered = /^\s*\d+\./.test(line);
        return (
          <View key={i} style={styles.line}>
            {isBullet ? (
              <Text style={[styles.marker, { color: accentColor }]}>\u2022</Text>
            ) : null}
            {isNumbered ? <View style={{ width: 4 }} /> : null}
            <Text style={[styles.body, style]}>{renderLine(content, undefined, accentColor)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', alignItems: 'flex-start' },
  marker: { fontSize: 15, lineHeight: 22, marginRight: 7, fontWeight: '900' },
  body: { flex: 1, color: colors.text, fontSize: 14.5, lineHeight: 22 },
});
