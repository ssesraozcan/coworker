import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Glass } from "../components/Glass";
import { Copy, Vector } from "./design";
export const GAME_NAV_SPACE = 112;
const tabs = [
  { label: "Ada", href: "/world", icon: require("../../assets/v3/island.svg") },
  { label: "Evim", href: "/home", icon: require("../../assets/v3/house.svg") },
  {
    label: "Dolabım",
    href: "/closet",
    icon: require("../../assets/v3/closet.svg"),
  },
] as const;
export function GameNav({
  selected = "Ada",
}: {
  selected?: "Ada" | "Evim" | "Dolabım";
}) {
  const safe = useSafeAreaInsets();
  return (
    <View
      testID="game-navigation"
      pointerEvents="box-none"
      style={[s.wrap, { bottom: Math.max(safe.bottom, 16) + 4 }]}
    >
      <Glass style={s.capsule}>
        {tabs.map((tab) => {
          const active = selected === tab.label;
          return (
            <Pressable
              key={tab.label}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              onPress={() => router.replace(tab.href)}
              style={[s.item, active && s.active]}
            >
              <Vector asset={tab.icon} size={28} />
              {active && (
                <Copy size={12} bold style={{ color: "#173C3C" }}>
                  {tab.label}
                </Copy>
              )}
            </Pressable>
          );
        })}
      </Glass>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ana sayfaya dön"
        onPress={() => router.replace("/")}
        style={s.exit}
      >
        <Glass style={s.home}>
          <Vector asset={require("../../assets/v3/return.svg")} size={23} />
          <Copy size={9} bold>
            Ana sayfa
          </Copy>
        </Glass>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    zIndex: 20,
  },
  capsule: {
    height: 64,
    borderRadius: 32,
    padding: 6,
    gap: 6,
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#142135B8",
  },
  item: {
    flex: 1,
    height: 50,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    borderRadius: 26,
  },
  active: { flex: 1.55, backgroundColor: "#B7DBD4E6" },
  exit: { width: 64, height: 64 },
  home: {
    flex: 1,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "#40675EAA",
    borderColor: "#C8F2E570",
  },
});
