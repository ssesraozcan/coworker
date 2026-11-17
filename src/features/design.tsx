import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";
import { Asset } from "expo-asset";
import { islands } from "./assets";
export const theme = {
  bg: "#141A2E",
  surface: "#232B45",
  nav: "#20273F",
  text: "#F2F4FC",
  muted: "#B4BDD3",
  purple: "#8274D4",
  teal: "#81CCC2",
};
export function Copy({
  children,
  size = 14,
  bold = false,
  title = false,
  style,
  ...props
}: {
  children: React.ReactNode;
  size?: number;
  bold?: boolean;
  title?: boolean;
  style?: any;
} & TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: title ? "Outfit" : bold ? "NunitoBold" : "Nunito",
          fontSize: size,
          lineHeight: size * 1.35,
          color: theme.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function GameButton({
  children,
  onPress,
  disabled = false,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        d.game,
        {
          opacity: disabled ? 0.45 : 1,
          transform: [{ translateY: pressed ? 4 : 0 }],
        },
        style,
      ]}
    >
      <LinearGradient colors={["#A691F5", "#6E57BA"]} style={d.gameInner}>
        <Copy bold size={16}>
          {children}
        </Copy>
      </LinearGradient>
    </Pressable>
  );
}
export function Vector({ asset, size = 24 }: { asset: number; size?: number }) {
  return (
    <SvgUri uri={Asset.fromModule(asset).uri} width={size} height={size} />
  );
}
export function Back({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Geri"
      onPress={onPress || (() => router.back())}
      style={d.back}
    >
      <Copy>‹ Geri</Copy>
    </Pressable>
  );
}
export function Atmosphere({
  children,
  premium = false,
  source,
}: {
  children: React.ReactNode;
  premium?: boolean;
  source?: number;
}) {
  return (
    <ImageBackground
      source={source || islands[0]}
      resizeMode="cover"
      imageStyle={{width:"100%",height:premium?650:"100%"}}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <LinearGradient
        pointerEvents="none"
        colors={
          premium
            ? ["#141A2E1F", "#141A2E0D", "#141A2EE6", theme.bg, theme.bg]
            : ["#141A2E44", "#141A2E66", theme.bg, theme.bg]
        }
        locations={premium ? [0, 0.22, 0.39, 0.63, 1] : [0, 0.38, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </ImageBackground>
  );
}
const navIcons = [
  require("../../assets/figma/f95bb.svg"),
  require("../../assets/figma/64326.svg"),
  require("../../assets/figma/4fc83.svg"),
  require("../../assets/figma/6de4b.svg"),
];
export function BottomNav({ selected = "Günüm" }: { selected?: string }) {
  const safe = useSafeAreaInsets();
  return (
    <View style={[d.nav, { paddingBottom: Math.max(safe.bottom, 14) }]}>
      {(["Günüm", "Takvim", "Dünyam", "Profil"] as const).map((label, i) => (
        <Pressable
          key={label}
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === label }}
          onPress={() =>
            router.replace(
              (["/", "/calendar", "/world", "/profile"] as const)[i],
            )
          }
          style={d.tab}
        >
          <View
            style={[
              d.icon,
              selected === label && { backgroundColor: "#3D365F" },
            ]}
          >
            <Vector asset={navIcons[i]} size={26} />
          </View>
          <Copy
            size={11}
            bold
            style={{ color: selected === label ? theme.text : theme.muted }}
          >
            {label}
          </Copy>
        </Pressable>
      ))}
    </View>
  );
}
export const d = StyleSheet.create({
  game: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#D1C2FFBF",
    backgroundColor: "#33245E",
    paddingBottom: 4,
    shadowColor: "#0A0F1F",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  gameInner: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  back: {
    minWidth: 70,
    minHeight: 44,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: theme.surface,
  },
  nav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.nav,
    flexDirection: "row",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#343D59",
  },
  tab: { flex: 1, minHeight: 60, alignItems: "center", gap: 2 },
  icon: {
    width: 56,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  panel: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  input: {
    backgroundColor: theme.surface,
    color: theme.text,
    fontFamily: "Nunito",
    padding: 14,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#404A66",
  },
  content: { flex: 1, paddingHorizontal: 20 },
  muted: { color: theme.muted },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
});
