import { Host, Text, TextField, useNativeState } from "@expo/ui/swift-ui";

import {
  autocorrectionDisabled,
  disabled as disabledModifier,
  foregroundStyle,
  keyboardType as keyboardTypeModifier,
  onSubmit,
  padding,
  submitLabel,
  textInputAutocapitalization,
  type ModifierConfig as IOSModifierConfig,
} from "@expo/ui/swift-ui/modifiers";

import { useEffect } from "react";

import type { TextInputProps } from "./textinput";

export default function TextInput({
  value,
  defaultValue = "",
  onChangeText,
  onSubmitEditing,
  onFocus,
  placeholder,
  placeholderTextColor = "#888888",
  disabled = false,
  autoFocus = false,
  autoCorrect = true,
  keyboardType = "default",
  returnKeyType = "default",
  selectTextOnFocus = false,
  autoCapitalize = "none",
  uiModifiers,
}: TextInputProps) {
  const text = useNativeState(value ?? defaultValue);
  const selection = useNativeState({ start: 0, end: 0 });

  useEffect(() => {
    if (value !== undefined && text.value !== value) {
      text.value = value;
    }
  }, [value, text]);

  const handleFocus = (focused: boolean) => {
    if (focused && selectTextOnFocus) {
      selection.value = {
        start: 0,
        end: text.value.length,
      };
    }

    onFocus?.(focused);
  };

  const nativeKeyboardType = (
    keyboardType === "numeric"
      ? "numeric"
      : keyboardType === "decimal-pad"
        ? "decimal-pad"
        : keyboardType === "phone-pad"
          ? "phone-pad"
          : keyboardType
  ) as Parameters<typeof keyboardTypeModifier>[0];

  const nativeSubmitLabel =
    returnKeyType === "go"
      ? "go"
      : returnKeyType === "search"
        ? "search"
        : returnKeyType === "send"
          ? "send"
          : returnKeyType === "next"
            ? "next"
            : returnKeyType === "done"
              ? "done"
              : "return";

  const modifiers: IOSModifierConfig[] = [
    foregroundStyle("#FFFFFF"),
    padding({ vertical: 12 }),
    keyboardTypeModifier(nativeKeyboardType),
    ...(!autoCorrect ? [autocorrectionDisabled()] : []),
    textInputAutocapitalization(
      autoCapitalize === "none" ? "never" : autoCapitalize,
    ),
    submitLabel(nativeSubmitLabel),
    onSubmit(() => {
      onSubmitEditing?.({
        nativeEvent: { text: text.value },
      });
    }),
    ...(disabled ? [disabledModifier(true)] : []),
    ...(uiModifiers?.ios ?? []),
  ];

  return (
    <Host matchContents>
      <TextField
        text={text}
        selection={selection}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onTextChange={onChangeText}
        onFocusChange={handleFocus}
        modifiers={modifiers}
      >
        {placeholder ? (
          <TextField.Placeholder>
            <Text modifiers={[foregroundStyle(placeholderTextColor)]}>
              {placeholder}
            </Text>
          </TextField.Placeholder>
        ) : undefined}
      </TextField>
    </Host>
  );
}
