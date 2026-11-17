import React, { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Atmosphere,
  Back,
  Copy,
  d,
  GameButton,
  theme,
} from "../features/design";
import { premiumIsland } from "../features/assets";
import { useWorld } from "../features/world-store";
export default function Premium() {
  const safe = useSafeAreaInsets(),
    { setWorld } = useWorld(),
    [annual, setAnnual] = useState(true),
    [confirm, setConfirm] = useState(false);
  function demo() {
    setConfirm(true);
  }
  return (
    <Atmosphere premium source={premiumIsland}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: Math.max(safe.top, 37),
          paddingBottom: Math.max(safe.bottom, 20),
          gap: 16,
        }}
      >
        <View style={{ alignSelf: "flex-start" }}>
          <Back />
        </View>
        <View style={{ height: 160 }} />
        <Copy size={11} style={{ color: theme.muted, letterSpacing: 1.4 }}>
          COWORKERS PREMIUM
        </Copy>
        <Copy title size={30}>
          Daha büyük ada.{"\n"}Daha çok arkadaş.
        </Copy>
        <View style={{ gap: 10 }}>
          {[
            "8 yerine 12 kişilik arkadaş adası",
            "4 yeni arkadaşın için ek alan",
            "Arkadaşların ücretsiz katılır",
          ].map((s) => (
            <Copy key={s} size={15} style={d.muted}>
              ✓ {s}
            </Copy>
          ))}
        </View>
        <View style={[d.row, { marginTop: 10 }]}>
          {[true, false].map((y) => (
            <Pressable
              key={String(y)}
              accessibilityRole="radio"
              accessibilityState={{ checked: annual === y }}
              accessibilityLabel={y ? "Yıllık plan" : "Aylık plan"}
              onPress={() => setAnnual(y)}
              style={{
                flex: 1,
                padding: 12,
                minHeight: 108,
                borderRadius: 18,
                borderWidth: annual === y ? 2 : 1,
                borderColor: annual === y ? "#A691F5" : "#404A66",
                backgroundColor: annual === y ? "#383059" : theme.surface,
                gap: 10,
              }}
            >
              <Copy bold size={11}>
                {y ? "Yıllık · %33 avantaj" : "Aylık"}
              </Copy>
              <Copy bold size={20}>
                {y ? "₺1.200 / yıl" : "₺150 / ay"}
              </Copy>
              <Copy size={10}>
                {y ? "₺100 / ay · Tek ödeme" : "Her ay ödeme"}
              </Copy>
            </Pressable>
          ))}
        </View>
        <Copy size={12}>
          {annual
            ? "Yıllık planda ₺600 tasarruf et.\nAbonelik her yıl yenilenir."
            : "Her ay ₺150 öde.\nAbonelik her ay yenilenir."}
        </Copy>
        <Copy size={11} style={{ color: theme.teal }}>
          Ödeme önizlemesi · Gerçek tahsilat yapılmaz.
        </Copy>
        <View style={{ flex: 1, minHeight: 8 }} />
        <GameButton onPress={demo}>
          {annual ? "Yıllık Premium · ₺1.200" : "Aylık Premium · ₺150"}
        </GameButton>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              "Satın alımları geri yükle",
              "Mağaza bağlantısı henüz eklenmedi. Bu sürümde gerçek satın alım yok.",
            )
          }
          style={{
            minHeight: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Copy size={12} style={d.muted}>
            Satın alımları geri yükle
          </Copy>
        </Pressable>
      </ScrollView>
      <Modal
        visible={confirm}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000A",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View style={d.panel}>
            <Copy title size={23}>
              Premium önizlemesi
            </Copy>
            <Copy>
              Gerçek ücret alınmaz. Demo kapasiten 12 kişiye çıkarılır.
            </Copy>
            <GameButton
              onPress={() => {
                setWorld((s) => ({
                  ...s,
                  premium: annual ? "annual" : "monthly",
                }));
                setConfirm(false);
                router.replace("/upgrade-success");
              }}
            >
              Demoyu dene
            </GameButton>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirm(false)}
              style={{ padding: 12 }}
            >
              <Copy>Vazgeç</Copy>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Atmosphere>
  );
}
