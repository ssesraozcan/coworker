import React from "react";
import { Switch, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Back, Copy, d, theme, Icon } from "../features/design";
import { useGame } from "../state/store";
export default function Preferences() {
  const safe = useSafeAreaInsets(),
    params = useLocalSearchParams<{ section: string }>(),
    { state, update } = useGame();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: Math.max(safe.top, 44),
          gap: 26,
        }}
      >
        <Back />
        <Copy title size={27}>
          {params.section === "notifications"
            ? "Bildirimler"
            : "Ses ve görünüm"}
        </Copy>
        <View style={d.panel}>
          <View style={[d.row, { justifyContent: "space-between" }]}>
            <Copy bold>Plan hatırlatıcıları</Copy>
            <Switch
              accessibilityLabel="Plan hatırlatıcıları tercihi"
              value={state.notifications}
              onValueChange={(v) => update((s) => ({ ...s, notifications: v }))}
              trackColor={{ true: "#81CCC2" }}
            />
          </View>
          <Copy size={12} style={d.muted}>
            Tercihin kaydedilir. Cihaz bildirimlerinin gönderimi henüz bu
            önizlemeye bağlı değil.
          </Copy>
        </View>
        <View style={d.panel}>
          <Copy bold>Görünüm</Copy>
          <View style={d.row}>
            <Icon name="moon" />
            <Copy>Koyu · Odağını koruyan sade görünüm</Copy>
          </View>
        </View>
        <Copy size={12} style={d.muted}>
          Yağmur ve deniz seslerini odaklanma ekranında açabilirsin.
        </Copy>
      </ScrollView>
    </View>
  );
}
