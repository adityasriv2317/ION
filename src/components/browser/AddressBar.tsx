import { useEffect, useState } from "react";
import { View } from "react-native";
import AdaptiveButton from "@/components/ui/button";
import { SystemIcons } from "@/constants/icons";

import { HOME_URL } from "@/stores/browserStore";

import * as jetpack from "@expo/ui/jetpack-compose/modifiers";
import { AddressBar as AB } from "@/components/ui/AddressBar";

import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

export type addressbarProps = {
  value: string;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  onReload?: () => void;
  onFocus?: () => void;
  editable?: boolean;
  onBlur?: () => void;
  favicon?: string;
  onWebsiteDetailsPress?: () => void;
};

export default function AddressBar({
  value,
  onSubmit,
  isLoading = false,
  onReload,
  onFocus,
  editable,
  onBlur,
  favicon,
  onWebsiteDetailsPress,
}: addressbarProps) {
  const [text, setText] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const BUTTON_WIDTH = 64;
  const buttonProgress = useSharedValue(editable ? 1 : 0);

  useEffect(() => {
    buttonProgress.value = withSpring(editable ? 1 : 0, {
      duration: 100,
    });
  }, [editable]);

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonProgress.value,
    width: BUTTON_WIDTH * buttonProgress.value,
    transform: [
      {
        translateX: (buttonProgress.value - 1) * 40,
      },
    ],
  }));

  useEffect(() => {
    if (value === HOME_URL) {
      setText("");
      return;
    }
    setText(value);
  }, [value]);

  const handleSubmit = () => {
    setIsEditing(false);
    if (text === "") {
      setText(value);
      return;
    }
    onSubmit(text);
  };

  // action button behaviour properties
  let buttonIcon = SystemIcons.reload;
  let buttonAction = () => onReload?.();
  let isButtonDisabled = false;

  // button behaviour states
  if (isEditing || !onReload) {
    // 1. User is typing hence submit icon
    buttonIcon = SystemIcons.arrowUp;
    buttonAction = handleSubmit;
  } else if (isLoading) {
    //2. page is in loading state hence show loader and disable button
    buttonIcon = SystemIcons.loading;
    buttonAction = () => {};
    isButtonDisabled = true;
  }

  return (
    <View
      style={{
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        paddingHorizontal: "10%",
        marginVertical: 10,
        width: "100%",
        marginHorizontal: "auto",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <AB
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Search or enter address"
        onFocus={() => {
          setIsEditing(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsEditing(false);
          if (value === HOME_URL) {
            setText("");
          } else {
            setText(value);
          }
          onBlur?.();
        }}
        isDisabled={!editable}
        favicon={favicon}
        onFaviconPress={() => {
          if (editable) onWebsiteDetailsPress?.();
        }}
      />

      <Animated.View
        style={[
          buttonStyle,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        pointerEvents={editable ? "auto" : "none"}
      >
        <AdaptiveButton
          key={`${buttonIcon}-${isButtonDisabled}`}
          label=""
          systemImage={buttonIcon}
          disabled={isButtonDisabled}
          onPressButton={buttonAction}
          backgroundColor="#0240f800"
          textColor="#bbdcff"
          uiModifiers={{
            ios: [
              SwiftUI.glassEffect({
                glass: {
                  variant: "regular",
                  // variant: "identity",
                  interactive: true,
                  tint: "#158afe",
                },
                shape: "circle",
              }),
            ],
            android: [
              jetpack.size(64, 64),
              jetpack.clip(jetpack.Shapes.Circle),
              jetpack.background("#0240f8e0"),
            ],
          }}
        />
      </Animated.View>
    </View>
  );
}
