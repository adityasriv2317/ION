import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeLiquid from "./HomeLiquid";
import { HugeIcons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 160,
};

export default function Welcome() {
  const router = useRouter();

  const [next, setNext] = useState(0);

  // Logo animation
  const logoOpacity = useSharedValue(1);
  const logoTranslateY = useSharedValue(0);

  // Feature card animation
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(60);
  const cardScale = useSharedValue(0.9);
  const cardHeight = useSharedValue(0);

  // Continue button press animation
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    const isWelcome = next === 0;

    logoOpacity.value = withTiming(isWelcome ? 1 : 0, {
      duration: 300,
    });
    logoTranslateY.value = withSpring(isWelcome ? 0 : -20, SPRING_CONFIG);

    cardOpacity.value = withTiming(isWelcome ? 0 : 1, {
      duration: 300,
    });
    cardTranslateY.value = withSpring(isWelcome ? 60 : 0, SPRING_CONFIG);
    cardScale.value = withSpring(isWelcome ? 0.9 : 1, SPRING_CONFIG);
    cardHeight.value = withSpring(isWelcome ? 0 : 350, {
      ...SPRING_CONFIG,
      damping: 22,
    });
  }, [
    next,
    logoOpacity,
    logoTranslateY,
    cardOpacity,
    cardTranslateY,
    cardScale,
    cardHeight,
  ]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    height: cardHeight.value,
    transform: [
      { translateY: cardTranslateY.value },
      { scale: cardScale.value },
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleContinue = async () => {
    if (next < 3) {
      setNext((prev) => prev + 1);
    } else {
      await AsyncStorage.setItem("welcomeScreenShown", "true");
      router.replace("/");
      setNext(0);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* Background */}
      <HomeLiquid />

      <View style={styles.mainContainer}>
        {/* Logo and text */}
        <View style={styles.iconsContainer}>
          <Image
            style={styles.logoImage}
            source={require("@/assets/images/icon.png")}
          />

          <Animated.Text
            style={[styles.logoText, logoAnimatedStyle]}
            pointerEvents={next === 0 ? "auto" : "none"}
          >
            Ion Browser
          </Animated.Text>
        </View>

        {/* Features section */}
        <Animated.View
          pointerEvents={next === 0 ? "none" : "auto"}
          style={[styles.featuresCard, cardAnimatedStyle]}
        >
          {next !== 0 && (
            <View style={styles.featuresContent}>
              {/* Feature icon */}
              <Animated.View
                key={`icon-${next}`}
                entering={ZoomIn.duration(350)}
                exiting={ZoomOut.duration(180)}
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
              </Animated.View>

              {/* Feature title */}
              <Animated.Text
                key={`title-${next}`}
                entering={FadeIn.duration(350)}
                exiting={FadeOut.duration(180)}
                style={styles.featureTitle}
              >
                {next === 1
                  ? "Hello Ion Browser!"
                  : next === 2
                    ? "Clean & Fast"
                    : next === 3
                      ? "Enhanced Browsing"
                      : ""}
              </Animated.Text>
            </View>
          )}
        </Animated.View>

        {/* Continue button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.touchableButton}
            onPressIn={() => {
              buttonScale.value = withSpring(0.9, {
                damping: 14,
                stiffness: 250,
              });
            }}
            onPressOut={() => {
              buttonScale.value = withSpring(1, {
                damping: 12,
                stiffness: 200,
              });
            }}
            onPress={handleContinue}
          >
            <Animated.View style={[styles.buttonInner, buttonAnimatedStyle]}>
              <HugeiconsIcon
                icon={HugeIcons.arrowRight01}
                size={24}
                color="#222222"
                strokeWidth={3.5}
              />
            </Animated.View>
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
    overflow: "hidden",
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
    padding: 20,
    backgroundColor: "rgba(189, 204, 228, 0.25)",
    shadowColor: "rgba(26, 25, 25, 0.31)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
});
