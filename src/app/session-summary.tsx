import React from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, d, GameButton, theme, Icon } from "../features/design";
import { useGame } from "../state/store";
export default function Summary() {
  const safe = useSafeAreaInsets(),
    { state } = useGame(),
    last = state.records.at(-1),
    today = new Date().toDateString(),
    minutes = state.records
      .filter((r) => new Date(r.completedAt).toDateString() === today)
      .reduce((n, r) => n + r.minutes, 0);
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: Math.max(safe.top, 44) + 40,
          gap: 24,
        }}
      >
        <Icon name="check-circle" size={42} color={theme.teal} />
        <Copy title size={30}>
          Kendine ayırdığın zaman.
        </Copy>
        <Copy size={13} style={d.muted}>
          Küçük bir adım daha tamamlandı.
        </Copy>
        <View style={d.panel}>
          <Copy size={11} style={{ color: theme.teal }}>
            EMEĞİNİN KARŞILIĞI
          </Copy>
          <Copy title size={34}>
            +{last ? 25 : 0} yaprak
          </Copy>
          <Copy size={12}>
            {last
              ? `${last.minutes} dakika odaklandın.`
              : "Henüz tamamlanan oturum yok."}
          </Copy>
        </View>
        <View style={d.panel}>
          <Copy bold>Bugünkü hedefin</Copy>
          <Copy>
            {minutes} / {state.routine.minutes} dakika
          </Copy>
          <View
            style={{ height: 5, borderRadius: 3, backgroundColor: "#FFFFFF16" }}
          >
            <View
              style={{
                height: 5,
                borderRadius: 3,
                backgroundColor: theme.teal,
                width: `${Math.min(100, (minutes / state.routine.minutes) * 100)}%`,
              }}
            />
          </View>
        </View>
        <GameButton onPress={() => router.replace("/")}>Günüme dön</GameButton>
        <GameButton onPress={() => router.replace("/rewards")}>
          Ödüllerimi gör
        </GameButton>
      </ScrollView>
    </View>
  );
}
