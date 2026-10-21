import * as Jetpack from "@expo/ui/jetpack-compose/modifiers";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import HomeLiquid from "@/app/(adons)/HomeLiquid";
import AdaptiveButton from "@/components/ui/button";
import TextInput from "@/components/ui/textInput";
import { SystemIcons } from "@/constants/icons";
import { useBrowserStore } from "@/stores/browserStore";
import type { Favourite } from "@/types/browser";
import { resolveNavigationTarget } from "@/utils/resolveNavigationTarget";
import AddressBar from "./browser/AddressBar";

type Props = {
  onNavigate: (url: string) => void;
};

const buttonUI = {
  ios: [
    SwiftUI.glassEffect({
      glass: { variant: "clear", interactive: true, tint: "#7657E8" },
      shape: "roundedRectangle",
      cornerRadius: 16,
    }),
  ],
  android: [
    Jetpack.clip(Jetpack.Shapes.RoundedCorner(16)),
    Jetpack.background("#7657E8"),
  ],
};

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function HomePage({ onNavigate }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isIncognito = useBrowserStore((state) => state.isIncognito);
  const favourites = useBrowserStore((state) => state.favourites);
  const setFavourites = useBrowserStore((state) => state.setFavourites);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const shortcutWidth = Math.min(88, Math.max(68, (width - 88) / 4));
  const canAdd = title.trim().length > 0 && url.trim().length > 0;
  const initials = useMemo(
    () => (item: Favourite) => item.title.trim().charAt(0).toUpperCase(),
    [],
  );

  const navigateToQuery = (input: string) => {
    const query = input.trim();
    if (query) {
      onNavigate(query);
    }
  };

  const addFavourite = () => {
    if (!canAdd) return;
    setFavourites([
      ...favourites,
      {
        id: createId(),
        title: title.trim(),
        url: resolveNavigationTarget(url.trim()),
      },
    ]);
    setTitle("");
    setUrl("");
  };

  return (
    <View style={styles.mainContainer}>
      <HomeLiquid />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isIncognito ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favourites</Text>
              <AdaptiveButton
                label=""
                systemImage={isEditing ? SystemIcons.done : SystemIcons.edit}
                onPressButton={() => setIsEditing((value) => !value)}
                backgroundColor="transparent"
                textColor="#FFFFFF"
                uiModifiers={{
                  ios: [
                    SwiftUI.glassEffect({
                      glass: {
                        variant: "clear",
                        interactive: true,
                        tint: "#7657E8",
                      },
                      shape: "circle",
                      cornerRadius: 16,
                    }),
                  ],
                  android: [
                    Jetpack.clip(Jetpack.Shapes.Circle),
                    Jetpack.background("#7657E8"),
                  ],
                }}
              />
            </View>
            <View style={styles.shortcuts}>
              {favourites.map((item) => (
                <View
                  key={item.id}
                  style={[styles.shortcut, { width: shortcutWidth }]}
                >
                  <Pressable
                    disabled={isEditing}
                    onPress={() => onNavigate(item.url)}
                    style={styles.shortcutPressable}
                  >
                    <View style={styles.shortcutIcon}>
                      <Text style={styles.shortcutInitial}>
                        {initials(item)}
                      </Text>
                    </View>
                    <Text numberOfLines={1} style={styles.shortcutTitle}>
                      {item.title}
                    </Text>
                  </Pressable>
                  {isEditing && (
                    <Pressable
                      accessibilityLabel={`Remove ${item.title}`}
                      onPress={() =>
                        setFavourites(
                          favourites.filter(
                            (favourite) => favourite.id !== item.id,
                          ),
                        )
                      }
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>×</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
            {isEditing && (
              <View style={styles.addCard}>
                <Text style={styles.addTitle}>Add favourite</Text>
                <TextInput
                  value={title}
                  placeholder="Name"
                  defaultValue=""
                  disabled={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onChangeText={setTitle}
                />
                <TextInput
                  value={url}
                  placeholder="Website address"
                  defaultValue=""
                  disabled={false}
                  keyboardType="url"
                  returnKeyType="done"
                  onChangeText={setUrl}
                  onSubmitEditing={addFavourite}
                />
                <View
                  style={{
                    alignSelf: "flex-end",
                    margin: 4,
                  }}
                >
                  <AdaptiveButton
                    label=""
                    systemImage={SystemIcons.add}
                    onPressButton={addFavourite}
                    disabled={!canAdd}
                    backgroundColor="#ffffff"
                    textColor="#FFFFFF"
                    uiModifiers={buttonUI}
                  />
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.privateCard}>
            <View style={styles.privateIcon}>
              <Text style={styles.privateIconText}>◉</Text>
            </View>
            <View style={styles.privateCopy}>
              <Text style={styles.privateTitle}>Secret Mode is on</Text>
              <Text style={styles.privateText}>
                Favourites are hidden and this session.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <AdaptiveButton
            label="Tabs"
            systemImage={SystemIcons.stack}
            onPressButton={() => router.push("/tabs")}
            backgroundColor="transparent"
            textColor="#FFFFFF"
            uiModifiers={buttonUI}
          />
        </View>
      </ScrollView>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <AddressBar onSubmit={navigateToQuery} value="" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    alignItems: "center",
    backgroundColor: "#7657E8",
    borderRadius: 20,
    height: 56,
    justifyContent: "center",
    marginBottom: 18,
    width: 56,
  },
  incognitoLogo: {
    backgroundColor: "#292747",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  eyebrow: {
    color: "#B7A5FF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#B9B6D0",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  searchCard: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
    width: "50%",
    marginHorizontal: "auto",
  },
  section: {
    maxWidth: 560,
    width: "100%",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  sectionHint: {
    color: "#918DAF",
    fontSize: 12,
    marginTop: 3,
  },
  shortcuts: {
    backgroundColor: "#FFFFFF12",
    borderColor: "#FFFFFF16",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    paddingVertical: 20,
    rowGap: 18,
  },
  shortcut: {
    alignItems: "center",
    position: "relative",
  },
  shortcutPressable: {
    alignItems: "center",
  },
  shortcutIcon: {
    alignItems: "center",
    backgroundColor: "#292747",
    borderRadius: 18,
    height: 52,
    justifyContent: "center",
    marginBottom: 8,
    width: 52,
  },
  shortcutInitial: {
    color: "#C5B8FF",
    fontSize: 21,
    fontWeight: "800",
  },
  shortcutTitle: {
    color: "#E3E0F2",
    fontSize: 12,
    maxWidth: 82,
    textAlign: "center",
  },
  removeButton: {
    alignItems: "center",
    backgroundColor: "#FF5F6D",
    borderColor: "#161525",
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 4,
    top: -8,
    width: 24,
  },
  removeText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 19,
  },
  addCard: {
    backgroundColor: "#211F3A99",
    borderRadius: 20,
    gap: 8,
    marginTop: 12,
    padding: 16,
  },
  addTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  privateCard: {
    alignItems: "center",
    backgroundColor: "#211F3A99",
    borderColor: "#7657E855",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 30,
    maxWidth: 560,
    padding: 20,
    width: "100%",
  },
  privateIcon: {
    alignItems: "center",
    backgroundColor: "#7657E833",
    borderRadius: 18,
    height: 52,
    justifyContent: "center",
    marginRight: 16,
    width: 52,
  },
  privateIconText: {
    color: "#C5B8FF",
    fontSize: 24,
  },
  privateCopy: {
    flex: 1,
  },
  privateTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  privateText: {
    color: "#B9B6D0",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 30,
  },
});
