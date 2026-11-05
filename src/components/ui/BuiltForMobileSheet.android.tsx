import {
  Button,
  Column,
  Host,
  ModalBottomSheet,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, padding } from "@expo/ui/jetpack-compose/modifiers";
import { Linking } from "react-native";

import type { BuiltForMobileSheetProps } from "./BuiltForMobileSheet";

export default function BuiltForMobileSheet({
  isPresented,
  onDismiss,
}: BuiltForMobileSheetProps) {
  if (!isPresented) return null;

  return (
    <Host matchContents>
      <ModalBottomSheet
        onDismissRequest={onDismiss}
        containerColor="#24262c"
        contentColor="#ffffff"
        scrimColor="#00000099"
      >
        <Column
          modifiers={[fillMaxWidth(), padding(24, 24, 24, 24)]}
          horizontalAlignment="center"
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            About the developer
          </Text>
          <Text modifiers={[padding(0, 0, 0, 8)]}>
            ION is crafted with a focus on simple, private mobile browsing.
          </Text>
          <Text modifiers={[padding(0, 0, 0, 16)]}>
            Follow the project and see more work on GitHub.
          </Text>
          <Button
            onClick={() =>
              void Linking.openURL("https://github.com/adityasriv2317")
            }
            modifiers={[fillMaxWidth(), padding(0, 0, 0, 12)]}
          >
            <Text>GitHub</Text>
          </Button>
          <Button onClick={onDismiss} modifiers={[fillMaxWidth()]}>
            <Text>Done</Text>
          </Button>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
