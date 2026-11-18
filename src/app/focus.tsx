import React, { useEffect, useRef, useState } from "react";
import { View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Scene } from "../components/ui";
import { Glass } from "../components/Glass";
import { Copy, d, GameButton } from "../features/design";
import { useGame } from "../state/store";
import { remaining } from "../state/model";
export default function Focus() {
  const params = useLocalSearchParams<{ shared?: string; sound?: string }>(),
    safe = useSafeAreaInsets(),
    { state, update } = useGame(),
    [, tick] = useState(0),
    [sound, setSound] = useState<"rain" | "sea" | "off">(
      params.sound === "rain" ? "rain" : params.sound === "sea" ? "sea" : "off",
    );
  const rain = useAudioPlayer(require("../../assets/audio/rain.wav")),
    sea = useAudioPlayer(require("../../assets/audio/sea.wav")),
    session = state.session,
    seconds = session ? remaining(session) : 0,
    deadline = session?.deadline,
    sessionId = useRef(session?.id);
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    const id = setInterval(() => tick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (
      !session &&
      sessionId.current &&
      state.records.some((r) => r.id === sessionId.current)
    )
      router.replace("/session-summary");
  }, [session, state.records]);
  // Native audio-player properties are intentionally mutable.
  useEffect(() => {
    /* eslint-disable react-hooks/immutability -- Expo Audio exposes mutable native-player properties. */
    rain.loop = true;
    sea.loop = true;
    rain.volume = 0.3;
    sea.volume = 0.3;
    /* eslint-enable react-hooks/immutability */
    rain.pause();
    sea.pause();
    if (deadline) {
      if (sound === "rain") rain.play();
      if (sound === "sea") sea.play();
    }
    return () => {
      rain.pause();
      sea.pause();
    };
  }, [sound, deadline, rain, sea]);
  function pause() {
    update((s) =>
      s.session
        ? {
            ...s,
            session: s.session.deadline
              ? {
                  ...s.session,
                  remaining: remaining(s.session),
                  deadline: null,
                }
              : {
                  ...s.session,
                  deadline: Date.now() + s.session.remaining * 1000,
                },
          }
        : s,
    );
  }
  return (
    <Scene image={params.shared === "1" ? "commons" : "desk"}>
      <View
        style={{
          position: "absolute",
          top: Math.max(safe.top, 44),
          left: 20,
          right: 20,
          gap: 14,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            params.shared === "1" ? "Ortak alana dön" : "Günüme dön"
          }
          onPress={() =>
            params.shared === "1" ? router.back() : router.replace("/")
          }
          style={{ alignSelf: "flex-start" }}
        >
          <Glass
            style={{
              paddingHorizontal: 16,
              paddingVertical: 11,
              backgroundColor: "#14213580",
              borderRadius: 18,
            }}
          >
            <Copy size={12}>
              {params.shared === "1" ? "‹ Ortak alana dön" : "‹ Günüm"}
            </Copy>
          </Glass>
        </Pressable>
        <Glass style={{ padding: 16, backgroundColor: "#14213530", gap: 5 }}>
          <Copy size={10} bold>
            ŞU AN ÇALIŞTIĞIM
          </Copy>
          <Copy size={15} bold>
            {session?.goal || "Oturum tamamlandı"}
          </Copy>
        </Glass>
      </View>
      <Glass
        style={{
          position: "absolute",
          bottom: Math.max(safe.bottom, 34) + 40,
          left: 16,
          right: 16,
          padding: 16,
          backgroundColor: "#14213540",
        }}
      >
        {session ? (
          <View style={[d.row, { alignItems: "stretch" }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Copy size={10}>Kalan süre</Copy>
              <Copy title size={36} style={{ fontVariant: ["tabular-nums"] }}>
                {Math.floor(seconds / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(seconds % 60).toString().padStart(2, "0")}
              </Copy>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ambiyans değiştir"
                onPress={() =>
                  setSound((v) =>
                    v === "off" ? "rain" : v === "rain" ? "sea" : "off",
                  )
                }
                style={{ minHeight: 28, justifyContent: "center" }}
              >
                <Copy size={10}>
                  {sound === "rain"
                    ? "Yağmur ambiyansı"
                    : sound === "sea"
                      ? "Deniz ambiyansı"
                      : "Sessiz"}
                </Copy>
              </Pressable>
            </View>
            <View style={{ width: 145, gap: 8, justifyContent: "center" }}>
              <GameButton onPress={pause}>
                {session.deadline ? "Duraklat" : "Devam et"}
              </GameButton>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  update((s) => ({ ...s, session: null }));
                  router.replace("/home");
                }}
                style={{
                  minHeight: 32,
                  borderRadius: 16,
                  backgroundColor: "#142135A6",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Copy size={10}>Oturumu bitir · Ödül kazanılmaz</Copy>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            <Copy title size={23}>
              Çalışmaya hazır mısın?
            </Copy>
            <GameButton onPress={() => router.replace("/home")}>
              Evime dön
            </GameButton>
          </View>
        )}
      </Glass>
    </Scene>
  );
}
