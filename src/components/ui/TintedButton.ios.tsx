import { Host, Button, Text } from "@expo/ui/swift-ui";
import {
  background,
  padding,
  foregroundColor,
  clipShape,
  tint,
  buttonStyle,
} from "@expo/ui/swift-ui/modifiers";

export default function CustomBackgroundButton() {
  return (
    <Host style={{ flex: 1, marginRight: 72 }} matchContents>
      <Button
        onPress={() => alert("Pressed!")}
        modifiers={[buttonStyle("glassProminent")]}
      >
        <Text
          modifiers={[
            // foregroundColor("#FFFFFF"),
            // padding(12),
            background("#007AFF"),
            tint("red"),
          ]}
        >
          Custom Button
        </Text>
      </Button>
    </Host>
  );
}
