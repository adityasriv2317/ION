import {
  Host,
  HStack,
  Text,
  TextField,
  type TextFieldRef,
  useNativeState,
} from "@expo/ui/swift-ui";

import {
  disabled as disabledModifier,
  fixedSize,
  foregroundStyle,
  glassEffect,
  keyboardType,
  lineLimit,
  onSubmit,
  padding,
  submitLabel,
  type ModifierConfig as IOSModifierConfig,
} from "@expo/ui/swift-ui/modifiers";

import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";

export interface TextInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: (e: { nativeEvent: { text: string } }) => void;
  uiModifiers?: {
    ios?: IOSModifierConfig[];
  };
}

export default function TextInput({
  placeholder,
  value,
  defaultValue = "",
  disabled = false,
  onChangeText,
  onSubmitEditing,
  uiModifiers,
}: TextInputProps) {
  const inputRef = useRef<TextFieldRef>(null);
  const text = useNativeState(value ?? defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external controlled value with native state.
  useEffect(() => {
    if (value !== undefined && text.value !== value) {
      text.value = value;
    }
  }, [value, text]);

  const handleTextChange = useCallback(
    (nextText: string) => {
      if (text.value !== nextText) {
        text.value = nextText;
      }

      onChangeText?.(nextText);
    },
    [text, onChangeText],
  );

  const handleSend = useCallback(() => {
    const current = text.value;

    if (disabled || current.trim().length === 0) {
      return;
    }

    onSubmitEditing?.({
      nativeEvent: { text: current },
    });

    // Uncontrolled inputs clear themselves.
    // Controlled inputs must be cleared by the parent.
    if (value === undefined) {
      text.value = "";
      void inputRef.current?.clear();
    }
  }, [disabled, text, value, onSubmitEditing]);

  const fieldModifiers: IOSModifierConfig[] = [
    submitLabel("send"),
    onSubmit(handleSend),
    keyboardType("web-search"),
    lineLimit({ min: 1, max: 5 }),
    fixedSize({ horizontal: false, vertical: true }),
    ...(disabled ? [disabledModifier(true)] : []),
    ...(uiModifiers?.ios ?? []),
  ];

  return (
    <Host matchContents={{ vertical: true }} style={styles.host}>
      <HStack
        alignment="bottom"
        spacing={8}
        modifiers={[
          padding({ horizontal: 16, vertical: 12 }),
          glassEffect({
            glass: {
              variant: "regular",
              interactive: true,
            },
            shape: "roundedRectangle",
            cornerRadius: 24,
          }),
        ]}
      >
        <TextField
          ref={inputRef}
          text={text}
          axis="vertical"
          onTextChange={handleTextChange}
          onFocusChange={setIsFocused}
          modifiers={fieldModifiers}
        >
          {placeholder ? (
            <TextField.Placeholder>
              <Text modifiers={[foregroundStyle("rgba(255, 255, 255, 0.45)")]}>
                {placeholder}
              </Text>
            </TextField.Placeholder>
          ) : undefined}
        </TextField>
      </HStack>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
