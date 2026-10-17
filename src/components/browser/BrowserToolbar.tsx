import Button from "@/components/ui/button";
import { View } from "react-native";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

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
    ["Back", props.onBack, true],
    ["Forward", props.onForward, props.canGoForward],
    ["Reload", props.onReload, true],
    [`${props.tabCount} Tabs`, props.onTabs, true],
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 10,
        maxWidth: "90%",
        marginHorizontal: "auto",
      }}
    >
      {actions.map(([label, action, enabled]) => (
        <Button
          key={label}
          onPress={action}
          disabled={!enabled}
          label={label}
          uiModifiers={{
            ios: [
              SwiftUI.glassEffect({
                glass: {
                  variant: "regular",
                  interactive: true,
                  tint: "#ffffff43",
                },
                // shape: "roundedRectangle",
                // cornerRadius: 6
              }),
              SwiftUI.padding({ horizontal: 6 }),
            ],
          }}
          // style={{
          //   backgroundColor: "#323268",
          //   paddingVertical: 12,
          //   paddingHorizontal: 12,
          //   alignItems: "center",
          //   minWidth: 40,
          //   borderRadius: 32,
          //   marginHorizontal: 4,
          //   opacity: enabled ? 1 : 0.5,
          // }}
        />
      ))}
    </View>
  );
}
