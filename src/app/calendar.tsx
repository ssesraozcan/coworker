import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNav, Copy, d, GameButton, theme } from "../features/design";
import { useWorld } from "../features/world-store";
export default function Calendar() {
  const safe = useSafeAreaInsets(),
    { world, setWorld } = useWorld(),
    [day, setDay] = useState(new Date().toLocaleDateString("en-CA"));
  const now = new Date(),
    days = Array.from(
      { length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() },
      (_, i) => new Date(now.getFullYear(), now.getMonth(), i + 1),
    );
  const offset = (days[0].getDay() + 6) % 7;
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: Math.max(safe.top, 44),
          paddingBottom: 130,
          gap: 20,
        }}
      >
        <Copy title size={28}>
          Kendi ritmini kur.
        </Copy>
        <Copy style={d.muted}>
          {now.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
        </Copy>
        <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8 }}>
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((s) => (
            <View key={s} style={{ width: "14.28%", alignItems: "center" }}>
              <Copy size={11} style={d.muted}>
                {s}
              </Copy>
            </View>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <View key={"blank" + i} style={{ width: "14.28%" }} />
          ))}
          {days.map((date) => {
            const value = date.toLocaleDateString("en-CA");
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={value}
                onPress={() => setDay(value)}
                style={{
                  width: "14.28%",
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: day === value ? theme.purple : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Copy bold>{date.getDate()}</Copy>
                {world.plans.some((p) => p.date === value) && (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: theme.teal,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
        <GameButton
          onPress={() =>
            router.push({ pathname: "/plan", params: { date: day } })
          }
        >
          + Çalışma planı ekle
        </GameButton>
        <Copy title size={20}>
          {day} · Planların
        </Copy>
        {world.plans
          .filter((p) => p.date === day)
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((p) => (
            <View key={p.id} style={d.panel}>
              <Copy size={12} style={{ color: theme.teal }}>
                {p.time} · {p.minutes} dakika
              </Copy>
              <Copy title size={18}>
                {p.title}
              </Copy>
              <Copy style={d.muted}>{p.note}</Copy>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  setWorld((s) => ({
                    ...s,
                    plans: s.plans.filter((x) => x.id !== p.id),
                  }))
                }
              >
                <Copy size={12}>Planı kaldır</Copy>
              </Pressable>
            </View>
          ))}
        {!world.plans.some((p) => p.date === day) && (
          <Copy style={d.muted}>
            Bu gün henüz boş. Kendine bir çalışma saati ayır.
          </Copy>
        )}
      </ScrollView>
      <BottomNav selected="Takvim" />
    </View>
  );
}
