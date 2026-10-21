import Button from "@/components/ui/button";
import * as Jetpack from "@expo/ui/jetpack-compose/modifiers";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";
import { Icon } from "@expo/ui";

import { Host } from "@expo/ui";

type Props = {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onTabs: () => void;
  tabCount: number;
};

const prevIcon = Icon.select({
  ios: "chevron.left",
  android: import("@expo/material-symbols/arrow_back.xml"),
});
const forwIcon = Icon.select({
  ios: "chevron.right",
  android: import("@expo/material-symbols/arrow_forward.xml"),
});

export default function BrowserToolbar(props: Props) {
  const actions = [
    [1, null, props.onBack, true, prevIcon],
    [2, null, props.onForward, props.canGoForward, forwIcon],
    [3, `${props.tabCount} Tabs`, props.onTabs, true],
  ] as const;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        alignItems: "center",
        paddingTop: 10,
        width: "100%",
        marginHorizontal: "auto",
        marginTop: -16,
      }}
    >
      {actions.map(([id, label, action, enabled, icon]) => (
        <Button
          key={id}
          onPressButton={action}
          disabled={!enabled}
          label={label !== null ? label : undefined}
          textColor="#ffffff"
          backgroundColor="#7153e0f0"
          systemImage={label === null ? icon : undefined}
          uiModifiers={{
            ios: [
              SwiftUI.glassEffect({
                glass: {
                  variant: "regular",
                  interactive: true,
                  tint: "#ffffff43",
                },
                shape: "capsule",
              }),
              SwiftUI.padding({ horizontal: 3 }),
            ],
            android: [Jetpack.clip(Jetpack.Shapes.Circle)],
          }}
        />
      ))}
    </View>
  );
}
