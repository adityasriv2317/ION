import { animationConfig, BottomBarState } from "@/constants/bottomBar";
import {
  Archive03Icon,
  CancelCircleIcon,
  CreditCardIcon,
  Delete03Icon,
  IncognitoIcon,
  PlusSignIcon,
  SearchAreaIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { MotiView, View } from "moti";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { BrowserContext } from "@/contexts/BrowserContext";
import MenuBar from "./MenuBar";

export default function BottomBar() {
  const {
    inputValue,
    setInputValue,
    setCurrentUrl,
    pageTitle,
    currentUrl,
    isEditing,
    setIsEditing,
    isLoading,
    setPageTitle,
    accentColor,
    setIsLoading,
    setShowTabs,
  } = useContext(BrowserContext);

  const handleNavigate = () => {
    if (isLoading) {
      return;
    }

    let input = inputValue.trim();

    const isLikelySearch = !input.includes(".") && !input.startsWith("http");
    let url = "";

    if (isLikelySearch) {
      // Google search
      url = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    } else {
      if (!/^https?:\/\//i.test(input)) {
        input = `https://${input}`;
      }

      try {
        const validUrl = new URL(input);
        url = validUrl.href;
      } catch (error) {
        url = `https://www.google.com/search?q=${encodeURIComponent(inputValue)}`;
      }
    }

    setCurrentUrl(url);
    setPageTitle(inputValue); // Set page title to the input value
    setInputValue(url);
    setIsEditing(false);
    setIsLoading(true);
  };

  // color type constant
  const [colorType, setColorType] = useState(1);
  useEffect(() => {
    setColorType(accentColor === "light-content" ? 1 : 0);
  }, [accentColor]);

  // bottomBar button states
  const [showTabButton, setShowTabButton] = useState(true);
  const searchBoxRef = useRef<TextInput>(null);
  // bottom bar animation states
  const [bottomState, setBottomState] = useState<BottomBarState>("normalState");
  const [previousState, setPreviousState] =
    useState<BottomBarState>(bottomState);

  const [showTabViewBar, setShowTabViewBar] = useState(false);
  const [tabViewBarVisible, setTabViewBarVisible] = useState(false);

  // Show/hide tab view bar with animation
  useEffect(() => {
    if (bottomState === "tabView") {
      setShowTabViewBar(true);
      setTabViewBarVisible(true);
    } else if (showTabViewBar) {
      setTabViewBarVisible(false);
    }
  }, [bottomState]);

  // bottom bar gesturs
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (bottomState == "minimizedState") {
      runOnJS(setBottomState)("normalState");
      runOnJS(setShowTabButton)(true);
    }
  });
  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (e.velocityY < -50) {
      // Swipe up
      if (bottomState == "minimizedState") {
        runOnJS(setShowTabButton)(true);
        runOnJS(setBottomState)("normalState");
      } else if (bottomState == "normalState") {
        runOnJS(setShowTabButton)(false);
        runOnJS(setBottomState)("openMenu");
      }
    } else if (e.velocityY > 50) {
      // Swipe down
      if (bottomState == "openMenu") {
        runOnJS(setShowTabButton)(true);
        runOnJS(setBottomState)("normalState");
      } else {
        runOnJS(setShowTabButton)(false);
        runOnJS(setBottomState)("minimizedState");
      }
    }
  });

  const textTouch = Gesture.Tap().onEnd(() => {
    if (bottomState == "minimizedState") {
      runOnJS(setIsEditing)(false);
      runOnJS(setBottomState)("normalState");
      runOnJS(setShowTabButton)(true);
    } else if (bottomState == "normalState" || bottomState == "tabView") {
      runOnJS(setIsEditing)(true);
    }
  });
  const textSwipe = Gesture.Pan().onEnd((e) => {
    if (e.velocityY < -50) {
      // Swipe up
      if (bottomState == "minimizedState") {
        runOnJS(setShowTabButton)(true);
        runOnJS(setBottomState)("normalState");
      } else if (bottomState == "normalState") {
        runOnJS(setShowTabButton)(false);
        runOnJS(setBottomState)("openMenu");
      }
    } else if (e.velocityY > 50) {
      // Swipe down
      if (bottomState == "openMenu") {
        runOnJS(setShowTabButton)(true);
        runOnJS(setBottomState)("normalState");
      } else {
        runOnJS(setShowTabButton)(false);
        runOnJS(setBottomState)("minimizedState");
      }
    }
  });

  const gestureCompose = Gesture.Race(tapGesture, swipeGesture);
  const textBoxCompose = Gesture.Race(textTouch, textSwipe);

  // detect keyboard visibility
  useEffect(() => {
    const handleKeyboardHide = () => {
      if (bottomState === "openMenu") {
        // searchBoxRef.current?.blur();
      } else if (bottomState === "minimizedState") {
        setBottomState("normalState");
        setIsEditing(false);
        setShowTabButton(true);
      } else if (
        bottomState === "searchState" &&
        previousState === "normalState"
      ) {
        setBottomState("normalState");
        setIsEditing(false);
        setShowTabButton(true);
      } else if (bottomState === "searchState" && previousState === "tabView") {
        setBottomState("tabView");
        setIsEditing(false);
        setShowTabButton(true);
      } else if (
        bottomState === "searchState" &&
        previousState === "openMenu"
      ) {
        setIsEditing(false);
        setBottomState("openMenu");
      } else {
        setBottomState("minimizedState");
        setShowTabButton(false);
      }

      searchBoxRef.current?.blur();
    };
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide,
    );

    return () => {
      // keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [bottomState]);

  return (
    <View style={styles.rootContainer}>
      {/* actual bottom bar */}
      <GestureDetector gesture={gestureCompose}>
        <MotiView
          from={animationConfig.begin}
          animate={animationConfig[bottomState]}
          style={[
            styles.bottomBarContainer,
            { maxWidth: bottomState == "openMenu" ? "80%" : "75%" },
            bottomState == "openMenu"
              ? colorType !== 1
                ? styles.bottomBarOpenDark
                : styles.bottomBarOpenLight
              : styles.bottomBarClosed,
          ]}
        >
          <View
            style={[
              styles.barHeaderRow,
              { maxHeight: bottomState == "openMenu" ? "25%" : "100%" },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.searchTouchable,
                colorType !== 1
                  ? styles.searchTouchableDark
                  : styles.searchTouchableLight,
              ]}
              onPress={() => {
                if (bottomState == "minimizedState") {
                  setBottomState("normalState");
                  setIsEditing(false);
                  setShowTabButton(true);
                } else if (
                  bottomState == "normalState" ||
                  bottomState == "tabView"
                ) {
                  setIsEditing(true);
                  searchBoxRef.current?.focus();
                } else if (bottomState == "openMenu") {
                  setIsEditing(true);
                  searchBoxRef.current?.focus();
                  setPreviousState(bottomState);
                  setBottomState("searchState");
                }
              }}
            >
              <View
                style={[
                  styles.inputRow,
                  { display: isEditing ? "flex" : "none" },
                ]}
              >
                <TextInput
                  ref={searchBoxRef}
                  disableFullscreenUI={true}
                  placeholder="Search or enter URL"
                  editable={bottomState == "minimizedState" ? false : true}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  onFocus={() => {
                    if (
                      bottomState == "normalState" ||
                      bottomState == "tabView" ||
                      bottomState == "searchState"
                    ) {
                      setPreviousState(bottomState);
                      setBottomState("searchState");
                      setShowTabButton(false);
                    }
                  }}
                  value={inputValue}
                  onChangeText={setInputValue}
                  returnKeyType="search"
                  returnKeyLabel="Search"
                  keyboardType="web-search"
                  onSubmitEditing={() => {
                    if (
                      inputValue !== currentUrl &&
                      previousState == "openMenu"
                    ) {
                      setBottomState("normalState");
                      setShowTabButton(true);
                    }
                    handleNavigate();
                  }}
                />
                {/* Clear button, only visible when editing and input is not empty */}
                {inputValue.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setInputValue("")}
                    style={styles.clearButton}
                  >
                    <HugeiconsIcon
                      icon={CancelCircleIcon}
                      size={24}
                      color="#fff"
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <GestureDetector gesture={textBoxCompose}>
                <View
                  style={[
                    styles.labelContainer,
                    { display: isEditing ? "none" : "flex" },
                  ]}
                >
                  <Text style={styles.labelText}>
                    {pageTitle
                      ? `${pageTitle.slice(0, 30)}`
                      : "Search or enter URL"}
                  </Text>
                </View>
              </GestureDetector>
            </TouchableOpacity>
            {/* tab view button */}
            <TouchableOpacity
              style={[
                styles.tabButton,
                { display: showTabButton ? "flex" : "none" },
                colorType !== 1 ? styles.tabButtonDark : styles.tabButtonLight,
              ]}
              onPress={() => {
                if (bottomState == "tabView") {
                  setPreviousState(bottomState);
                  setBottomState("normalState");
                  setShowTabs(false);
                } else {
                  setPreviousState(bottomState);
                  setShowTabs(true);
                  setBottomState("tabView");
                }
              }}
            >
              {/* HugeiconsIcon */}
              <HugeiconsIcon
                icon={CreditCardIcon}
                strokeWidth={2}
                color={"#ddd"}
              />
            </TouchableOpacity>
          </View>
          {bottomState === "openMenu" && <MenuBar />}
        </MotiView>
      </GestureDetector>

      {/* tab view options */}
      {showTabViewBar && (
        <MotiView
          from={{
            scale: 0.7,
            opacity: 0,
            translateY: 40,
          }}
          animate={{
            scale: tabViewBarVisible ? 1 : 0.7,
            opacity: tabViewBarVisible ? 1 : 0,
            translateY: tabViewBarVisible ? 0 : 40,
          }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 180,
            mass: 0.8,
          }}
          onDidAnimate={(key, finished) => {
            if (key === "opacity" && !tabViewBarVisible && finished === false) {
              setShowTabViewBar(false);
            }
          }}
          style={[
            styles.tabViewBar,
            { zIndex: bottomState == "tabView" ? 10 : -1 },
          ]}
        >
          <View style={styles.tabActionPill}>
            {/* archive button */}
            <TouchableOpacity>
              <HugeiconsIcon
                icon={Archive03Icon}
                size={22}
                color="#fff"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
            {/* search button */}
            <TouchableOpacity>
              <HugeiconsIcon
                icon={SearchAreaIcon}
                size={22}
                color="#fff"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          {/* close all */}
          <View style={styles.tabActionClosePill}>
            <TouchableOpacity style={styles.deleteButtonTouchable}>
              <HugeiconsIcon
                icon={Delete03Icon}
                size={22}
                color="#fff"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          {/* add new tab */}
          <View style={styles.tabActionPill}>
            {/* new normal tab */}
            <TouchableOpacity>
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={22}
                color="#fff"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
            {/* new private tab */}
            <TouchableOpacity>
              <HugeiconsIcon
                icon={IncognitoIcon}
                size={22}
                color="#fff"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBarContainer: {
    position: "absolute",
    borderWidth: 1,
    zIndex: 100,
    width: "100%",
    maxHeight: "25%",
    minHeight: "7%",
    bottom: 80,
  },
  bottomBarOpenDark: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 32,
    borderBottomColor: "#4b5563",
    borderRightColor: "#4b5563",
    borderTopColor: "#9ca3af",
    borderLeftColor: "#9ca3af",
  },
  bottomBarOpenLight: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 32,
    borderTopColor: "#4b5563",
    borderLeftColor: "#4b5563",
    borderBottomColor: "#9ca3af",
    borderRightColor: "#9ca3af",
  },
  bottomBarClosed: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: 9999,
  },
  barHeaderRow: {
    flexDirection: "row",
    minHeight: "7%",
    width: "100%",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  searchTouchable: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 9999,
  },
  searchTouchableDark: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderTopColor: "#4b5563",
    borderLeftColor: "#4b5563",
    borderBottomColor: "#9ca3af",
    borderRightColor: "#9ca3af",
  },
  searchTouchableLight: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomColor: "#4b5563",
    borderRightColor: "#4b5563",
    borderTopColor: "#9ca3af",
    borderLeftColor: "#9ca3af",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textInput: {
    height: 48,
    paddingHorizontal: 10,
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 8,
  },
  labelContainer: {
    height: 40,
    width: "100%",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    textAlign: "center",
    color: "#fff",
  },
  tabButton: {
    borderWidth: 1,
    borderRadius: 9999,
    padding: 8,
  },
  tabButtonDark: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderBottomColor: "#4b5563",
    borderRightColor: "#4b5563",
    borderTopColor: "#9ca3af",
    borderLeftColor: "#9ca3af",
  },
  tabButtonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopColor: "#4b5563",
    borderLeftColor: "#4b5563",
    borderBottomColor: "#9ca3af",
    borderRightColor: "#9ca3af",
  },
  tabViewBar: {
    position: "absolute",
    bottom: 104,
    width: "100%",
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabActionPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
    borderRadius: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopColor: "#4b5563",
    borderLeftColor: "#4b5563",
    borderBottomColor: "#9ca3af",
    borderRightColor: "#9ca3af",
    borderWidth: 1,
  },
  tabActionClosePill: {
    borderRadius: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopColor: "#4b5563",
    borderLeftColor: "#4b5563",
    borderBottomColor: "#9ca3af",
    borderRightColor: "#9ca3af",
    borderWidth: 1,
  },
  deleteButtonTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
});
