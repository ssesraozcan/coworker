import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Atmosphere,
  Back,
  Copy,
  d,
  GameButton,
  theme,
  Vector,
} from "../features/design";
import { useWorld } from "../features/world-store";
import { capacity, joinWorld } from "../features/world-model";
export default function Invite() {
  const safe = useSafeAreaInsets(),
    params = useLocalSearchParams<{ code?: string }>(),
    { world, setWorld, ready } = useWorld(),
    [code, setCode] = useState(params.code || ""),
    [toast, setToast] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<"invalid" | "full" | null>(null),
    [joined, setJoined] = useState(false),
    [recipient, setRecipient] = useState(Boolean(params.code));
  const url = Linking.createURL("/invite", {
    queryParams: { code: world.code },
  });
  async function copy() {
    try {
      await Clipboard.setStringAsync(world.code);
      setToast("Davet kodu kopyalandı");
    } catch {
      Alert.alert("Kod kopyalanamadı", "Tekrar deneyebilirsin.");
    }
  }
  async function share() {
    if (busy) return;
    setBusy(true);
    try {
      const message = `Kıyı adasında buluşalım! 🌿\nBirlikte çalışıp kendi evimizi büyütelim.\nDavet kodu: ${world.code}`;
      const result = await Share.share(
        Platform.OS === "ios"
          ? { message, url }
          : { message: message + "\n" + url },
        { dialogTitle: "Daveti paylaş" },
      );
      if (Platform.OS === "web" || result?.action === Share.sharedAction)
        setToast("Paylaşım uygulamasına aktarıldı");
    } catch {
      Alert.alert(
        "Paylaşılamadı",
        "Paylaşımı tekrar dene veya davet kodunu kopyala.",
      );
    } finally {
      setBusy(false);
    }
  }
  function join() {
    const result = joinWorld(world, code);
    if (result.error) {
      setError(result.error);
      return;
    }
    setWorld(result.state);
    setJoined(true);
    setError(null);
  }
  if (!ready)
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.bg, justifyContent: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  return (
    <Atmosphere>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: Math.max(safe.top, 40),
          paddingBottom: Math.max(safe.bottom, 34) + 16,
          gap: 14,
        }}
      >
        <View style={{ alignSelf: "flex-start" }}>
          <Back onPress={() => router.replace("/world")} />
        </View>
        <View style={{ height: 205 }} />
        <Copy title size={28}>
          {joined
            ? "Hoş geldin, yeni komşu!"
            : error === "full"
              ? "Bu ada şu an dolu."
              : error === "invalid"
                ? "Bu davet bulunamadı."
                : recipient
                  ? "Adada sana da yer var."
                  : "Birlikte daha güzel."}
        </Copy>
        <Copy style={d.muted}>
          {joined
            ? "Artık Kıyı adasının bir parçasısın. Evin seni bekliyor."
            : error === "full"
              ? "Ada sahibi Premium ile kapasiteyi 12 kişiye çıkarabilir. Katılmak için senin ödeme yapman gerekmez."
              : error === "invalid"
                ? "Kod hatalı olabilir. Arkadaşından yeni bir davet iste."
                : recipient
                  ? "Kıyı adasına davet edildin. Kendi evini kur, arkadaşlarınla birlikte çalış."
                  : "Arkadaşını Kıyı adasına davet et. Kendi evini kursun, birlikte odaklanın."}
        </Copy>
        <Copy bold>
          {world.members} / {capacity(world)} kişi ·{" "}
          {Math.max(0, capacity(world) - world.members)} arkadaşına yer var
        </Copy>
        {!recipient && !joined ? (
          <>
            <View style={d.panel}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Davet kodunu kopyala"
                onPress={copy}
                style={[
                  d.row,
                  { minHeight: 44, justifyContent: "space-between" },
                ]}
              >
                <Copy title size={24}>
                  {world.code}
                </Copy>
                <Vector asset={require("../../assets/figma/a8a43.svg")} />
              </Pressable>
              <Copy size={12} style={d.muted} selectable>
                {url}
              </Copy>
            </View>
            <Copy size={12} style={d.muted}>
              Yalnızca davet bağlantısı veya kodu olanlar katılabilir.
            </Copy>
            <Pressable
              accessibilityRole="button"
              onPress={() => setRecipient(true)}
              style={{ paddingVertical: 12 }}
            >
              <Copy size={12} style={{ color: theme.teal }}>
                Bir davet kodum var →
              </Copy>
            </Pressable>
          </>
        ) : (
          !joined && (
            <>
              <TextInput
                accessibilityLabel="Davet kodu"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={12}
                placeholder="Davet kodunu gir"
                placeholderTextColor={theme.muted}
                value={code}
                onChangeText={(s) => {
                  setCode(s);
                  setError(null);
                }}
                style={d.input}
              />
              <Copy size={12} style={d.muted}>
                Katılınca profil adın ve avatarın ada üyelerine görünür.
              </Copy>
            </>
          )
        )}
        {toast ? (
          <Copy
            size={12}
            style={{ color: theme.teal }}
            accessibilityLiveRegion="polite"
          >
            ✓ {toast}
          </Copy>
        ) : null}
        <Copy size={11} style={d.muted}>
          Yerel demo: davet ve üye sayısı yalnızca bu cihazda denenir. Cihazlar
          arası katılım henüz bağlı değil.
        </Copy>
        <View style={{ flex: 1, minHeight: 20 }} />
        <GameButton
          disabled={busy || (recipient && !joined && !code.trim())}
          onPress={
            joined ? () => router.replace("/world") : recipient ? join : share
          }
        >
          {joined
            ? "Adaya gir"
            : busy
              ? "Paylaşım açılıyor…"
              : recipient
                ? "Daveti kabul et"
                : "Daveti paylaş"}
        </GameButton>
      </ScrollView>
    </Atmosphere>
  );
}
