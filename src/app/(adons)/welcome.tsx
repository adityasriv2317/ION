import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { MotiText, MotiView, SafeAreaView } from "moti";
import { HugeiconsIcon } from "@hugeicons/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeLiquid from "./HomeLiquid";
import { HugeIcons } from "@/constants/icons";

export default function Welcome() {
  const router = useRouter();

  const [next, setNext] = useState(0);

  const [pressed, setPressed] = useState(false);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* background */}
      <HomeLiquid />

      <View style={styles.mainContainer}>
        {/* icon and text */}
        <View style={styles.iconsContainer}>
          <Image
            style={styles.logoImage}
            source={require("@/assets/images/icon.png")}
          />
          <MotiText
            from={{ opacity: 0, translateY: 0 }}
            animate={{
              opacity: next === 0 ? 1 : 0,
              translateY: next === 0 ? 0 : -20,
            }}
            transition={{ type: "spring", duration: 350 }}
            style={styles.logoText}
            pointerEvents={next === 0 ? "auto" : "none"}
          >
            Ion Browser
          </MotiText>
        </View>

        {/* features section */}
        <MotiView
          from={{ opacity: 0, translateY: 60, scale: 0.9, height: 50 }}
          animate={{
            opacity: next !== 0 ? 1 : 0,
            translateY: next !== 0 ? 0 : 60,
            scale: next !== 0 ? 1 : 0.9,
            height: next !== 0 ? 350 : 0,
          }}
          transition={{
            type: "spring",
            height: { type: "spring", duration: 500, delay: 0 },
          }}
          style={[
            styles.featuresCard,
            { display: next === 0 ? "none" : "flex" },
          ]}
        >
          {next !== 0 && (
            <View style={styles.featuresContent}>
              <MotiView
                key={next}
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", delay: 100 }}
                style={styles.featureIconContainer}
              >
                {next === 1 && (
                  <HugeiconsIcon
                    icon={HugeIcons.globe}
                    size={52}
                    color="#1e293b"
                    strokeWidth={2}
                  />
                )}
                {next === 2 && (
                  <HugeiconsIcon
                    icon={HugeIcons.zap}
                    size={52}
                    color="#224baa"
                    strokeWidth={2}
                  />
                )}
                {next === 3 && (
                  <HugeiconsIcon
                    icon={HugeIcons.rocket}
                    size={52}
                    color="#a30ec1"
                    strokeWidth={2}
                  />
                )}
              </MotiView>
              <MotiText
                from={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -40 }}
                transition={{ type: "spring", duration: 800 }}
                style={styles.featureTitle}
                key={`title-${next}`}
              >
                {next == 1
                  ? "Hello Ion Browser!"
                  : next == 2
                    ? "Clean & Fast"
                    : next == 3
                      ? "Enhanced Browsing"
                      : ""}
              </MotiText>
            </View>
          )}
        </MotiView>

        {/* continue button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.touchableButton}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={async () => {
              if (next < 3) {
                setNext((prev) => prev + 1);
              } else {
                await AsyncStorage.setItem("welcomeScreenShown", "true");
                router.replace("/");
                setNext(0);
              }
            }}
          >
            <MotiView
              from={{ scale: 0.9 }}
              animate={{ scale: pressed ? 0.9 : 1 }}
              transition={{
                type: "spring",
              }}
              style={styles.buttonInner}
            >
              <HugeiconsIcon
                icon={HugeIcons.arrowRight01}
                size={24}
                color="#222222"
                strokeWidth={3.5}
              />
            </MotiView>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "black",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 0,
  },
  iconsContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 200,
    height: 200,
    borderRadius: 32,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginTop: 4,
  },
  featuresCard: {
    width: "90%",
    marginHorizontal: 24,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 28,
    borderWidth: 0,
    marginBottom: 32,
    padding: 0,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  featuresContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  featureIconContainer: {
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 18,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  touchableButton: {
    position: "absolute",
    zIndex: 50,
    bottom: 62,
    borderRadius: 9999,
    backgroundColor: "rgba(245, 245, 245, 0.65)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 9999,
    // paddingHorizontal: 40,
    padding: 20,
    backgroundColor: "rgba(189, 204, 228, 0.25)",
    shadowColor: "rgba(26, 25, 25, 0.31)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
});
