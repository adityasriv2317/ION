import { labelStyle } from "@expo/ui/swift-ui/modifiers";
import { act } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onTabs: () => void;
  tabCount: number;
};

export default function BrowserToolbar(props: Props) {
  const actions = [
    ["Back", props.onBack, props],
    ["Forward", props.onForward, props.canGoForward],
    ["Reload", props.onReload, true],
    ["Home", props.onHome, true],
    [`Tabs ${props.tabCount}`, props.onTabs, true],
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: "#131223",
      }}
    >
      {actions.map(([label, action, enabled]) => (
        <Pressable
          key={label}
          onPress={action}
          disabled={!enabled}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 12 }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
