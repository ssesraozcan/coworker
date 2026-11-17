import React, { useState } from "react";
import { ImageBackground, Modal, Pressable, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, d, GameButton, Vector } from "../features/design";
import { islands } from "../features/assets";
import { useWorld } from "../features/world-store";
import { capacity } from "../features/world-model";
export default function World() {
  const safe = useSafeAreaInsets(),
    { world } = useWorld(),
    [full, setFull] = useState(false);
  return (
    <ImageBackground
      source={islands[world.members - 1]}
      style={{ flex: 1 }}
      imageStyle={{width:"100%",height:"100%"}} resizeMode="cover"
    >
      <View
        style={[
          d.row,
          {
            position: "absolute",
            top: Math.max(safe.top, 44),
            left: 16,
            right: 16,
            height: 76,
            padding: 10,
            borderRadius: 22,
            backgroundColor: "#20273FF2",
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ana ekrana dön"
          onPress={() => router.replace("/")}
          style={[
            d.back,
            { minWidth: 44, width: 44, backgroundColor: "#F2F4FC14" },
          ]}
        >
          <Vector asset={require("../../assets/figma/db521.svg")} size={22} />
        </Pressable>
        <View style={{ flex: 1, gap: 3 }}>
          <Copy title size={20}>
            {world.members === 1 ? "İlk evim" : "Kıyı adası"}
          </Copy>
          <Copy size={12} style={d.muted}>
            {world.members === 1
              ? "Sadece sen varsın"
              : `Sen ve ${world.members - 1} arkadaşın`}
          </Copy>
        </View>
        <Copy size={12}>
          {world.members} / {capacity(world)}
        </Copy>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Evime git"
        onPress={() => router.push("/home")}
        style={{
          position: "absolute",
          left: 20,
          bottom: Math.max(safe.bottom, 34) + 100,
          backgroundColor: "#20273FE6",
          borderRadius: 15,
          padding: 12,
        }}
      >
        <Copy>Evime git →</Copy>
      </Pressable>
      <View
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: Math.max(safe.bottom, 34) + 16,
        }}
      >
        <GameButton
          onPress={() =>
            world.members >= capacity(world)
              ? setFull(true)
              : router.push("/invite")
          }
        >
          Arkadaş davet et
        </GameButton>
      </View>
      <Modal
        visible={full}
        transparent
        animationType="slide"
        onRequestClose={() => setFull(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#0008",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={[
              d.panel,
              { padding: 24, paddingBottom: Math.max(safe.bottom, 24) + 20 },
            ]}
          >
            <Copy title size={28}>
              Dünyan doldu.
            </Copy>
            <Copy style={d.muted}>
              {world.members} / {capacity(world)} kişi.{" "}
              {world.premium
                ? "Adanda şu an boş yer yok."
                : "Premium ile adanı 12 kişiye genişlet."}
            </Copy>
            {!world.premium && (
              <GameButton
                onPress={() => {
                  setFull(false);
                  router.push("/premium");
                }}
              >
                Kapasiteyi genişlet
              </GameButton>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => setFull(false)}
              style={{ padding: 14 }}
            >
              <Copy style={{ textAlign: "center" }}>Adaya dön</Copy>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
