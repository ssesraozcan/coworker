import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Back, Copy, d, GameButton, Icon, theme } from "../features/design";
import { GameNav, GAME_NAV_SPACE } from "../features/GameNav";
import { Glass } from "../components/Glass";
import {
  catalog,
  CatalogObject,
  ObjectCategory,
  objectImages,
} from "../features/catalog";
import { WardrobeBackdrop } from "../components/WardrobeBackdrop";
import { useGame } from "../state/store";
import { buyObject, claimObject, milestoneProgress } from "../state/model";
export default function Closet() {
  const safe = useSafeAreaInsets(),
    { width } = useWindowDimensions(),
    { state, update } = useGame(),
    [mode, setMode] = useState<"carousel" | "grid">("carousel"),
    [filters, setFilters] = useState(true),
    [tab, setTab] = useState("Eşyalarım"),
    [category, setCategory] = useState<ObjectCategory>("Tümü"),
    [query, setQuery] = useState(""),
    [selection, setSelection] = useState(6),
    [dialog, setDialog] = useState<"place" | "buy" | null>(null),
    [notice, setNotice] = useState("");
  const list = useRef<FlatList<CatalogObject>>(null);
  const items = catalog.filter(
    (o) =>
      (tab !== "Eşyalarım" || state.ownedObjects.includes(o.id)) &&
      (tab !== "Ödüller" || o.id >= 36) &&
      (category === "Tümü" || o.category === category) &&
      o.name
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")),
  );
  const index = Math.max(
      0,
      items.findIndex((o) => o.id === selection),
    ),
    object = items[index],
    owned = object && state.ownedObjects.includes(object.id),
    placement =
      object && state.objectPlacements.find((p) => p.objectId === object.id),
    progress = object ? milestoneProgress(state, object.id) : null;
  function reset() {
    list.current?.scrollToOffset({ offset: 0, animated: false });
    setSelection(0);
    setNotice("");
  }
  function action() {
    if (!object) return;
    if (owned) setDialog("place");
    else if (object.id < 36) setDialog("buy");
    else if (progress && progress.value >= progress.target) {
      update((s) => claimObject(s, object.id));
      setNotice("Hediyen dolabına eklendi.");
    } else router.push("/home");
  }
  function card(o: CatalogObject, grid = false, active = false) {
    const locked = !state.ownedObjects.includes(o.id);
    return (
      <Glass
        style={{
          width: grid ? (width - 60) / 3 : 190,
          height: grid ? 145 : 210,
          borderRadius: grid ? 20 : 28,
          padding: grid ? 8 : 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={objectImages[o.id]}
          resizeMode="contain"
          style={{
            width: grid ? (width - 108) / 3 : 170,
            height: grid ? 96 : 170,
          }}
        />
        {grid && (
          <Copy
            size={10}
            bold
            style={{ textAlign: "center", height: 32 }}
            numberOfLines={2}
          >
            {o.name}
          </Copy>
        )}
        {locked && (grid || active) && (
          <View
            testID={`object-lock-${o.id}`}
            style={{
              position: "absolute",
              right: grid ? 6 : 12,
              top: grid ? 6 : 12,
              width: grid ? 25 : 32,
              height: grid ? 25 : 32,
              borderRadius: 18,
              backgroundColor: "#172238CC",
              borderWidth: 1,
              borderColor: "#FFFFFF24",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="lock" size={grid ? 13 : 17} />
          </View>
        )}
      </Glass>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <WardrobeBackdrop />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: Math.max(safe.top, 44),
          paddingBottom: 12,
          gap: 16,
        }}
      >
        <View style={d.row}>
          <Back onPress={() => router.replace("/world")} />
          <View>
            <Copy title size={26}>
              Dolabım
            </Copy>
            <Copy size={10} style={d.muted}>
              {state.ownedObjects.length} obje · Kendine ait küçük hazineler
            </Copy>
          </View>
        </View>
        <View style={[d.row, { gap: 8 }]}>
          <Glass
            style={{
              flex: 1,
              height: 44,
              borderRadius: 24,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              gap: 8,
            }}
          >
            <Icon name="search" size={18} color={theme.muted} />
            <TextInput
              accessibilityLabel="Eşyalarında ara"
              value={query}
              onChangeText={(v) => {
                setQuery(v);
                reset();
              }}
              placeholder="Eşyalarında ara"
              placeholderTextColor={theme.muted}
              style={
                {
                  flex: 1,
                  fontFamily: "Nunito",
                  fontSize: 12,
                  color: theme.text,
                  height: 44,
                  padding: 0,
                  outlineWidth: 0,
                } as any
              }
            />
          </Glass>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={filters ? "Filtreleri kapat" : "Filtreleri aç"}
            accessibilityState={{ expanded: filters }}
            onPress={() => setFilters((v) => !v)}
          >
            <Glass
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: filters ? "#9BD2C24D" : "#FFFFFF08",
                borderColor: filters ? "#B7DBD4B3" : "#FFFFFF24",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="sliders" size={18} />
            </Glass>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              mode === "carousel"
                ? "Liste görünümüne geç"
                : "Vitrin görünümüne geç"
            }
            onPress={() => setMode((m) => (m === "grid" ? "carousel" : "grid"))}
          >
            <Glass
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={mode === "carousel" ? "grid" : "columns"} size={18} />
            </Glass>
          </Pressable>
        </View>
        {filters && (
          <View testID="closet-filters" style={{ gap: 14 }}>
            <Glass
              style={{
                height: 44,
                borderRadius: 23,
                padding: 3,
                flexDirection: "row",
              }}
            >
              {["Eşyalarım", "Keşfet", "Ödüller"].map((label) => (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: tab === label }}
                  key={label}
                  onPress={() => {
                    setTab(label);
                    reset();
                  }}
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      tab === label ? "#FFFFFF2B" : "transparent",
                  }}
                >
                  <Copy size={11}>{label}</Copy>
                </Pressable>
              ))}
            </Glass>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {(
                [
                  "Tümü",
                  "Masa",
                  "Işık",
                  "Bitki",
                  "Dekor",
                  "Bahçe",
                ] as ObjectCategory[]
              ).map((label) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: category === label }}
                  key={label}
                  onPress={() => {
                    setCategory(label);
                    reset();
                  }}
                  style={{
                    paddingHorizontal: 15,
                    minHeight: 32,
                    borderRadius: 16,
                    backgroundColor:
                      category === label ? "#FFFFFF22" : "#FFFFFF08",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Copy size={10} style={{ color: theme.muted }}>
                    {label}
                  </Copy>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {!items.length ? (
        <View style={{ padding: 24, gap: 8 }}>
          <Copy title size={20}>
            Bu köşe henüz boş.
          </Copy>
          <Copy size={12} style={d.muted}>
            Başka bir kategori seç veya Keşfet bölümüne göz at.
          </Copy>
        </View>
      ) : mode === "grid" ? (
        <FlatList
          key="grid"
          testID="closet-grid"
          data={items}
          numColumns={3}
          keyExtractor={(o) => String(o.id)}
          style={{ flex: 1, marginBottom: GAME_NAV_SPACE + safe.bottom }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: GAME_NAV_SPACE + safe.bottom,
            gap: 10,
          }}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.name}
              onPress={() => {
                setSelection(item.id);
                setMode("carousel");
              }}
            >
              {card(item, true)}
            </Pressable>
          )}
        />
      ) : (
        <ScrollView
          style={{ flex: 1, marginBottom: GAME_NAV_SPACE + safe.bottom }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: GAME_NAV_SPACE + safe.bottom + 10,
          }}
        >
          <FlatList
            ref={list}
            key={tab + category + query}
            horizontal
            data={items}
            initialScrollIndex={index}
            getItemLayout={(_, i) => ({
              length: 214,
              offset: 214 * i,
              index: i,
            })}
            keyExtractor={(o) => String(o.id)}
            showsHorizontalScrollIndicator={false}
            snapToInterval={214}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: (width - 190) / 2 }}
            onMomentumScrollEnd={(e) => {
              const i = Math.max(
                0,
                Math.min(
                  items.length - 1,
                  Math.round(e.nativeEvent.contentOffset.x / 214),
                ),
              );
              setSelection(items[i].id);
              setNotice("");
            }}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.name}
                onPress={() => {
                  const i = items.indexOf(item);
                  setSelection(item.id);
                  list.current?.scrollToIndex({ index: i, animated: true });
                }}
                style={{
                  width: 214,
                  height: 230,
                  justifyContent: "center",
                  opacity: item.id === object?.id ? 1 : 0.55,
                  transform: [{ scale: item.id === object?.id ? 1 : 0.8 }],
                }}
              >
                {card(item, false, item.id === object?.id)}
              </Pressable>
            )}
          />
          <View
            style={{ alignItems: "center", paddingTop: 8, paddingBottom: 25 }}
          >
            <Copy size={10} style={d.muted}>
              {index + 1} / {items.length} · Kaydırarak keşfet
            </Copy>
          </View>
          {object && (
            <Glass style={{ marginHorizontal: 20, padding: 22, gap: 12 }}>
              <Copy size={10} bold style={{ color: "#B9DCD7" }}>
                {owned
                  ? "Sende var · 1 adet"
                  : object.id >= 36
                    ? "Kilitli · Çalışarak kazan"
                    : "Kilitli · Mağaza eşyası"}
              </Copy>
              <Copy title size={23}>
                {object.name}
              </Copy>
              <Copy size={13}>{object.description}</Copy>
              <Copy size={12} style={d.muted}>
                {owned
                  ? placement
                    ? `Şu an ${placement.area === "home" ? "evinde" : "ortak alanda"}. Eşyan sana ait kalır, dilediğinde geri alabilirsin.`
                    : "Şu an dolabında. Evine yerleştir veya arkadaşlarınla paylaştığın çalışma alanını güzelleştir."
                  : object.id >= 36
                    ? `${progress!.target} ${progress!.unit} odaklanma hedefini tamamla; bu eşya dolabına hediye edilsin.`
                    : "Bu eşya henüz dolabında yok. Mağazadan aldığında evine veya ortak alana yerleştirebilirsin."}
              </Copy>
              {object.id >= 36 && !owned && (
                <Copy size={11} style={{ color: theme.teal }}>
                  {Math.min(progress!.target, Math.floor(progress!.value))} /{" "}
                  {progress!.target} {progress!.unit}
                </Copy>
              )}
              {!!notice && (
                <Copy
                  accessibilityLiveRegion="polite"
                  size={12}
                  style={{ color: theme.teal }}
                >
                  {notice}
                </Copy>
              )}
              <View style={{ marginTop: 12 }}>
                <GameButton onPress={action}>
                  {owned
                    ? "Yerleştireceğim alanı seç"
                    : object.id < 36
                      ? "Mağazada gör"
                      : progress!.value >= progress!.target
                        ? "Hediyemi dolaba ekle"
                        : "Çalışmaya devam et"}
                </GameButton>
              </View>
              {placement && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    update((s) => ({
                      ...s,
                      objectPlacements: s.objectPlacements.filter(
                        (p) => p.objectId !== object.id,
                      ),
                    }))
                  }
                  style={{ padding: 8 }}
                >
                  <Copy size={12} style={{ textAlign: "center" }}>
                    Dolabıma geri al
                  </Copy>
                </Pressable>
              )}
            </Glass>
          )}
        </ScrollView>
      )}
      <GameNav selected="Dolabım" />
      <Modal
        visible={!!dialog}
        transparent
        animationType="fade"
        onRequestClose={() => setDialog(null)}
      >
        <Pressable
          accessibilityLabel="Pencereyi kapat"
          onPress={() => setDialog(null)}
          style={{
            flex: 1,
            backgroundColor: "#0009",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={[d.panel, { padding: 24, gap: 18 }]}
          >
            {object && (
              <>
                <Copy title size={23}>
                  {dialog === "buy" ? object.name : "Nereye yerleştirelim?"}
                </Copy>
                {dialog === "buy" ? (
                  <>
                    <Image
                      source={objectImages[object.id]}
                      resizeMode="contain"
                      style={{ width: 150, height: 150, alignSelf: "center" }}
                    />
                    <Copy size={12} style={d.muted}>
                      Çalışarak kazandığın yapraklarla al. Eşyan senin olur.
                    </Copy>
                    <Copy bold>{state.leaves} yaprağın var</Copy>
                    <GameButton
                      disabled={state.leaves < object.cost}
                      onPress={() => {
                        update((s) => buyObject(s, object.id, object.cost));
                        setDialog(null);
                        setNotice("Eşyan dolabına eklendi.");
                      }}
                    >
                      Dolabıma ekle · {object.cost} yaprak
                    </GameButton>
                    {state.leaves < object.cost && (
                      <Copy size={12}>
                        Biraz daha çalışarak yaprak kazanabilirsin.
                      </Copy>
                    )}
                  </>
                ) : (
                  <>
                    <GameButton
                      onPress={() => {
                        setDialog(null);
                        router.push({
                          pathname: "/place",
                          params: { id: object.id, area: "home" },
                        });
                      }}
                    >
                      Evime yerleştir
                    </GameButton>
                    <GameButton
                      onPress={() => {
                        setDialog(null);
                        router.push({
                          pathname: "/place",
                          params: { id: object.id, area: "island" },
                        });
                      }}
                    >
                      Ortak alana yerleştir
                    </GameButton>
                    <Copy size={12} style={d.muted}>
                      Eşyan sana ait kalır. Dilediğinde geri alabilirsin.
                    </Copy>
                  </>
                )}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDialog(null)}
                  style={{ padding: 8 }}
                >
                  <Copy style={{ textAlign: "center" }}>Vazgeç</Copy>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
