import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Glass } from "../components/Glass";
import { WardrobeBackdrop } from "../components/WardrobeBackdrop";
import { Copy, d, GameButton, theme } from "../features/design";
import { GameNav, GAME_NAV_SPACE } from "../features/GameNav";
import { useGame } from "../state/store";
import { claim, rewards } from "../state/model";
export default function Rewards() {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <WardrobeBackdrop />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: Math.max(safe.top, 44) + 40,
          paddingBottom: GAME_NAV_SPACE + safe.bottom,
          gap: 14,
        }}
      >
        <Copy title size={26}>
          Emeğinin hatıraları
        </Copy>
        {rewards(state).map((r) => {
          const taken = state.claims.includes(r.id),
            eligible = r.value >= r.target;
          return (
            <Glass
              key={r.id}
              style={{ padding: 18, gap: 10, backgroundColor: "#14213566" }}
            >
              <Copy size={10} style={d.muted}>
                {r.label}
              </Copy>
              <Copy bold size={17}>
                {r.title}
              </Copy>
              <Copy size={11}>
                {Math.min(r.value, r.target)} / {r.target} · {r.amount} yaprak
              </Copy>
              {eligible && !taken && (
                <GameButton onPress={() => update((s) => claim(s, r.id))}>
                  Ödülümü al
                </GameButton>
              )}
              {taken && (
                <Copy size={11} style={{ color: theme.teal }}>
                  Ödül alındı
                </Copy>
              )}
            </Glass>
          );
        })}
        <Glass style={{ padding: 18, gap: 10, backgroundColor: "#14213566" }}>
          <Copy size={10} style={d.muted}>
            BİRLİKTE
          </Copy>
          <Copy bold size={17}>
            Arkadaşınla odaklan
          </Copy>
          <Copy size={11}>
            {state.records.filter((r) => r.shared).length} ortak oturum
          </Copy>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/world")}
          >
            <Copy size={11} style={{ color: theme.teal }}>
              Ortak çalışma alanına git →
            </Copy>
          </Pressable>
        </Glass>
        <Copy size={11} style={{ textAlign: "center", marginTop: 8 }}>
          Ara verdiğinde kazandıkların sende kalır.
        </Copy>
      </ScrollView>
      <GameNav selected="Dolabım" />
    </View>
  );
}
