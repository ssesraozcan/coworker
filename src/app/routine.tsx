import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Back, Copy, d, GameButton, theme } from "../features/design";
import { useGame } from "../state/store";
import { setRoutine } from "../state/model";
export default function Routine() {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    [minutes, setMinutes] = useState(state.routine.minutes),
    [days, setDays] = useState(state.routine.days);
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: Math.max(safe.top, 44),
          paddingBottom: 150,
          gap: 28,
        }}
      >
        <View style={d.row}>
          <Back onPress={() => router.replace("/profile")} />
          <Copy title size={23}>
            Rutinimi düzenle
          </Copy>
        </View>
        <View style={{ gap: 8, marginTop: 10 }}>
          <Copy title size={25}>
            Kendi ritmini kur.
          </Copy>
          <Copy size={13} style={d.muted}>
            Sana uyan bir hedef belirle.{"\n"}İstediğin zaman değiştirebilirsin.
          </Copy>
        </View>
        <View style={[d.panel, { padding: 20, gap: 18 }]}>
          <Copy size={12} bold>
            Günlük çalışma hedefin
          </Copy>
          <Copy title size={32}>
            {minutes} dakika
          </Copy>
          <View style={[d.row, { gap: 7 }]}>
            {[30, 60, 75, 90, 120].map((n) => (
              <Pressable
                key={n}
                accessibilityRole="radio"
                accessibilityLabel={`${n} dakika`}
                accessibilityState={{ checked: minutes === n }}
                onPress={() => setMinutes(n)}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: minutes === n ? "#B7DBD433" : "#FFFFFF08",
                  borderWidth: 1,
                  borderColor: minutes === n ? "#B7DBD455" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Copy bold size={12}>
                  {n}
                </Copy>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ gap: 14 }}>
          <Copy bold>Çalışma günlerin</Copy>
          <Copy size={12} style={d.muted}>
            Hedefin bu günlerde geçerli olur.
          </Copy>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(
              (label, i) => (
                <Pressable
                  key={label}
                  accessibilityRole="checkbox"
                  accessibilityLabel={label}
                  accessibilityState={{ checked: days.includes(i) }}
                  onPress={() =>
                    setDays((d) =>
                      d.includes(i) ? d.filter((v) => v !== i) : [...d, i],
                    )
                  }
                  style={{
                    flex: 1,
                    minHeight: 42,
                    borderRadius: 22,
                    backgroundColor: days.includes(i)
                      ? "#B7DBD426"
                      : "#FFFFFF06",
                    borderWidth: 1,
                    borderColor: days.includes(i) ? "#B7DBD433" : "#FFFFFF09",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Copy size={11} bold>
                    {label}
                  </Copy>
                </Pressable>
              ),
            )}
          </View>
          {!days.length && (
            <Copy size={12} style={{ color: "#E9B18D" }}>
              En az bir çalışma günü seç.
            </Copy>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: Math.max(safe.bottom, 34) + 20,
          gap: 18,
        }}
      >
        <Copy size={11} style={[d.muted, { textAlign: "center" }]}>
          Planladığın çalışma oturumları korunur.
        </Copy>
        <GameButton
          disabled={!days.length}
          onPress={() => {
            update((s) => setRoutine(s, { minutes, days }));
            router.replace("/profile");
          }}
        >
          Rutinimi kaydet
        </GameButton>
      </View>
    </View>
  );
}
