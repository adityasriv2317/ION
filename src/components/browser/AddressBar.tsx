import { useEffect, useState } from "react";
import { View } from "react-native";

import AdaptiveButton from "@/components/ui/button";
import TextInput from "@/components/ui/textInput";
import { clip, paddingAll, Shapes } from "@expo/ui/jetpack-compose/modifiers";

import * as jetpack from "@expo/ui/jetpack-compose/modifiers";
import { AddressBar as AB } from "@/components/ui/AddressBar";

import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

type Props = {
  value: string;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
};

export default function AddressBar({ value, onSubmit, onFocus }: Props) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  const handleSubmit = () => {
    if (text === "") {
      setText(value);
      return;
    }
    onSubmit(text);
  };

  return (
    <View
      style={{
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        paddingHorizontal: 16,
        marginVertical: 4,
        maxWidth: "90%",
        marginHorizontal: "auto",
        justifyContent: "center",
      }}
    >
      <AB
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Search or enter address"
      />

      <AdaptiveButton
        label="GO"
        onPress={handleSubmit}
        uiModifiers={{
          ios: [
            SwiftUI.glassEffect({
              glass: {
                variant: "regular",
                interactive: true,
                tint: "#158afe",
              },
              shape: "capsule",
            }),
            SwiftUI.padding({ bottom: 6 }),
          ],
          android: [
            // background("#f0d908"),
            jetpack.paddingAll(16),
            jetpack.clip(Shapes.Material.Clover4Leaf),
          ],
        }}
      />
    </View>
  );
}
