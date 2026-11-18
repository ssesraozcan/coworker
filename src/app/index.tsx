import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomNav,
  Copy,
  d,
  GameButton,
  Icon,
  theme,
} from "../features/design";
import { Glass, GlassScene } from "../components/Glass";
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
  const today = now.toLocaleDateString("en-CA");
  const plan = world.plans
    .filter((p) => p.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const minutes = state.records
      .filter(
        (r) => new Date(r.completedAt).toDateString() === now.toDateString(),
      )
      .reduce((n, r) => n + r.minutes, 0),
    target = state.routine.minutes;
  const weeklyDays = new Set(
    state.records
      .filter(
        (r) =>
          r.completedAt >=
          new Date(
            week[0].getFullYear(),
            week[0].getMonth(),
            week[0].getDate(),
          ).getTime(),
      )
      .map((r) => new Date(r.completedAt).toDateString()),
  ).size;
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
    <GlassScene style={s.screen}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={s.tealGlow} />
        <View style={s.purpleGlow} />
      </View>
      <View
        testID="fixed-dashboard-calendar"
        style={{
          paddingHorizontal: 16,
          paddingTop: Math.max(safe.top, 44) + 10,
          paddingBottom: 14,
          gap: 10,
        }}
      >
        <View style={[d.row, { justifyContent: "space-between" }]}>
          <View style={{ gap: 5, flex: 1 }}>
            <Copy size={10} style={d.muted}>
              {now
                .toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  weekday: "long",
                })
                .toLocaleUpperCase("tr-TR")}
            </Copy>
            <Copy title size={25}>
              Günün sana ait, Esra.
            </Copy>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Bildirimler"
            onPress={() => router.push("/preferences?section=notifications")}
          >
            <Glass style={s.bell}>
              <Icon name="bell" size={20} />
            </Glass>
          </Pressable>
        </View>
        <Glass style={s.week}>
          {week.map((date) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${date.toLocaleDateString("tr-TR")} takvimini aç`}
              key={date.toISOString()}
              onPress={() =>
                router.push({
                  pathname: "/calendar",
                  params: { date: date.toLocaleDateString("en-CA") },
                })
              }
              style={[
                s.day,
                date.toDateString() === now.toDateString() && s.selected,
              ]}
            >
              <Copy size={10} style={d.muted}>
                {date.toLocaleDateString("tr-TR", { weekday: "short" })}
              </Copy>
              <Copy bold size={17}>
                {date.getDate()}
              </Copy>
            </Pressable>
          ))}
        </Glass>
      </View>
      <ScrollView
        testID="dashboard-cards"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: Math.max(safe.bottom, 14) + 94,
          gap: 16,
        }}
      >
        <Copy size={11} style={d.muted}>
          Sıradaki çalışman
        </Copy>
        <Glass style={s.study}>
          <View style={{ flex: 1, gap: 7 }}>
            <Copy size={10} style={{ color: theme.teal }}>
              {plan
                ? `${plan.time} · ${plan.minutes} dakika`
                : "25 dakika · Kendine zaman ayır"}
            </Copy>
            <Copy bold size={17}>
              {plan?.title || "İlk odaklanma oturumun"}
            </Copy>
            <Copy size={10} style={d.muted}>
              {plan?.note || "Bir hedef seç, sakin bir başlangıç yap."}
            </Copy>
          </View>
          <GameButton
            style={{ width: 90, alignSelf: "center" }}
            onPress={start}
          >
            {state.session ? "Devam et" : "Başla"}
          </GameButton>
        </Glass>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Çalışma dünyama git"
          onPress={() => router.push("/world")}
        >
          <ImageBackground
            source={require("../../assets/figma/fc708.png")}
            imageStyle={{ borderRadius: 24, width: "100%", height: "100%" }}
            style={s.island}
          >
            <Glass
              style={{
                padding: 12,
                gap: 3,
                backgroundColor: "#13243988",
                borderRadius: 20,
              }}
            >
              <Copy title size={18}>
                Çalışma dünyama git
              </Copy>
              <Copy size={10}>Evin, adan ve arkadaşların seni bekliyor.</Copy>
            </Glass>
          </ImageBackground>
        </Pressable>
        <Glass style={{ padding: 14, gap: 8 }}>
          <View style={[d.row, { justifyContent: "space-between" }]}>
            <Copy size={11}>Bugünkü hedefin</Copy>
            <Copy size={11} style={d.muted}>
              {minutes} / {target} dakika
            </Copy>
          </View>
          <View style={s.track}>
            <View
              style={[
                s.progress,
                { width: `${Math.min(100, (minutes / target) * 100)}%` },
              ]}
            />
          </View>
          <Copy size={10} style={d.muted}>
            {minutes
              ? "Bir oturum tamamladın. Güzel bir başlangıç."
              : "Her oturum, kendin için küçük bir adım."}
          </Copy>
        </Glass>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Haftalık ödüllerimi gör"
          onPress={() => router.push("/rewards")}
        >
          <Glass
            style={{
              padding: 12,
              gap: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/game/plant.png")}
              resizeMode="contain"
              style={{ width: 42, height: 42 }}
            />
            <View style={{ gap: 5 }}>
              <Copy size={12}>Bir gün daha, yeni bir bitki.</Copy>
              <Copy size={10} style={d.muted}>
                Haftalık hedef · {Math.min(3, weeklyDays)} / 3 gün
              </Copy>
            </View>
          </Glass>
        </Pressable>
      </ScrollView>
      <BottomNav />
    </GlassScene>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  tealGlow: {
    position: "absolute",
    left: -140,
    top: 100,
    width: 230,
    height: 260,
    borderRadius: 180,
    backgroundColor: "#6AC7AF14",
    boxShadow: "0px 0px 90px 80px #6AC7AF18",
  },
  purpleGlow: {
    position: "absolute",
    right: -150,
    top: 400,
    width: 200,
    height: 220,
    borderRadius: 160,
    backgroundColor: "#8A78CB12",
    boxShadow: "0px 0px 90px 80px #8A78CB16",
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  week: {
    height: 76,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  day: {
    flex: 1,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selected: { backgroundColor: "#B7DBD42B", borderColor: "#C5F2E866" },
  study: {
    padding: 16,
    minHeight: 117,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  island: {
    height: 158,
    justifyContent: "flex-end",
    padding: 10,
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFFFFF38",
  },
  track: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "#FFFFFF19",
    overflow: "hidden",
  },
  progress: { height: 5, borderRadius: 4, backgroundColor: theme.teal },
});
