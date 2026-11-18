import React, { useState } from "react";
import { View, TextInput, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Scene } from "../components/ui";
import { Glass } from "../components/Glass";
import { ObjectPlacements } from "../components/ObjectPlacements";
import { Placements } from "../components/Placements";
import { Copy, d, GameButton } from "../features/design";
import { GameNav } from "../features/GameNav";
import { useGame } from "../state/store";
export default function Home() {
  const safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    [minutes, setMinutes] = useState(25),
    [goal, setGoal] = useState("Matematik · Türev / 20 soru"),
    [sound, setSound] = useState<"rain" | "sea" | "off">("rain"),
    [configure, setConfigure] = useState(false);
  function start() {
    if (!state.session)
      update((s) => ({
        ...s,
        session: {
          id: `session-${Date.now()}`,
          duration: minutes * 60,
          remaining: minutes * 60,
          deadline: Date.now() + minutes * 60000,
          goal: goal.trim() || "Kendime zaman ayırıyorum",
          shared: false,
        },
      }));
    router.push({ pathname: "/focus", params: { sound } });
  }
  return (
    <Scene image="home">
      <Placements area="home" />
      <ObjectPlacements area="home" />
      <View
        style={{ position: "absolute", left: 20, top: Math.max(safe.top, 44) }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adaya dön"
          onPress={() => router.replace("/world")}
        >
          <Glass
            style={{
              paddingHorizontal: 15,
              height: 40,
              justifyContent: "center",
              backgroundColor: "#14213599",
              borderRadius: 18,
            }}
          >
            <Copy size={12}>‹ Dünyam</Copy>
          </Glass>
        </Pressable>
      </View>
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Math.max(safe.bottom, 16) + 94,
          gap: 12,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Evimi düzenle"
          onPress={() => router.push("/decorate")}
          style={{ alignSelf: "flex-end" }}
        >
          <Glass
            style={{
              paddingHorizontal: 18,
              height: 38,
              justifyContent: "center",
              backgroundColor: "#14213599",
              borderRadius: 18,
            }}
          >
            <Copy size={12}>Evimi düzenle</Copy>
          </Glass>
        </Pressable>
        <Glass style={{ padding: 12, gap: 12, backgroundColor: "#14213530" }}>
          <View style={d.row}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Çalışma hedefini ve süreni düzenle"
              onPress={() => setConfigure(true)}
              style={[
                d.input,
                { flex: 1, minHeight: 36, padding: 10, borderRadius: 16 },
              ]}
            >
              <Copy size={11}>{minutes} dakika</Copy>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ambiyans seç"
              onPress={() =>
                setSound((s) =>
                  s === "rain" ? "sea" : s === "sea" ? "off" : "rain",
                )
              }
              style={[
                d.input,
                { flex: 1, minHeight: 36, padding: 10, borderRadius: 16 },
              ]}
            >
              <Copy size={11}>
                {sound === "rain"
                  ? "Yağmur"
                  : sound === "sea"
                    ? "Deniz"
                    : "Sessiz"}
              </Copy>
            </Pressable>
          </View>
          <GameButton onPress={start}>
            {state.session ? "Oturumuma dön" : "Odaklanmaya başla"}
          </GameButton>
        </Glass>
      </View>
      <GameNav selected="Evim" />
      <Modal
        visible={configure}
        transparent
        animationType="fade"
        onRequestClose={() => setConfigure(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#0009",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View style={d.panel}>
            <Copy title size={23}>
              Neye odaklanacaksın?
            </Copy>
            <TextInput
              accessibilityLabel="Çalışma hedefin"
              style={d.input}
              value={goal}
              onChangeText={setGoal}
              maxLength={90}
            />
            <View style={d.row}>
              {[15, 25, 50].map((n) => (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityLabel={`${n} dakika`}
                  accessibilityState={{ checked: minutes === n }}
                  onPress={() => setMinutes(n)}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 18,
                    backgroundColor: minutes === n ? "#B7DBD42B" : "#FFFFFF08",
                  }}
                >
                  <Copy size={12}>{n} dakika</Copy>
                </Pressable>
              ))}
            </View>
            <GameButton onPress={() => setConfigure(false)}>Tamam</GameButton>
          </View>
        </View>
      </Modal>
    </Scene>
  );
}
