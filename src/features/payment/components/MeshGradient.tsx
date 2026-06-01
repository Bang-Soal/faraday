import {StyleSheet, View} from 'react-native';
import Svg, {Defs, RadialGradient, Rect, Stop} from 'react-native-svg';

type Props = {
  /** Four mesh colors: [topLeft base, topRight glow, bottomLeft glow, bottomRight base] */
  colors: [string, string, string, string];
  /** Unique-per-instance prefix so gradient ids don't collide across cards. */
  idPrefix: string;
};

/**
 * Approximates dijkstra's canvas <MeshGradient> using overlapping radial
 * gradients in react-native-svg (no extra native dependency). Render it inside
 * a parent that has borderRadius + overflow:'hidden' to clip the corners.
 */
export function MeshGradient({colors, idPrefix}: Props) {
  const [c0, c1, c2, c3] = colors;
  const base = `${idPrefix}-base`;
  const tr = `${idPrefix}-tr`;
  const bl = `${idPrefix}-bl`;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          {/* base wash, top-left -> bottom-right */}
          <RadialGradient id={base} cx="0.15" cy="0.1" r="1.1">
            <Stop offset="0" stopColor={c0} stopOpacity={1} />
            <Stop offset="1" stopColor={c3} stopOpacity={1} />
          </RadialGradient>
          {/* top-right glow */}
          <RadialGradient id={tr} cx="0.95" cy="0.05" r="0.85">
            <Stop offset="0" stopColor={c1} stopOpacity={0.95} />
            <Stop offset="1" stopColor={c1} stopOpacity={0} />
          </RadialGradient>
          {/* bottom-left glow */}
          <RadialGradient id={bl} cx="0.05" cy="1" r="0.95">
            <Stop offset="0" stopColor={c2} stopOpacity={0.95} />
            <Stop offset="1" stopColor={c2} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${base})`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${tr})`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${bl})`} />
      </Svg>
    </View>
  );
}
