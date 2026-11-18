import React, { useCallback, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  BackHandler,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, d, GameButton, Vector, theme } from "../features/design";
import { islands } from "../features/assets";
import { useWorld } from "../features/world-store";
import { capacity } from "../features/world-model";
import { commonAnchors, coveredPoint } from "../features/camera";
import { Commons } from "../features/Commons";
import { Glass, GlassScene } from "../components/Glass";
import { GameNav } from "../features/GameNav";
const interior = require("../../assets/figma/commons-interior.png");
export default function World() {
  const safe = useSafeAreaInsets(),
    { world } = useWorld(),
    { width, height } = useWindowDimensions(),
    [full, setFull] = useState(false),
    [membersOpen, setMembersOpen] = useState(false),
    [phase, setPhase] = useState<"island" | "entering" | "room" | "leaving">(
      "island",
    ),
    [reduced, setReduced] = useState(true),
    [roomReady, setRoomReady] = useState(false),
    [progress] = useState(() => new Animated.Value(0));
  const point = coveredPoint(width, height, commonAnchors[world.members - 1]);
  const native = Platform.OS !== "web";
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setReduced(v);
    });
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
      progress.stopAnimation();
    };
  }, [progress]);
  const leave = useCallback(() => {
    if (phase !== "room") return;
    setPhase("leaving");
    Animated.timing(progress, {
      toValue: 0,
      duration: reduced ? 160 : 850,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: native,
    }).start(({ finished }) => {
      if (finished) setPhase("island");
    });
  }, [phase, progress, reduced, native]);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (phase === "room") {
        leave();
        return true;
      }
      return phase !== "island";
    });
    return () => sub.remove();
  }, [phase, leave]);
  function enter() {
    if (phase !== "island" || !roomReady) return;
    setPhase("entering");
    Animated.timing(progress, {
      toValue: 1,
      duration: reduced ? 180 : 1150,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: native,
    }).start(({ finished }) => {
      if (finished) setPhase("room");
    });
  }
  const zoom = reduced
    ? 1
    : progress.interpolate({ inputRange: [0, 1], outputRange: [1, 3.4] });
  return (
    <GlassScene style={{ flex: 1, backgroundColor: theme.bg }}>
      <Animated.View
        testID="island-camera"
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              {
                translateX: reduced
                  ? 0
                  : progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (width / 2 - point.x) * 3.4],
                    }),
              },
              {
                translateY: reduced
                  ? 0
                  : progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (height / 2 - point.y) * 3.4],
                    }),
              },
              { scale: zoom },
            ],
          },
        ]}
      >
        <Image
          source={islands[world.members - 1]}
          resizeMode="cover"
          style={{ width, height }}
        />
      </Animated.View>
      <Animated.View
        testID="commons-interior"
        pointerEvents={phase === "room" ? "auto" : "none"}
        accessibilityElementsHidden={phase !== "room"}
        importantForAccessibility={
          phase === "room" ? "auto" : "no-hide-descendants"
        }
        aria-hidden={phase !== "room"}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: reduced
              ? progress
              : progress.interpolate({
                  inputRange: [0, 0.55, 1],
                  outputRange: [0, 0, 1],
                }),
          },
        ]}
      >
        <Image
          source={interior}
          resizeMode="cover"
          onLoad={() => setRoomReady(true)}
          style={[StyleSheet.absoluteFill, { width, height }]}
        />
        {phase === "room" && <Commons onLeave={leave} />}
      </Animated.View>
      <Animated.View
        pointerEvents={phase === "island" ? "box-none" : "none"}
        aria-hidden={phase !== "island"}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: progress.interpolate({
              inputRange: [0, 0.25, 1],
              outputRange: [1, 0, 0],
            }),
          },
        ]}
      >
        <Glass
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
              backgroundColor: "#142135A6",
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
        </Glass>
        <Pressable
          testID="commons-hotspot"
          accessibilityRole="button"
          accessibilityLabel="Ortak çalışma alanına gir"
          disabled={!roomReady || phase !== "island"}
          onPress={enter}
          style={{
            position: "absolute",
            left: Math.max(8, point.x - 65),
            top: point.y - 45,
            width: 130,
            height: 110,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#20273FE6",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: "#D1C2FF70",
            }}
          >
            <Copy size={12}>Ortak alan ↗</Copy>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Evime git"
          onPress={() => router.push("/home")}
          style={{
            position: "absolute",
            left: 20,
            bottom: Math.max(safe.bottom, 16) + 168,
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
            bottom: Math.max(safe.bottom, 16) + 94,
          }}
        >
          <GameButton glass onPress={() => setMembersOpen(true)}>
            Ada üyeleri
          </GameButton>
        </View>
      </Animated.View>
      {phase === "island" && <GameNav selected="Ada" />}
      <Modal
        visible={membersOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMembersOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#0009",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={[
              d.panel,
              {
                padding: 24,
                paddingBottom: Math.max(safe.bottom, 24),
                gap: 18,
              },
            ]}
          >
            <View style={[d.row, { justifyContent: "space-between" }]}>
              <Copy title size={24}>
                Ada üyeleri
              </Copy>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Üyeleri kapat"
                onPress={() => setMembersOpen(false)}
                style={{ padding: 12 }}
              >
                <Copy>✕</Copy>
              </Pressable>
            </View>
            <Copy size={12} style={d.muted}>
              {world.members} / {capacity(world)} ev · Kıyı adası
            </Copy>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {Array.from({ length: world.members }, (_, i) => (
                <View
                  key={i}
                  style={{
                    width: 68,
                    alignItems: "center",
                    gap: 5,
                    paddingVertical: 8,
                  }}
                >
                  <Vector
                    asset={require("../../assets/v3/house.svg")}
                    size={30}
                  />
                  <Copy size={10}>
                    {i === 0 ? "Senin evin" : `${i + 1}. ev`}
                  </Copy>
                </View>
              ))}
            </View>
            <GameButton
              onPress={() => {
                setMembersOpen(false);
                if (world.members >= capacity(world)) {
                  setFull(true);
                } else {
                  router.push("/invite");
                }
              }}
            >
              Arkadaş davet et
            </GameButton>
          </View>
        </View>
      </Modal>
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
    </GlassScene>
  );
}
