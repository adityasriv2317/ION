import {
  Host,
  OutlinedTextField,
  Text,
  useNativeState,
} from "@expo/ui/jetpack-compose";

import {
  padding,
  type ModifierConfig as AndroidModifierConfig,
} from "@expo/ui/jetpack-compose/modifiers";

import type { ModifierConfig as IOSModifierConfig } from "@expo/ui/swift-ui/modifiers";

import { useEffect } from "react";

export type TextInputProps = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  onSubmitEditing?: (event: { nativeEvent: { text: string } }) => void;
  onFocus?: (focused: boolean) => void;

  placeholder?: string;
  placeholderTextColor?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoCorrect?: boolean;
  keyboardType?: string;
  returnKeyType?: string;
  selectTextOnFocus?: boolean;
  accessibilityLabel?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";

  uiModifiers?: {
    ios?: IOSModifierConfig[];
    android?: AndroidModifierConfig[];
  };
};

export default function TextInput({
  value,
  defaultValue = "",
  onChangeText,
  onSubmitEditing,
  onFocus,
  placeholder,
  placeholderTextColor,
  disabled = false,
  autoFocus = false,
  autoCorrect = true,
  keyboardType = "default",
  returnKeyType = "default",
  selectTextOnFocus = false,
  accessibilityLabel,
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

  const handleSubmit = (submittedText: string) => {
    onSubmitEditing?.({
      nativeEvent: { text: submittedText },
    });
  };

  const handleFocus = (focused: boolean) => {
    if (focused && selectTextOnFocus) {
      selection.value = {
        start: 0,
        end: text.value.length,
      };
    }

    onFocus?.(focused);
  };

  const imeAction =
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
              : "default";

  const nativeKeyboardType =
    keyboardType === "web-search"
      ? "uri"
      : keyboardType === "url"
        ? "uri"
        : keyboardType === "email-address"
          ? "email"
          : keyboardType === "numeric"
            ? "number"
            : keyboardType === "phone-pad"
              ? "phone"
              : keyboardType === "decimal-pad"
                ? "decimal"
                : keyboardType === "visible-password"
                  ? "password"
                  : keyboardType === "ascii-capable"
                    ? "ascii"
                    : "text";

  return (
    <Host matchContents>
      <OutlinedTextField
        value={text}
        selection={selection}
        enabled={!disabled}
        autoFocus={autoFocus}
        singleLine
        onValueChange={onChangeText}
        onFocusChanged={handleFocus}
        keyboardOptions={{
          keyboardType: nativeKeyboardType,
          imeAction,
          autoCorrectEnabled: autoCorrect,
          capitalization:
            autoCapitalize === "characters"
              ? "characters"
              : autoCapitalize === "words"
                ? "words"
                : autoCapitalize === "sentences"
                  ? "sentences"
                  : "none",
        }}
        keyboardActions={{
          onGo: handleSubmit,
          onSearch: handleSubmit,
          onSend: handleSubmit,
          onNext: handleSubmit,
          onDone: handleSubmit,
        }}
        modifiers={[...(uiModifiers?.android ?? [])]}
      >
        {placeholder ? (
          <OutlinedTextField.Placeholder>
            <Text color={placeholderTextColor ?? "#888888"}>{placeholder}</Text>
          </OutlinedTextField.Placeholder>
        ) : null}
      </OutlinedTextField>
    </Host>
  );
}
