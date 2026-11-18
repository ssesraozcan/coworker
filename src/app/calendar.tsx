import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomNav,
  Copy,
  d,
  GameButton,
  Icon,
  theme,
} from "../features/design";
import { useWorld } from "../features/world-store";
export default function Calendar() {
  const safe = useSafeAreaInsets(),
    params = useLocalSearchParams<{ date?: string }>(),
    { world, setWorld } = useWorld(),
    [day, setDay] = useState(
      params.date || new Date().toLocaleDateString("en-CA"),
    );
  const date = new Date(day + "T12:00:00"),
    week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(date);
      d.setDate(date.getDate() - ((date.getDay() + 6) % 7) + i);
      return d;
    });
  function move(delta: number) {
    const n = new Date(date);
    n.setDate(n.getDate() + delta);
    setDay(n.toLocaleDateString("en-CA"));
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View
        style={{ padding: 20, paddingTop: Math.max(safe.top, 44), gap: 16 }}
      >
        <View style={[d.row, { justifyContent: "space-between" }]}>
          <Copy title size={26}>
            Programın
          </Copy>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="+ Çalışma planı ekle"
            onPress={() =>
              router.push({ pathname: "/plan", params: { date: day } })
            }
            style={{
              padding: 10,
              borderRadius: 16,
              backgroundColor: "#FFFFFF10",
            }}
          >
            <Copy size={11} bold>
              + Plan ekle
            </Copy>
          </Pressable>
        </View>
        <Copy size={11} style={d.muted}>
          Kendi ritmini kendin belirle.
        </Copy>
        <View style={[d.row, { justifyContent: "space-between" }]}>
          <Copy bold>
            {date.toLocaleDateString("tr-TR", {
              month: "long",
              year: "numeric",
            })}
          </Copy>
          <View style={d.row}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Önceki hafta"
              onPress={() => move(-7)}
              style={{ padding: 10 }}
            >
              <Icon name="chevron-left" size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sonraki hafta"
              onPress={() => move(7)}
              style={{ padding: 10 }}
            >
              <Icon name="chevron-right" size={18} />
            </Pressable>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          {week.map((d) => (
            <Pressable
              key={d.toISOString()}
              accessibilityRole="button"
              accessibilityLabel={d.toLocaleDateString("en-CA")}
              onPress={() => setDay(d.toLocaleDateString("en-CA"))}
              style={{
                flex: 1,
                height: 64,
                borderRadius: 18,
                borderWidth: 1,
                borderColor:
                  d.toLocaleDateString("en-CA") === day
                    ? "#C5F2E866"
                    : "transparent",
                backgroundColor:
                  d.toLocaleDateString("en-CA") === day
                    ? "#B7DBD42B"
                    : "transparent",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Copy size={10} style={{ color: theme.muted }}>
                {d.toLocaleDateString("tr-TR", { weekday: "short" })}
              </Copy>
              <Copy bold size={18}>
                {d.getDate()}
              </Copy>
            </Pressable>
          ))}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 130, gap: 14 }}
      >
        <Copy title size={20}>
          {date.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            weekday: "long",
          })}
        </Copy>
        <Copy size={11} style={d.muted}>
          {world.plans.filter((p) => p.date === day).length} plan
        </Copy>
        {world.plans
          .filter((p) => p.date === day)
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((p) => (
            <View key={p.id} style={d.panel}>
              <View style={[d.row, { justifyContent: "space-between" }]}>
                <Copy size={10} style={{ color: theme.teal }}>
                  {p.time} · {p.minutes} dakika
                </Copy>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${p.title} planını kaldır`}
                  onPress={() =>
                    setWorld((s) => ({
                      ...s,
                      plans: s.plans.filter((x) => x.id !== p.id),
                    }))
                  }
                  hitSlop={12}
                >
                  <Icon name="x" size={16} color={theme.muted} />
                </Pressable>
              </View>
              <Copy bold size={16}>
                {p.title}
              </Copy>
              {!!p.note && (
                <Copy size={11} style={d.muted}>
                  {p.note}
                </Copy>
              )}
            </View>
          ))}
        {!world.plans.some((p) => p.date === day) && (
          <View style={[d.panel, { padding: 22, gap: 8 }]}>
            <Copy title size={19}>
              Kendine bir zaman ayır.
            </Copy>
            <Copy size={12} style={d.muted}>
              Bu gün henüz boş. Küçük bir planla başlayabilirsin.
            </Copy>
          </View>
        )}
        <GameButton
          onPress={() =>
            router.push({ pathname: "/plan", params: { date: day } })
          }
        >
          + Yeni çalışma planı
        </GameButton>
      </ScrollView>
      <BottomNav selected="Takvim" />
    </View>
  );
}
