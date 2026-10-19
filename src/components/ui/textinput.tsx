import {
  TextField,
  Host,
  TextFieldRef,
  useNativeState,
  OutlinedTextField,
  Text,
} from "@expo/ui/jetpack-compose";
import type { ModifierConfig as AndroidModifierConfig } from "@expo/ui/jetpack-compose/modifiers";
import {
  onSubmit,
  type ModifierConfig as IOSModifierConfig,
} from "@expo/ui/swift-ui/modifiers";
import { useCallback, useEffect, useRef } from "react";
import type { KeyboardType, ReturnKeyType } from "react-native";

export type TextInputProps = {
  placeholder: string;
  value: string;
  defaultValue: string;
  disabled: boolean;

  keyboardType: KeyboardType;
  returnKeyType: ReturnKeyType;

  onChangeText: (s: string) => void;
  onSubmitEditing?: (event: { nativeEvent: { text: string } }) => void;

  uiModifiers?: {
    ios?: IOSModifierConfig[];
    android?: AndroidModifierConfig[];
  };
};

export default function TextInput({
  placeholder,
  value,
  defaultValue = "",
  disabled = false,
  returnKeyType,
  onChangeText,
  onSubmitEditing,
  uiModifiers,
}: TextInputProps) {
  const textRef = useRef<TextFieldRef>(null);
  const text = useNativeState(value ?? defaultValue);
  const selection = useNativeState({ start: 0, end: 0 });

  useEffect(() => {
    if (value !== undefined && text.value !== value) {
      text.value = value;
    }
  }, [value, text]);

  const handValueChange = useCallback(
    (next: string) => {
      onChangeText?.(next);

      if (value !== undefined && next !== value) {
        text.value = value;
      }
    },
    [onChangeText, text, value],
  );

  const handleSubmit = useCallback(
    (v: string) => {
      onSubmitEditing?.({
        nativeEvent: { text: v },
      });
    },
    [onSubmitEditing],
  );

  return (
    <Host matchContents>
      <OutlinedTextField
        enabled={!disabled}
        ref={textRef}
        value={text}
        singleLine
        onValueChange={handValueChange}
        keyboardOptions={{
          keyboardType: "uri",
        }}
        keyboardActions={{
          onSearch: handleSubmit,
        }}
        modifiers={uiModifiers?.android ?? []}
      >
        {placeholder ? (
          <OutlinedTextField.Placeholder>
            <Text>{placeholder}</Text>
          </OutlinedTextField.Placeholder>
        ) : null}
      </OutlinedTextField>
    </Host>
  );
}
