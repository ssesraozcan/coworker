import React, { useEffect, useState } from "react";
import {
  Animated,
  ImageBackground,
  ScrollView,
  View,
  AccessibilityInfo,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, d, GameButton, theme, Vector } from "../features/design";
import { islands } from "../features/assets";
const houses = [
  require("../../assets/figma/94d00.svg"),
  require("../../assets/figma/8174e.svg"),
  require("../../assets/figma/7b7df.svg"),
  require("../../assets/figma/a0c58.svg"),
];
function NewHouse({ index, reduced }: { index: number; reduced: boolean }) {
  const [scale] = useState(() => new Animated.Value(reduced ? 1 : 0));
  useEffect(() => {
    if (reduced) {
      scale.setValue(1);
      return;
    }
    const animation = Animated.sequence([
      Animated.delay(440 + index * 170),
      Animated.spring(scale, {
        toValue: 1.28,
        useNativeDriver: true,
        speed: 22,
        bounciness: 2,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [scale, index, reduced]);
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: ((([0.106, 0.257, 0.659, 0.81][index] * 331) / 331) * 100 +
          "%") as `${number}%`,
        top: "48%",
        width: 34,
        height: 41,
        transform: [{ scale }],
      }}
    >
      <Vector asset={houses[index]} size={34} />
    </Animated.View>
  );
}
export default function Success() {
  const safe = useSafeAreaInsets(),
    [reduced, setReduced] = useState(true);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => sub.remove();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 22,
          paddingTop: Math.max(safe.top, 44) + 56,
          paddingBottom: Math.max(safe.bottom, 34) + 16,
          gap: 20,
        }}
      >
        <Copy title size={31}>
          Yeni dostlara{"\n"}yer açıldı.
        </Copy>
        <Copy style={d.muted}>Kıyı adasının kapasitesi artık 12 kişi.</Copy>
        <ImageBackground
          source={islands[7]}
          resizeMode="cover"
          imageStyle={{ borderRadius: 22,width:"100%",height:"100%" }}
          style={{ height: 250, overflow: "hidden", borderRadius: 22 }}
        >
          {houses.map((_, i) => (
            <NewHouse key={i} index={i} reduced={reduced} />
          ))}
        </ImageBackground>
        <Copy title size={24} style={{ color: theme.teal }}>
          +4 yeni ev
        </Copy>
        <Copy size={12} style={d.muted}>
          Adan artık 12 kişilik. Arkadaşlarını davet et.
        </Copy>
        <Copy size={11} style={d.muted}>
          Demo kapasite yükseltmesi · Gerçek ödeme yapılmadı.
        </Copy>
        <View style={{ flex: 1, minHeight: 20 }} />
        <GameButton onPress={() => router.replace("/invite")}>
          Arkadaş davet et
        </GameButton>
      </ScrollView>
    </View>
  );
}
