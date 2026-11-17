import React, { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Back, Copy, d, GameButton, theme } from "../features/design";
import { useWorld } from "../features/world-store";
export default function Plan() {
  const safe = useSafeAreaInsets(),
    params = useLocalSearchParams<{ date?: string }>(),
    { setWorld } = useWorld(),
    [title, setTitle] = useState(""),
    [note, setNote] = useState(""),
    [date, setDate] = useState(
      params.date || new Date().toLocaleDateString("en-CA"),
    ),
    [time, setTime] = useState("14:00"),
    [minutes, setMinutes] = useState("25");
  function save() {
    if (
      !title.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(date)) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
      !Number.isInteger(Number(minutes)) ||
      Number(minutes) < 5 ||
      Number(minutes) > 240
    ) {
      Alert.alert(
        "Planını kontrol et",
        "Başlık, YYYY-AA-GG biçiminde tarih, SS:DD biçiminde saat ve 5–240 dakika arasında süre gir.",
      );
      return;
    }
    setWorld((s) => ({
      ...s,
      plans: [
        ...s.plans,
        {
          id: "plan-" + Date.now(),
          title: title.trim(),
          note: note.trim(),
          date,
          time,
          minutes: Number(minutes),
        },
      ],
    }));
    router.replace("/calendar");
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          paddingTop: Math.max(safe.top, 44),
          gap: 18,
        }}
      >
        <View style={{ alignSelf: "flex-start" }}>
          <Back />
        </View>
        <Copy title size={28}>
          Yeni çalışma planı
        </Copy>
        {[
          ["Ne çalışacaksın?", title, setTitle],
          ["Küçük hedefin", note, setNote],
          ["Tarih · YYYY-AA-GG", date, setDate],
          ["Saat · SS:DD", time, setTime],
          ["Süre · dakika", minutes, setMinutes],
        ].map(([label, value, setter]) => (
          <View key={label as string} style={{ gap: 8 }}>
            <Copy size={13} style={d.muted}>
              {label as string}
            </Copy>
            <TextInput
              accessibilityLabel={label as string}
              value={value as string}
              onChangeText={setter as (v: string) => void}
              style={d.input}
              maxLength={100}
            />
          </View>
        ))}
        <GameButton onPress={save}>Planı kaydet</GameButton>
      </ScrollView>
    </View>
  );
}
