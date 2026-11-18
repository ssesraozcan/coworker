import React from "react";
import { Image, View, useWindowDimensions } from "react-native";
import { useGame } from "../state/store";
import { objectImages } from "../features/catalog";
export function ObjectPlacements({ area }: { area: "home" | "island" }) {
  const { state } = useGame(),
    { width, height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
      {state.objectPlacements
        .filter((p) => p.area === area)
        .map((p) => (
          <Image
            key={p.objectId}
            accessibilityLabel="Yerleştirdiğin eşya"
            source={objectImages[p.objectId]}
            resizeMode="contain"
            style={{
              position: "absolute",
              left: p.x * width - 52,
              top: p.y * height - 52,
              width: 105,
              height: 105,
            }}
          />
        ))}
    </View>
  );
}
