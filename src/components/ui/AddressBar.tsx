import { Host, Row, TextField, useNativeState } from "@expo/ui/jetpack-compose";

import {
  background,
  clip,
  padding,
  Shapes,
} from "@expo/ui/jetpack-compose/modifiers";

import Button from "@/components/ui/button";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export interface AddressBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function AddressBar({
  value,
  onChangeText,
  onSubmitEditing,
  disabled = false,
}: AddressBarProps) {
  const text = useNativeState(value);

  useEffect(() => {
    if (text.value !== value) text.value = value;
  }, [value, text]);

  const clear = () => {
    text.value = "";
    onChangeText("");
  };

  const submit = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) onSubmitEditing(trimmed);
  };

  return (
    <View style={styles.wrapper}>
      <Host
        matchContents={{ vertical: true }}
        ignoreSafeAreaKeyboardInsets
        style={styles.host}
      >
        <Row
          verticalAlignment="center"
          modifiers={[
            clip(Shapes.RoundedCorner(28)),
            background("#24262C"),
            padding(14, 14, 14, 14),
          ]}
        >
          <TextField
            value={text}
            enabled={!disabled}
            singleLine
            onValueChange={onChangeText}
            keyboardOptions={{
              keyboardType: "uri",
              capitalization: "none",
              autoCorrectEnabled: false,
              imeAction: "go",
            }}
            keyboardActions={{
              onGo: submit,
              onSearch: submit,
            }}
          />

          {value.length > 0 && (
            <Button label="×" onPress={clear} disabled={disabled} />
          )}
        </Row>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  host: {
    width: "100%",
  },
});
