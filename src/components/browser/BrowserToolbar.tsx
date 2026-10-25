import Button from "@/components/ui/button";
import * as Jetpack from "@expo/ui/jetpack-compose/modifiers";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";
import { SystemIcons } from "@/constants/icons";
import { useBrowserSession } from "@/components/browser/BrowserSessionContext";

export default function BrowserToolbar() {
  const { activeTab, tabCount, goBack, goForward, openTabs, isHome } =
    useBrowserSession();
  const actions = [
    [1, null, goBack, activeTab.canGoBack || !isHome, SystemIcons.arrowBack],
    [2, null, goForward, activeTab.canGoForward, SystemIcons.arrowForward],
    [3, `${tabCount} Tabs`, openTabs, true],
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
          label={label !== null ? label : ""}
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
