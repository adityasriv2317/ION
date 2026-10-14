import { useEffect, useState } from "react";
import { TextInput, View, Pressable, Text } from "react-native";

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
        backgroundColor: "#202033",
        // marginHorizontal: 8,
        marginVertical: 8,
        maxWidth: "90%",
        marginHorizontal: "auto",
      }}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => onSubmit(text)}
        onFocus={onFocus}
        placeholder="Search here"
        placeholderTextColor="#db91fd"
        autoCorrect={false}
        keyboardType="url"
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
      <Pressable onPress={() => onSubmit(text)} accessibilityRole="button">
        <Text style={{ color: "#BEB124", fontWeight: "700", padding: 8 }}>
          GO
        </Text>
      </Pressable>
    </View>
  );
}
