import { useEffect, useState, useRef } from "react";
import { Keyboard } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { BottomBarState } from "@/constants/bottomBar";
import { useBrowserSession } from "@/components/browser/BrowserSessionContext";
import AddressBar from "@/components/browser/AddressBar";
import BrowserToolbar from "@/components/browser/BrowserToolbar";
import { getFaviconUrl } from "@/components/browser/BrowserWebView";
import { WebsiteDetailsSheet } from "@/components/ui/WebsiteDetailsSheet";

export default function BottomBar() {
  const { activeTab, isHome, navigate, reload } = useBrowserSession();
  const [isWebsiteDetailsPresented, setIsWebsiteDetailsPresented] =
    useState(false);
  // main state machine
  const [bottomBarState, setBottomBarState] =
    useState<BottomBarState>("focused");

  // search/edit mode state machine
  const previousState = useRef<BottomBarState>("focused");
  const keyboardOffset = useSharedValue(0);

  // expansion state
  const expansion = useSharedValue(0);
  const p_toolbar = useSharedValue(0); // toolbar progress
  const p_minimized = useSharedValue(0);

  const enterEditing = () => {
    setBottomBarState((current) => {
      if (current === "minimized") {
        return current;
      }
      if (current !== "editing") {
        previousState.current = current;
      }

      return "editing";
    });
  };

  const dismissEditing = () => {
    setBottomBarState((current) => {
      if (current !== "editing") return current;

      // Respect the current browser context.
      if (isHome) return "home";

      const previous = previousState.current;

      return previous === "editing" ? "focused" : previous;
    });
  };

  const addressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scaleX: interpolate(p_minimized.value, [0, 1], [1, 0.7]),
      },
      {
        scaleY: interpolate(p_minimized.value, [0, 1], [1, 0.7]),
      },
      {
        translateY: interpolate(p_minimized.value, [0, 1], [0, 80]),
      },
      {
        translateY: interpolate(expansion.value, [0, 1], [0, 50]),
      },
    ],
  }));

  const toolbarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: p_toolbar.value,
    transform: [
      {
        translateY: interpolate(p_toolbar.value, [0, 1], [0, 8]),
      },
      {
        scaleX: interpolate(p_toolbar.value, [0, 1], [0.5, 1]),
      },
    ],
  }));

  // bottom bar gestures
  const tapGesture = Gesture.Tap()
    .enabled(bottomBarState === "minimized")
    .cancelsTouchesInView(bottomBarState === "minimized")
    .onEnd(() => {
      if (bottomBarState !== "minimized") return;
      if (bottomBarState == "minimized") {
        runOnJS(setBottomBarState)("focused");
      }
    });
  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (e.velocityY < -50) {
      if (bottomBarState == "minimized") {
        runOnJS(setBottomBarState)("focused");
      }
    } else if (e.velocityY > 50 && bottomBarState == "focused") {
      runOnJS(setBottomBarState)("minimized");
    } else if (e.velocityY > 50 && bottomBarState == "editing") {
      runOnJS(dismissEditing)();
    }
  });
  const gestureCompose = Gesture.Race(swipeGesture, tapGesture);

  useEffect(() => {
    const expanded = bottomBarState === "home" || bottomBarState === "editing";

    const showToolbar = bottomBarState === "focused";
    const minimized = bottomBarState === "minimized";
    expansion.value = withTiming(expanded ? 1 : 0, {
      duration: 300,
    });

    p_toolbar.value = withTiming(showToolbar ? 1 : 0, {
      duration: 220,
    });

    p_minimized.value = withTiming(minimized ? 1 : 0, {
      duration: 200,
    });
  }, [bottomBarState]);

  useEffect(() => {
    setBottomBarState((current) => {
      if (isHome) return "home";
      if (current === "home") return "focused";
      return current;
    });
  }, [isHome]);

  useEffect(() => {
    const dismissal = setTimeout(() => {
      setIsWebsiteDetailsPresented(false);
    }, 0);

    return () => clearTimeout(dismissal);
  }, [activeTab.id, bottomBarState]);

  useEffect(() => {
    if (bottomBarState !== "editing") return;
  }, [bottomBarState]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (event) => {
      keyboardOffset.value = withTiming(event.endCoordinates.height, {
        duration: 220,
      });
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      keyboardOffset.value = withTiming(0, { duration: 200 });
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, [keyboardOffset]);

  return (
    <>
      <GestureDetector gesture={gestureCompose}>
        <Animated.View
          style={{
            flex: 1,
            position: "absolute",
            bottom: 34,
            width: "100%",
            zIndex: 100,
          }}
        >
          <Animated.View
            style={[
              {
                width: "100%",
                alignItems: "center",
              },
              addressAnimatedStyle,
            ]}
          >
            <AddressBar
              value={activeTab.url}
              isLoading={activeTab.isLoading}
              onSubmit={(value) => {
                navigate(value);
                Keyboard.dismiss();
                setBottomBarState("focused");
              }}
              onFocus={enterEditing}
              onBlur={dismissEditing}
              editable={bottomBarState !== "minimized"}
              onReload={() => reload()}
              favicon={getFaviconUrl(activeTab.url)}
              onWebsiteDetailsPress={() =>
                setIsWebsiteDetailsPresented(true)
              }
            />
          </Animated.View>
          <Animated.View
            pointerEvents={bottomBarState === "focused" ? "auto" : "none"}
            style={[
              {
                width: "100%",
              },
              toolbarAnimatedStyle,
            ]}
          >
            <BrowserToolbar />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <WebsiteDetailsSheet
        isPresented={isWebsiteDetailsPresented}
        onDismiss={() => setIsWebsiteDetailsPresented(false)}
        favicon={getFaviconUrl(activeTab.url)}
        title={activeTab.title}
        url={activeTab.url}
      />
    </>
  );
}
