import {
  Button,
  Host,
  HStack,
  Image,
  TextField,
  useNativeState,
  type TextFieldRef,
} from "@expo/ui/swift-ui";

import {
  buttonStyle,
  disabled as disabledModifier,
  foregroundStyle,
  frame,
  glassEffect,
  keyboardType,
  onSubmit,
  padding,
  submitLabel,
} from "@expo/ui/swift-ui/modifiers";
import { Image as RNImage } from "react-native";

import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { AddressBarProps } from "@/components/ui/AddressBar";

export function AddressBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "Search or enter address",
  onFocus,
  onBlur,
  isDisabled,
  favicon,
  onFaviconPress,
}: AddressBarProps) {
  const inputRef = useRef<TextFieldRef>(null);
  const text = useNativeState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (text.value !== value) {
      text.value = value;
    }
  }, [value, text]);

  const clear = () => {
    onChangeText("");
    void inputRef.current?.clear().then(() => inputRef.current?.focus());
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
            padding({ leading: 8, vertical: 8, trailing: 4 }),
            glassEffect({
              glass: {
                variant: "regular",
                interactive: true,
              },
              shape: "capsule",
            }),
          ]}
        >
          <Button
            onPress={onFaviconPress}
            modifiers={[
              buttonStyle("plain"),
              frame({ width: 32, height: 32 }), // Strictly sizes the SwiftUI button for perfect vertical alignment
            ]}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16, // Makes it perfectly circular
                borderWidth: favicon ? 1 : 0,
                borderColor: favicon ? "rgba(150, 150, 150, 0.4)" : "#ffffff00", // Subtle border color
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {favicon ? (
                <RNImage
                  source={{ uri: favicon }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                  }}
                />
              ) : (
                <Image systemName="globe" color="secondary" size={16} />
              )}
            </View>
          </Button>

          <TextField
            ref={inputRef}
            text={text}
            placeholder={placeholder}
            onTextChange={onChangeText}
            onFocusChange={(focused) => {
              setIsFocused(focused);
              if (focused) {
                onFocus?.();
              } else {
                onBlur?.();
              }
            }}
            modifiers={[
              frame({ maxWidth: Infinity }),
              keyboardType("web-search"),
              submitLabel("go"),
              onSubmit(submit),
              disabledModifier(isDisabled),
            ]}
          />

          {value.length > 0 && !isDisabled && (
            <Button
              onPress={clear}
              modifiers={[
                buttonStyle("borderless"),
                frame({ width: 32, height: 32 }),
              ]}
            >
              <Image
                systemName="xmark"
                modifiers={[
                  foregroundStyle({
                    type: "color",
                    color: "#ffffff",
                  }),
                ]}
                size={16}
              />
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
  },
  host: {
    width: "100%",
  },
});
