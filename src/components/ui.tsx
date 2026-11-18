import React from "react";
import { GameNav } from "../features/GameNav";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
export const colors = {
  paper: "#141A2E",
  ink: "#F2F4FC",
  green: "#B7DBD4",
  soft: "#232B45",
  muted: "#B4BDD3",
};
export const art = {
  commons: require("../../assets/figma/commons-interior.png"),
  island: require("../../assets/game/island.png"),
  home: require("../../assets/game/home.png"),
  desk: require("../../assets/game/desk.png"),
  avatar: require("../../assets/game/avatar.png"),
  plant: require("../../assets/game/plant.png"),
  bench: require("../../assets/game/bench.png"),
  lantern: require("../../assets/game/lantern.png"),
  hoodie: require("../../assets/game/hoodie.png"),
  shirt: require("../../assets/game/shirt.png"),
  sweatshirt: require("../../assets/game/sweatshirt.png"),
};
export function Label({
  children,
  size = 14,
  bold = false,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  bold?: boolean;
  style?: any;
}) {
  return (
    <Text
      style={[
        {
          color: colors.ink,
          fontFamily: size >= 22 ? "Outfit" : bold ? "NunitoBold" : "Nunito",
          fontSize: size,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? colors.paper : colors.green,
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <Label
        bold
        size={15}
        style={{ color: secondary ? colors.ink : "#173C3C" }}
      >
        {children}
      </Label>
    </Pressable>
  );
}
export function Pill({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={styles.pill}
    >
      <Label size={12} bold>
        {children}
      </Label>
    </Pressable>
  );
}
export function Scene({
  image,
  children,
  contain = false,
}: {
  image: keyof typeof art;
  children: React.ReactNode;
  contain?: boolean;
}) {
  return (
    <ImageBackground
      source={art[image]}
      imageStyle={{ width: "100%", height: "100%" }}
      resizeMode={contain ? "contain" : "cover"}
      style={[styles.scene, contain && { backgroundColor: "#F5E2BF" }]}
    >
      {children}
    </ImageBackground>
  );
}
export function Nav({
  selected = "Evim",
}: {
  selected?: "Ada" | "Evim" | "Dolabım";
}) {
  return <GameNav selected={selected} />;
}
export const styles = StyleSheet.create({
  scene: { flex: 1, backgroundColor: colors.paper },
  button: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    backgroundColor: colors.paper,
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 11,
    minHeight: 40,
    justifyContent: "center",
  },
  panel: {
    backgroundColor: "#182536E8",
    borderWidth: 1,
    borderColor: "#FFFFFF26",
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  nav: {
    position: "absolute",
    left: 12,
    right: 12,
    flexDirection: "row",
    backgroundColor: colors.paper,
    borderRadius: 23,
    padding: 6,
    elevation: 3,
    shadowColor: "#263326",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 49,
    borderRadius: 17,
    gap: 3,
  },
  top: {
    position: "absolute",
    left: 18,
    right: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  input: {
    fontFamily: "Nunito",
    backgroundColor: "#232B45",
    color: colors.ink,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 44,
  },
  card: { backgroundColor: colors.soft, borderRadius: 16, padding: 10, gap: 7 },
  bottomPanel: { position: "absolute", left: 12, right: 12 },
});
export function ItemImage({
  item,
  size = 66,
}: {
  item: keyof typeof art;
  size?: number;
}) {
  return (
    <Image
      accessibilityLabel={item}
      source={art[item]}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}
