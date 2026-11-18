import React from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import { BlurView, BlurTargetView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";

const BlurTarget = React.createContext<
  React.RefObject<React.ComponentRef<typeof View> | null> | undefined
>(undefined);
export function GlassScene({ children, ...props }: ViewProps) {
  const target = React.useRef<React.ComponentRef<typeof View> | null>(null);
  return (
    <BlurTarget.Provider value={target}>
      <BlurTargetView ref={target} {...props}>
        {children}
      </BlurTargetView>
    </BlurTarget.Provider>
  );
}
export function Glass({
  children,
  style,
  light = false,
  ...props
}: ViewProps & { light?: boolean }) {
  const target = React.useContext(BlurTarget);
  const native = Platform.OS === "ios" && isLiquidGlassAvailable();
  return (
    <View
      {...props}
      style={[g.surface, light && { borderColor: "#FFFFFFA8" }, style]}
    >
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
      >
        {native ? (
          <GlassView
            glassEffectStyle="clear"
            tintColor={light ? "#D8F9EB33" : "#14213555"}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <BlurView
            tint={light ? "light" : "dark"}
            intensity={35}
            blurTarget={target}
            blurMethod={
              Platform.OS === "android" && target ? "dimezisBlurView" : "none"
            }
            style={StyleSheet.absoluteFill}
          />
        )}
        <LinearGradient
          colors={
            light ? ["#F6FFFC38", "#D7F9ED20"] : ["#FFFFFF13", "#FFFFFF06"]
          }
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </View>
  );
}
const g = StyleSheet.create({
  surface: {
    overflow: "hidden",
    isolation: "isolate",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFFFFF24",
    backgroundColor: Platform.OS === "android" ? "#28344565" : "#FFFFFF04",
  },
});
