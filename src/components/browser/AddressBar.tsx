import { useEffect, useState } from "react";
import { View, TextInput } from "react-native";

import AdaptiveButton from "@/components/ui/button";
import { glassEffect } from "@expo/ui/swift-ui/modifiers";
import {
  background,
  paddingAll,
  clip,
  Shapes,
} from "@expo/ui/jetpack-compose/modifiers";

type Props = {
  value: string;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
};

export default function AddressBar({ value, onSubmit, onFocus }: Props) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  return (
    <View
      style={{
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        paddingHorizontal: 12,
        backgroundColor: "#323268",
        marginVertical: 4,
        maxWidth: "90%",
        marginHorizontal: "auto",
      }}
    >
      {/* <TextInput */}
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={(t) => {
          if (t.nativeEvent.text === "") {
            setText(value);
            return;
          }
          onSubmit(text);
        }}
        onFocus={onFocus}
        placeholder="Search here"
        placeholderTextColor="#db91fd"
        autoCorrect={false}
        keyboardType="web-search"
        returnKeyType="go"
        selectTextOnFocus
        accessibilityLabel="Search or enter website"
        autoCapitalize="none"
        style={{
          flex: 1,
          color: "#FFFFFF",
          paddingVertical: 12,
          textAlign: "center",
        }}
      />
      <AdaptiveButton
        label="GO"
        onPress={() => onSubmit(text)}
        uiModifiers={{
          ios: [
            glassEffect({
              glass: {
                variant: "regular",
                interactive: false,
                tint: "#1dc400",
              },
              shape: "circle",
            }),
          ],
          android: [
            background("#f0d908"),
            paddingAll(12),
            clip(Shapes.RoundedCorner(20)),
          ],
        }}
      />
    </View>
  );
}
