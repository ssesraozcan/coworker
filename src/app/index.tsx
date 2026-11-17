import React from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNav, Copy, d, GameButton, theme } from "../features/design";
import { useWorld } from "../features/world-store";
import { useGame } from "../state/store";
export default function Dashboard() {
  const safe = useSafeAreaInsets(),
    { world } = useWorld(),
    { state, update } = useGame(),
    now = new Date();
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - ((now.getDay() + 6) % 7) + i);
    return date;
  });
  const plan = world.plans
    .filter((p) => p.date >= now.toLocaleDateString("en-CA"))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const minutes = state.records
    .filter(
      (r) => new Date(r.completedAt).toDateString() === now.toDateString(),
    )
    .reduce((n, r) => n + r.minutes, 0);
  function start() {
    if (!state.session)
      update((s) => ({
        ...s,
        session: {
          id: "session-" + Date.now(),
          duration: (plan?.minutes || 25) * 60,
          remaining: (plan?.minutes || 25) * 60,
          deadline: Date.now() + (plan?.minutes || 25) * 60000,
          goal: plan?.title || "Kendime zaman ayırıyorum",
          shared: false,
        },
      }));
    router.push("/focus");
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: Math.max(safe.top, 44) + 10,
          paddingBottom: 130,
          gap: 16,
        }}
      >
        <Copy size={11} style={d.muted}>
          {now
            .toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              weekday: "long",
            })
            .toLocaleUpperCase("tr-TR")}
        </Copy>
        <Copy title size={26}>
          Günün sana ait.
        </Copy>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {week.map((date) => (
            <Pressable
              key={date.toISOString()}
              onPress={() => router.push("/calendar")}
              style={{
                width: "13%",
                paddingVertical: 10,
                gap: 4,
                alignItems: "center",
                borderRadius: 17,
                backgroundColor:
                  date.toDateString() === now.toDateString()
                    ? theme.purple
                    : "transparent",
              }}
            >
              <Copy size={11} style={d.muted}>
                {date.toLocaleDateString("tr-TR", { weekday: "short" })}
              </Copy>
              <Copy bold size={18}>
                {date.getDate()}
              </Copy>
            </Pressable>
          ))}
        </View>
        <Copy size={12} style={d.muted}>
          Sıradaki çalışman
        </Copy>
        <View
          style={[
            d.panel,
            { borderLeftColor: theme.purple, borderLeftWidth: 4 },
          ]}
        >
          <Copy size={11} style={{ color: theme.teal }}>
            {plan
              ? `${plan.time} · ${plan.minutes} dakika`
              : "25 dakika · Kendine zaman ayır"}
          </Copy>
          <Copy bold size={18}>
            {plan?.title || "İlk odaklanma oturumun"}
          </Copy>
          <Copy size={12} style={d.muted}>
            {plan?.note || "Bir hedef seç, sakin bir başlangıç yap."}
          </Copy>
          <GameButton onPress={start}>
            {state.session ? "Oturumuma dön" : "Başla"}
          </GameButton>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Çalışma dünyama git"
          onPress={() => router.push("/world")}
        >
          <ImageBackground
            source={require("../../assets/figma/fc708.png")}
            imageStyle={{ borderRadius: 23,width:"100%",height:"100%" }}
            style={{ height: 158, justifyContent: "flex-end", padding: 12 }}
          >
            <View style={[d.panel, { padding: 13 }]}>
              <Copy bold size={18}>
                Çalışma dünyama git
              </Copy>
              <Copy size={11} style={d.muted}>
                Evin, adan ve arkadaşların seni bekliyor.
              </Copy>
            </View>
          </ImageBackground>
        </Pressable>
        <View style={d.panel}>
          <View style={[d.row, { justifyContent: "space-between" }]}>
            <Copy>Bugünkü hedefin</Copy>
            <Copy size={12} style={d.muted}>
              {minutes} / 75 dakika
            </Copy>
          </View>
          <View
            style={{ height: 5, borderRadius: 4, backgroundColor: "#3B4664" }}
          >
            <View
              style={{
                height: 5,
                borderRadius: 4,
                width: `${Math.min(100, (minutes / 75) * 100)}%`,
                backgroundColor: theme.teal,
              }}
            />
          </View>
          <Copy size={11} style={d.muted}>
            Her oturum, kendin için küçük bir adım.
          </Copy>
        </View>
        <Pressable onPress={() => router.push("/rewards")} style={d.panel}>
          <Copy>Bir gün daha, yeni bir bitki.</Copy>
          <Copy size={11} style={d.muted}>
            Ödüllerini ve ilerlemeni gör →
          </Copy>
        </Pressable>
      </ScrollView>
      <BottomNav />
    </View>
  );
}
