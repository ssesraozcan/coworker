import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { ActivityIndicator, View } from "react-native";
import { Outfit_600SemiBold } from "@expo-google-fonts/outfit";
import { WorldProvider } from "../features/world-store";
import { Store, useGame } from "../state/store";
import { colors, Label } from "../components/ui";
function Content() {
  const { ready, storageError } = useGame();
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.paper,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.green} />
      </View>
    );
  return (
    <>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.paper },
        }}
      />
      {storageError && (
        <View
          style={{
            position: "absolute",
            top: 45,
            alignSelf: "center",
            backgroundColor: colors.paper,
            padding: 10,
          }}
        >
          <Label>İlerleme kaydedilemedi. Depolama alanını kontrol et.</Label>
        </View>
      )}
    </>
  );
}
export default function Layout() {
  const [loaded, error] = useFonts({
    Nunito: Nunito_400Regular,
    NunitoBold: Nunito_700Bold,
    Outfit: Outfit_600SemiBold,
  });
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <Store>
        <WorldProvider>
          <Content />
        </WorldProvider>
      </Store>
    </SafeAreaProvider>
  );
}
