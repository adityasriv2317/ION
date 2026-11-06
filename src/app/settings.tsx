import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

import AdaptiveButton from "@/components/ui/button";
import BuiltForMobileSheet from "@/components/ui/BuiltForMobileSheet";
import Toggle from "@/components/ui/toggle";
import { HugeIcons, SystemIcons } from "@/constants/icons";
import { useBrowserStore } from "@/stores/browserStore";
import { useTheme, type ThemeMode } from "@/stores/themeContext";

const appVersion = "0.1.0";

export default function SettingsScreen() {
  const router = useRouter();
  const isIncognito = useBrowserStore((state) => state.isIncognito);
  const setIncognito = useBrowserStore((state) => state.setIncognito);
  const { colors, mode, setMode } = useTheme();
  const [isMobileDetailsPresented, setIsMobileDetailsPresented] =
    useState(false);

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AdaptiveButton
            label=""
            systemImage={SystemIcons.arrowBack}
            onPressButton={() => router.back()}
            backgroundColor={colors.buttonBg}
            textColor={colors.text}
            uiModifiers={{
              ios: [
                SwiftUI.glassEffect({
                  glass: { variant: "clear", interactive: true },
                  shape: "circle",
                }),
              ],
            }}
          />
          <Text style={[styles.heading, { color: colors.text }]}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <SettingsSection title="Appearance">
          <SettingsRow
            icon={HugeIcons.settings}
            title="Theme"
            description="Choose how ION looks."
            accessory={
              <View style={styles.themeOptions}>
                {(["system", "light", "dark"] as ThemeMode[]).map((option) => (
                  <Pressable
                    key={option}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: mode === option }}
                    onPress={() => setMode(option)}
                    style={[
                      styles.themeOption,
                      { borderColor: colors.border },
                      mode === option && {
                        backgroundColor: colors.accent,
                        borderColor: colors.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeOptionText,
                        {
                          color:
                            mode === option
                              ? colors.accentText
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {option[0].toUpperCase() + option.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
          />
        </SettingsSection>

        <SettingsSection title="Browsing">
          <SettingsRow
            icon={HugeIcons.incognito}
            title="Incognito mode"
            description="Pause browsing history."
            accessory={
              <Toggle value={isIncognito} onValueChange={setIncognito} />
            }
          />
          <SettingsRow
            icon={HugeIcons.refresh}
            title="Browsing history"
            description="Review pages you have visited."
            onPress={() => router.push("/history")}
          />
          <SettingsRow
            icon={HugeIcons.bookmark}
            title="Bookmarks"
            description="Manage your saved pages."
            onPress={() => router.push("/bookmarks")}
          />
          <SettingsRow
            icon={HugeIcons.arrowRight01}
            title="Tabs"
            description="Switch between your active tabs."
            onPress={() => router.push("/tabs")}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow
            icon={HugeIcons.globe}
            title="ION Browser"
            description="A focused, private browsing experience."
            accessory={<Text style={styles.version}>v{appVersion}</Text>}
          />
          <SettingsRow
            icon={HugeIcons.zap}
            title="About the developer"
            description="Learn more about the person behind ION."
            onPress={() => setIsMobileDetailsPresented(true)}
          />
        </SettingsSection>
      </ScrollView>
      <BuiltForMobileSheet
        isPresented={isMobileDetailsPresented}
        onDismiss={() => setIsMobileDetailsPresented(false)}
      />
    </SafeAreaView>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  accessory,
  onPress,
}: {
  icon: typeof HugeIcons.settings;
  title: string;
  description?: string;
  accessory?: React.ReactNode;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const content = (
    <>
      <View
        style={[styles.rowIcon, { backgroundColor: colors.iconBackground }]}
      >
        <HugeiconsIcon icon={icon} size={21} color={colors.accent} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.rowDescription, { color: colors.muted }]}>
            {description}
          </Text>
        )}
      </View>
      {accessory ?? (
        <Text
          style={[styles.chevron, { color: colors.accent }]}
          accessibilityLabel="Open"
        >
          ›
        </Text>
      )}
    </>
  );

  return onPress ? (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  ) : (
    <View style={styles.row}>{content}</View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111121",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  content: {
    paddingBottom: 36,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 56,
    marginBottom: 20,
  },
  headerSpacer: {
    width: 72,
  },
  heading: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "#7657E8",
    borderRadius: 20,
    height: 64,
    justifyContent: "center",
    marginBottom: 14,
    width: 64,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#B9B6D0",
    fontSize: 14,
    marginTop: 7,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF12",
    borderColor: "#FFFFFF16",
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  rowPressed: {
    backgroundColor: "#FFFFFF10",
  },
  rowIcon: {
    alignItems: "center",
    backgroundColor: "#292747",
    borderRadius: 14,
    height: 42,
    justifyContent: "center",
    marginRight: 12,
    width: 42,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  rowDescription: {
    color: "#918DAF",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  chevron: {
    color: "#B7A5FF",
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 10,
  },
  version: {
    color: "#B7A5FF",
    fontSize: 12,
    fontWeight: "700",
  },
  themeOptions: {
    flexDirection: "row",
    gap: 4,
  },
  themeOption: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  themeOptionText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
