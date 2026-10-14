import { labelStyle } from "@expo/ui/swift-ui/modifiers";
import { act } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onTabs: () => void;
  tabCount: number;
};

export default function BrowserToolbar(props: Props) {
  const actions = [
    ["Back", props.onBack, props],
    ["Forward", props.onForward, props.canGoForward],
    ["Reload", props.onReload, true],
    [`${props.tabCount}`, props.onTabs, true],
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 10,
        // backgroundColor: "#131223",
        maxWidth: "90%",
        marginHorizontal: "auto",
      }}
    >
      {actions.map(([label, action, enabled]) => (
        <Pressable
          key={label}
          onPress={action}
          disabled={!enabled}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={{
            backgroundColor: "#202033",
            paddingVertical: 12,
            paddingHorizontal: 12,
            alignItems: "center",
            minWidth: 40,
            borderRadius: 32,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12 }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
