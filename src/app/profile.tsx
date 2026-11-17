import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNav, Copy, d, GameButton, theme } from "../features/design";
import { useWorld } from "../features/world-store";
import { useGame } from "../state/store";
export default function Profile() {
  const safe = useSafeAreaInsets(),
    { world, setWorld, error } = useWorld(),
    { state } = useGame();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: Math.max(safe.top, 44),
          paddingBottom: 130,
          gap: 20,
        }}
      >
        <Copy title size={28}>
          Senin yolculuğun
        </Copy>
        <View style={d.panel}>
          <Copy title size={22}>
            {state.records.length} odaklanma oturumu
          </Copy>
          <Copy style={d.muted}>
            {state.records.reduce((n, r) => n + r.minutes, 0)} dakika kendine
            ayırdın.
          </Copy>
        </View>
        <GameButton onPress={() => router.push("/premium")}>
          {world.premium ? "Premium planını gör" : "Premium’u keşfet"}
        </GameButton>
        {[
          ["/home", "Evime git"],
          ["/wardrobe", "Gardırobum"],
          ["/decorate", "Evimi düzenle"],
          ["/rewards", "Ödüllerim"],
          ["/invite", "Bir davet kodum var"],
        ].map(([href, label]) => (
          <Pressable
            key={href}
            style={d.panel}
            onPress={() => router.push(href as "/home")}
          >
            <Copy>{label} →</Copy>
          </Pressable>
        ))}
        <View style={d.panel}>
          <Copy bold>Ada senaryoları · Yerel demo</Copy>
          <Copy size={12} style={d.muted}>
            Tasarımları deneyimlemek için üye sayısını seç. Gerçek kullanıcı
            eklenmez.
          </Copy>
          <View style={[d.row, { flexWrap: "wrap" }]}>
            {[
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              ...(world.premium ? [9, 10, 11, 12] : []),
            ].map((n) => (
              <Pressable
                key={n}
                accessibilityRole="button"
                accessibilityLabel={`${n} kişilik ada önizle`}
                onPress={() => {
                  setWorld((s) => ({ ...s, members: n }));
                  router.push("/world");
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor:
                    world.members === n ? theme.purple : theme.nav,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Copy>{n}</Copy>
              </Pressable>
            ))}
          </View>
          {world.premium && (
            <Pressable
              onPress={() =>
                setWorld((s) => ({
                  ...s,
                  premium: null,
                  members: Math.min(8, s.members),
                }))
              }
            >
              <Copy size={12}>Demo Premium’u kapat</Copy>
            </Pressable>
          )}
        </View>
        {error && (
          <Copy>İlerleme kaydedilemiyor. Cihaz depolamasını kontrol et.</Copy>
        )}
        <Copy size={12} style={d.muted}>
          Bu sürümde hesabın ve adan cihazında saklanır. Canlı arkadaşlar,
          mağaza ödemeleri ve bulut kaydı henüz bağlı değildir.
        </Copy>
      </ScrollView>
      <BottomNav selected="Profil" />
    </View>
  );
}
