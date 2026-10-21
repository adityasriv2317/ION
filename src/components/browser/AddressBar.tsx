import { useEffect, useState } from "react";
import { View } from "react-native";
import { Icon } from "@expo/ui";

import AdaptiveButton from "@/components/ui/button";

import * as jetpack from "@expo/ui/jetpack-compose/modifiers";
import { AddressBar as AB } from "@/components/ui/AddressBar";

import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

const submitIcon = Icon.select({
  ios: "arrow.up",
  android: import("@expo/material-symbols/arrow_upward.xml"),
});
const reloadIcon = Icon.select({
  ios: "arrow.clockwise",
  android: import("@expo/material-symbols/refresh.xml"),
});

type Props = {
  value: string;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  onReload?: () => void;
};

export default function AddressBar({
  value,
  onSubmit,
  isLoading = false,
  onReload,
}: Props) {
  const [text, setText] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => setText(value), [value]);

  const handleSubmit = () => {
    setIsEditing(false);
    if (text === "") {
      setText(value);
      return;
    }
    onSubmit(text);
  };

  const showSubmitAction = isEditing || isLoading || !onReload;

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
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
      />

      <AdaptiveButton
        systemImage={showSubmitAction ? submitIcon : reloadIcon}
        onPressButton={showSubmitAction ? handleSubmit : () => onReload?.()}
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
            SwiftUI.padding({ bottom: 3 }),
          ],
          android: [
            jetpack.size(64, 64),
            jetpack.clip(jetpack.Shapes.Circle),
            jetpack.background("#0240f8e0"),
          ],
        }}
      />
    </View>
  );
}
