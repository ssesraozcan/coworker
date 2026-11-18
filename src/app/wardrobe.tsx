import React, { useState } from "react";
import { View, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  ItemImage,
  Label,
  Nav,
  Pill,
  styles,
  colors,
  art,
} from "../components/ui";
import { useGame } from "../state/store";
export default function Wardrobe() {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    [selected, setSelected] = useState(state.outfit),
    [saved, setSaved] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#141A2E" }}>
      <Image
        source={art.avatar}
        resizeMode="contain"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70%",
        }}
      />
      <View style={[styles.top, { top: Math.max(safe.top, 44) }]}>
        <Pill>Gardırobum</Pill>
        <Pill>♧ {state.leaves} yaprak</Pill>
      </View>
      <View
        style={[styles.bottomPanel, { bottom: Math.max(safe.bottom, 12) + 82 }]}
      >
        <View style={styles.panel}>
          <Label size={23} bold>
            Tarzını yansıt
          </Label>
          <Label>Üst giyim</Label>
          <View style={styles.row}>
            {(["hoodie", "shirt", "sweatshirt"] as const).map((item, i) => (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: selected === item }}
                onPress={() => {
                  setSelected(item);
                  setSaved(false);
                }}
                style={[
                  styles.card,
                  {
                    flex: 1,
                    alignItems: "center",
                    padding: 8,
                    backgroundColor:
                      selected === item ? "#B7DBD42B" : colors.soft,
                  },
                ]}
              >
                <ItemImage item={item} size={61} />
                <Label size={11} bold>
                  {["Kampüs", "Ada yeşili", "Gece mavisi"][i]}
                </Label>
                <Label size={11}>
                  {state.outfit === item ? "Üzerinde" : "Sende var"}
                </Label>
              </Pressable>
            ))}
          </View>
          <Button
            onPress={() => {
              update((s) => ({ ...s, outfit: selected }));
              setSaved(true);
            }}
          >
            {saved ? "Kombin kaydedildi" : "Kombini kaydet"}
          </Button>
          <Label size={11}>
            Kıyafet seçimin kaydedilir. Avatarın canlı kıyafet değişimi sonraki
            sürümde eklenecek.
          </Label>
        </View>
      </View>
      <Nav />
    </View>
  );
}
