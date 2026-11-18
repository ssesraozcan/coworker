import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNav, Copy, d, Icon, theme, Vector } from "../features/design";
import { useGame } from "../state/store";
export default function Profile() {
  const safe = useSafeAreaInsets(),
    { state } = useGame();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Math.max(safe.top, 44) + 4,
          paddingBottom: 130,
          gap: 22,
        }}
      >
        <Copy title size={27} style={{ marginLeft: 4 }}>
          Profilin
        </Copy>
        <View
          style={{
            height: 107,
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            padding: 14,
            borderRadius: 26,
            backgroundColor: "#FFFFFF07",
            borderWidth: 1,
            borderColor: "#FFFFFF16",
          }}
        >
          <View
            style={{
              width: 78,
              height: 78,
              borderRadius: 39,
              backgroundColor: "#B7DBD410",
              borderWidth: 1,
              borderColor: "#B7DBD433",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Vector asset={require("../../assets/v3/portrait.svg")} size={64} />
          </View>
          <View style={{ gap: 5 }}>
            <Copy title size={28}>
              Deniz
            </Copy>
            <Copy size={12} style={d.muted}>
              Kendi ritminde ilerle.
            </Copy>
          </View>
        </View>
        <View
          style={{
            height: 82,
            padding: 18,
            borderRadius: 22,
            backgroundColor: "#FFFFFF0A",
            borderWidth: 1,
            borderColor: "#FFFFFF16",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 5 }}>
            <Copy size={11} style={d.muted}>
              Günlük çalışma hedefin
            </Copy>
            <Copy title size={23} style={{ color: "#D9EEE8" }}>
              {state.routine.minutes} dakika
            </Copy>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rutinimi düzenle"
            onPress={() => router.push("/routine")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#B7DBD414",
              borderWidth: 1,
              borderColor: "#B7DBD42E",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="edit-2" color="#C9E8E1" size={20} />
          </Pressable>
        </View>
        {[
          {
            label: "SENİN ALANIN",
            rows: [
              ["Gardırobum", "Kıyafetler ve aksesuarlar", "/wardrobe"],
              ["Kazandıklarım", "Ödüllerin ve başarıların", "/rewards"],
            ],
          },
          {
            label: "TERCİHLER",
            rows: [
              [
                "Bildirimler",
                "Hatırlatıcılarını yönet",
                "/preferences?section=notifications",
              ],
              [
                "Ses ve görünüm",
                "Ambiyans ve uygulama tercihleri",
                "/preferences",
              ],
            ],
          },
        ].map((group) => (
          <View key={group.label} style={{ gap: 14, marginTop: 8 }}>
            <Copy
              bold
              size={10}
              style={{ color: "#8FA4B8", letterSpacing: 1.1, marginLeft: 4 }}
            >
              {group.label}
            </Copy>
            <View
              style={{
                borderRadius: 22,
                backgroundColor: "#FFFFFF06",
                borderWidth: 1,
                borderColor: "#FFFFFF14",
                overflow: "hidden",
              }}
            >
              {group.rows.map(([label, sub, href], i) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  onPress={() => router.push(href as "/wardrobe")}
                  style={{
                    height: 60,
                    marginHorizontal: 18,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: "#FFFFFF0D",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ gap: 4 }}>
                    <Copy bold>{label}</Copy>
                    <Copy size={11} style={d.muted}>
                      {sub}
                    </Copy>
                  </View>
                  <Icon name="chevron-right" size={18} color="#98ABBD" />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomNav selected="Profil" />
    </View>
  );
}
