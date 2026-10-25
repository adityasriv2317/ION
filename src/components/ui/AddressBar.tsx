import { Icon } from "@expo/ui";
import {
  Host,
  Row,
  Text,
  TextField,
  useNativeState,
  IconButton,
  type TextFieldRef,
} from "@expo/ui/jetpack-compose";
import {
  background,
  clip,
  fillMaxWidth,
  padding,
  Shapes,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { useEffect, useRef } from "react";
import {
  Image as RNImage,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

import { SystemIcons } from "@/constants/icons";

export interface AddressBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  favicon?: string;
  onFaviconPress?: () => void;
}

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
      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={onFaviconPress}
          activeOpacity={0.7}
        >
          {favicon ? (
            <RNImage
              source={{ uri: favicon }}
              style={{ width: 20, height: 20, borderRadius: 4 }}
            />
          ) : (
            <Host style={{ width: 24, height: 24 }}>
              <Icon name={SystemIcons.incognitoOff} size={24} color="#918DAF" />
            </Host>
          )}
        </TouchableOpacity>

        <Host
          matchContents={{ vertical: true }}
          ignoreSafeAreaKeyboardInsets
          style={styles.host}
        >
          <Row
            verticalAlignment="center"
            modifiers={[
              fillMaxWidth(),
              clip(
                Shapes.RoundedCorner({
                  topEnd: 32,
                  bottomEnd: 32,
                  topStart: 10,
                  bottomStart: 10,
                }),
              ),
              background("#24262cdd"),
              padding(0, 2, 0, 2),
            ]}
          >
            <TextField
              ref={inputRef}
              value={text}
              enabled={!isDisabled}
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
              modifiers={[
                weight(1),
                clip(
                  Shapes.RoundedCorner({
                    topEnd: 24,
                    bottomEnd: 24,
                  }),
                ),
              ]}
            >
              <TextField.Placeholder>
                <Text>{placeholder}</Text>
              </TextField.Placeholder>
            </TextField>

            {value.length > 0 && !isDisabled && (
              <IconButton onClick={clear}>
                <Icon
                  name={SystemIcons.close}
                  size={18}
                  color="#ffffff"
                  modifiers={[padding(0, 0, 0, 0)]}
                />
              </IconButton>
            )}
          </Row>
        </Host>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "80%",
    alignSelf: "flex-start",
    marginVertical: "auto",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
  },
  leftButton: {
    backgroundColor: "#24262c",
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingLeft: 14,
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "#f9f8f800",
    borderRightWidth: 0.5,
  },
  host: {
    flex: 1,
  },
});
