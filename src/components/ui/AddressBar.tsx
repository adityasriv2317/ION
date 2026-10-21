import { Icon } from "@expo/ui";
import {
  Host,
  TextField,
  Row,
  Text,
  TextButton,
  useNativeState,
  type TextFieldRef,
} from "@expo/ui/jetpack-compose";
import {
  background,
  blur,
  clip,
  fillMaxWidth,
  padding,
  Shapes,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

import clearIcon from "@expo/material-symbols/close.xml";

export interface AddressBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function AddressBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = "Search or enter address",
  disabled = false,
  onFocus,
  onBlur,
}: AddressBarProps) {
  const inputRef = useRef<TextFieldRef>(null);
  const text = useNativeState(value);

  useEffect(() => {
    if (text.value !== value) text.value = value;
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
        ignoreSafeAreaKeyboardInsets
        style={styles.host}
      >
        <Row
          verticalAlignment="center"
          modifiers={[
            fillMaxWidth(),
            clip(Shapes.RoundedCorner(36)),
            background("#24262cdd"),
            padding(2, 2, 2, 2),
            // blur(2),
          ]}
        >
          <TextField
            ref={inputRef}
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
            colors={{
              focusedIndicatorColor: "transparent",
              unfocusedIndicatorColor: "transparent",
              disabledIndicatorColor: "transparent",
            }}
            keyboardActions={{
              onGo: submit,
              onSearch: submit,
            }}
            onFocusChanged={(focused) => {
              if (focused) {
                onFocus?.();
              } else {
                onBlur?.();
              }
            }}
            modifiers={[weight(1), clip(Shapes.RoundedCorner(32))]}
          >
            <TextField.Placeholder>
              <Text>{placeholder}</Text>
            </TextField.Placeholder>
          </TextField>

          {value.length > 0 && !disabled && (
            <TextButton onClick={clear}>
              <Icon name={clearIcon} size={18} color="#ffffff" />
            </TextButton>
          )}
        </Row>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "80%",
    alignSelf: "flex-start",
    marginVertical: "auto",
  },
  host: {
    width: "100%",
  },
});
