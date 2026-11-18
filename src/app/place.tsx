import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Back, Copy, GameButton, theme } from "../features/design";
import { Glass, GlassScene } from "../components/Glass";
import { GameNav } from "../features/GameNav";
import { catalog, objectImages } from "../features/catalog";
import { useGame } from "../state/store";
import { placeObject } from "../state/model";
export default function Place() {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    params = useLocalSearchParams<{ id: string; area: string }>(),
    id = Number(params.id),
    area = params.area === "island" ? "island" : "home",
    { width, height } = useWindowDimensions(),
    [point, setPoint] = useState({ x: 0.58, y: 0.52 });
  const object = catalog.find((o) => o.id === id),
    allowed = state.ownedObjects.includes(id);
  if (!object || !allowed)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.bg,
          padding: 24,
          paddingTop: 60,
          gap: 20,
        }}
      >
        <Back />
        <Copy>Bu eşya henüz dolabında yok.</Copy>
      </View>
    );
  return (
    <GlassScene style={{ flex: 1, backgroundColor: theme.bg }}>
      <ImageBackground
        source={
          area === "home"
            ? require("../../assets/figma/fc708.png")
            : require("../../assets/figma/commons-interior.png")
        }
        resizeMode="cover"
        imageStyle={{ width: "100%", height: "100%" }}
        style={{ flex: 1 }}
      >
        <Pressable
          testID="placement-surface"
          accessibilityRole="button"
          accessibilityLabel="Eşyanın yerini seç"
          onPress={(e) => {
            const event = e.nativeEvent,
              x = Number.isFinite(event.pageX) ? event.pageX : event.locationX,
              y = Number.isFinite(event.pageY) ? event.pageY : event.locationY;
            if (!Number.isFinite(x) || !Number.isFinite(y)) return;
            setPoint({
              x: Math.max(0.1, Math.min(0.9, x / width)),
              y: Math.max(0.22, Math.min(0.68, y / height)),
            });
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            source={objectImages[id]}
            resizeMode="contain"
            style={{
              position: "absolute",
              left: point.x * width - 52,
              top: point.y * height - 52,
              width: 105,
              height: 105,
            }}
          />
          <View
            style={{
              position: "absolute",
              left: point.x * width - 44,
              top: point.y * height + 42,
              width: 88,
              height: 20,
              borderRadius: 44,
              borderWidth: 2,
              borderColor: "#B7DBD4",
              backgroundColor: "#B7DBD426",
            }}
          />
        </Pressable>
        <Glass
          style={{
            position: "absolute",
            top: Math.max(safe.top, 44),
            left: 20,
            right: 20,
            padding: 10,
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            backgroundColor: "#142135A6",
          }}
        >
          <Back onPress={() => router.back()} />
          <View>
            <Copy title size={23}>
              {area === "home" ? "Yerini seç" : "Ortak alan"}
            </Copy>
            <Copy size={10}>
              {object.name} ·{" "}
              {area === "home" ? "Evimin bahçesi" : "Ortak alan"}
            </Copy>
          </View>
        </Glass>
        <View
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: Math.max(safe.bottom, 16) + 96,
            gap: 12,
          }}
        >
          <Glass style={{ padding: 12, backgroundColor: "#141A2ECC" }}>
            <Copy size={11} style={{ textAlign: "center" }}>
              {area === "home"
                ? "Bir konum seç, sonra yerleştir."
                : "Eşyan sana ait kalır. Dilediğinde geri alabilirsin."}
            </Copy>
          </Glass>
          <GameButton
            onPress={() => {
              update((s) => placeObject(s, id, area, point.x, point.y));
              router.replace(area === "home" ? "/home" : "/world");
            }}
          >
            Buraya yerleştir
          </GameButton>
        </View>
        <GameNav selected={area === "home" ? "Evim" : "Ada"} />
      </ImageBackground>
    </GlassScene>
  );
}
