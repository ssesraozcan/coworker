import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  ItemImage,
  Label,
  Nav,
  Pill,
  Scene,
  styles,
  colors,
} from "../components/ui";
import { Placements } from "../components/Placements";
import { useGame } from "../state/store";
import { ItemId, prices, purchase } from "../state/model";
const names = {
  plant: "Saksı bitkisi",
  bench: "Ahşap bank",
  lantern: "Bahçe feneri",
};
export default function Decorate() {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    [selected, setSelected] = useState<ItemId>("plant"),
    [tab, setTab] = useState<"shop" | "owned">("shop"),
    [notice, setNotice] = useState(""),
    [area, setArea] = useState<"home" | "island">("home");
  function buy() {
    if (state.leaves < prices[selected]) {
      setNotice("Bu eşya için biraz daha yaprak kazanmalısın.");
      return;
    }
    update((s) => purchase(s, selected, `prop-${Date.now()}`));
    setNotice("Eşyan evine eklendi. Sürükleyerek yerini değiştir.");
  }
  return (
    <Scene image={area === "home" ? "home" : "island"}>
      <Placements area={area} editable />
      <View style={[styles.top, { top: Math.max(safe.top, 44) }]}>
        <Pill onPress={() => router.back()}>Geri</Pill>
        <Pill>♧ {state.leaves} yaprak</Pill>
      </View>
      <View
        style={{
          position: "absolute",
          top: Math.max(safe.top, 44) + 54,
          left: 18,
        }}
      >
        <Pill onPress={() => setArea(area === "home" ? "island" : "home")}>
          {area === "home" ? "Evim" : "Ortak ada"} · Değiştir
        </Pill>
      </View>
      <View
        style={[styles.bottomPanel, { bottom: Math.max(safe.bottom, 12) + 82 }]}
      >
        <View style={styles.panel}>
          <Label size={22} bold>
            Evini güzelleştir
          </Label>
          <View style={styles.row}>
            <Pill onPress={() => setTab("shop")}>
              {tab === "shop" ? "● " : ""}Mağaza
            </Pill>
            <Pill onPress={() => setTab("owned")}>
              {tab === "owned" ? "● " : ""}Eşyalarım
            </Pill>
          </View>
          {tab === "shop" ? (
            <>
              <View style={styles.row}>
                {(["plant", "bench", "lantern"] as ItemId[]).map((item) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: item === selected }}
                    key={item}
                    onPress={() => setSelected(item)}
                    style={[
                      styles.card,
                      {
                        flex: 1,
                        alignItems: "center",
                        padding: 7,
                        backgroundColor:
                          selected === item ? "#B7DBD42B" : colors.soft,
                      },
                    ]}
                  >
                    <ItemImage item={item} />
                    <Label size={11} bold>
                      {names[item]}
                    </Label>
                    <Label size={11}>{prices[item]} yaprak</Label>
                  </Pressable>
                ))}
              </View>
              <Button onPress={buy}>
                Al ve evime ekle · {prices[selected]} yaprak
              </Button>
            </>
          ) : (
            <ScrollView style={{ maxHeight: 180 }}>
              {state.placements.length === 0 ? (
                <Label>
                  Henüz eşyan yok. İlk bitkini mağazadan alabilirsin.
                </Label>
              ) : (
                state.placements.map((p) => (
                  <View key={p.id} style={[styles.row, { marginBottom: 9 }]}>
                    <ItemImage item={p.item} size={40} />
                    <View style={{ flex: 1 }}>
                      <Label size={13} bold>
                        {names[p.item]}
                      </Label>
                      <Label size={11}>
                        {p.area === "home"
                          ? "Evinde"
                          : "Ortak adaya ödünç verildi"}
                      </Label>
                    </View>
                    <Pill
                      onPress={() =>
                        update((s) => ({
                          ...s,
                          placements: s.placements.map((q) =>
                            q.id === p.id
                              ? {
                                  ...q,
                                  area: q.area === "home" ? "island" : "home",
                                }
                              : q,
                          ),
                        }))
                      }
                    >
                      {p.area === "home" ? "Paylaş" : "Geri al"}
                    </Pill>
                  </View>
                ))
              )}
            </ScrollView>
          )}
          {notice ? (
            <Label size={12}>{notice}</Label>
          ) : (
            <Label size={11}>
              Yerleştirdiğin eşyaları sahnede sürükleyebilirsin.
            </Label>
          )}
        </View>
      </View>
      <Nav />
    </Scene>
  );
}
