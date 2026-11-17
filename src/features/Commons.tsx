import React, { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, d, GameButton, theme } from "./design";
import { useGame } from "../state/store";
export function Commons({ onLeave }: { onLeave: () => void }) {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    [goal, setGoal] = useState(""),
    [minutes, setMinutes] = useState(25);
  function start() {
    if (!state.session)
      update((s) => ({
        ...s,
        session: {
          id: "shared-" + Date.now(),
          duration: minutes * 60,
          remaining: minutes * 60,
          deadline: Date.now() + minutes * 60000,
          goal: goal.trim() || "Ortak alanda odaklanıyorum",
          shared: true,
        },
      }));
    router.push({ pathname: "/focus", params: { shared: "1" } });
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingTop: Math.max(safe.top, 44),
        paddingBottom: Math.max(safe.bottom, 34) + 16,
        paddingHorizontal: 20,
      }}
    >
      <View style={[d.panel, { backgroundColor: "#20273FEE" }]}>
        <View style={[d.row, { justifyContent: "space-between" }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adaya dön"
            onPress={onLeave}
            style={{ minWidth: 44, minHeight: 44, justifyContent: "center" }}
          >
            <Copy>‹ Adaya dön</Copy>
          </Pressable>
          <Copy size={11} style={{ color: theme.teal }}>
            ORTAK ÇALIŞMA ALANI
          </Copy>
        </View>
        <Copy title size={23}>
          Aynı masada buluşalım.
        </Copy>
        <Copy size={12} style={d.muted}>
          Kendi ritminde çalış, adanın sakinliğine eşlik et.
        </Copy>
      </View>
      <View
        style={[d.panel, { backgroundColor: "#20273FF2", maxHeight: "48%" }]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 14 }}
        >
          <Copy title size={20}>
            Masadaki yerin hazır.
          </Copy>
          <TextInput
            accessibilityLabel="Ortak çalışma hedefin"
            placeholder="Bugün neye odaklanacaksın?"
            placeholderTextColor={theme.muted}
            value={goal}
            onChangeText={setGoal}
            style={d.input}
            maxLength={90}
          />
          <View style={d.row}>
            {[15, 25, 50].map((n) => (
              <Pressable
                key={n}
                accessibilityRole="radio"
                accessibilityState={{ checked: minutes === n }}
                onPress={() => setMinutes(n)}
                style={{
                  flex: 1,
                  minHeight: 44,
                  borderRadius: 14,
                  backgroundColor: minutes === n ? theme.purple : theme.surface,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Copy>{n} dk</Copy>
              </Pressable>
            ))}
          </View>
          <GameButton onPress={start}>
            {state.session ? "Oturumuma dön" : "Birlikte odaklan"}
          </GameButton>
          <Copy size={10} style={d.muted}>
            Yerel demo · Canlı arkadaş oturumları henüz bağlı değil.
          </Copy>
        </ScrollView>
      </View>
    </View>
  );
}
