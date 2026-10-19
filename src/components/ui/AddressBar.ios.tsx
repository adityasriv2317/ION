import {
  Button,
  Host,
  HStack,
  Image,
  Text,
  TextField,
  useNativeState,
  type TextFieldRef,
} from "@expo/ui/swift-ui";

import {
  buttonStyle,
  frame,
  glassEffect,
  keyboardType,
  onSubmit,
  padding,
  submitLabel,
} from "@expo/ui/swift-ui/modifiers";

import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { AddressBarProps } from "./AddressBar";

export function AddressBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "Search or enter address",
  disabled = false,
}: AddressBarProps) {
  const inputRef = useRef<TextFieldRef>(null);
  const text = useNativeState(value);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (text.value !== value) {
      text.value = value;
    }
  }, [value, text]);

  const clear = () => {
    text.value = "";
    onChangeText("");
    void inputRef.current?.clear();
    void inputRef.current?.focus();
  };

  const submit = () => {
    const query = text.value.trim();
    if (query) onSubmitEditing(query);
  };

  return (
    <View style={styles.wrapper}>
      <Host
        matchContents={{ vertical: true }}
        ignoreSafeArea="keyboard"
        style={styles.host}
      >
        <HStack
          alignment="center"
          spacing={8}
          modifiers={[
            frame({ width: 250 }),
            padding({ horizontal: 8, vertical: 8 }),
            glassEffect({
              glass: {
                variant: "regular",
                interactive: true,
              },
              shape: "capsule",
            }),
          ]}
        >
          <Image systemName="globe" color="secondary" size={18} />

          <TextField
            ref={inputRef}
            text={text}
            placeholder={placeholder}
            onTextChange={onChangeText}
            onFocusChange={setFocused}
            modifiers={[
              frame({ maxWidth: Infinity, width: 200 }),
              keyboardType("web-search"),
              submitLabel("go"),
              onSubmit(submit),
            ]}
          />

          {value.length > 0 && !disabled && (
            <Button onPress={clear} modifiers={[buttonStyle("plain")]}>
              <Text modifiers={[padding({ all: 2 })]}>X</Text>
            </Button>
          )}
        </HStack>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "90%",
    alignSelf: "flex-start",
    // maxWidth: 600,
  },
  host: {
    width: "90%",
  },
});
