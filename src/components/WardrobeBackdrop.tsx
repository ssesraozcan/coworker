import React from "react";
import { Image, StyleSheet, View } from "react-native";
export function WardrobeBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={require("../../assets/v3/open-wardrobe.png")}
        resizeMode="stretch"
        style={[
          StyleSheet.absoluteFill,
          { width: "100%", height: "100%", opacity: 0.7 },
        ]}
      />
    </View>
  );
}
