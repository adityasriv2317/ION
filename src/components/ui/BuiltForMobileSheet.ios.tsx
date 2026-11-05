import { BottomSheet, Button, Host, Text, VStack } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  font,
  frame,
  multilineTextAlignment,
  padding,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { Linking } from "react-native";

import type { BuiltForMobileSheetProps } from "./BuiltForMobileSheet";

export default function BuiltForMobileSheet({
  isPresented,
  onDismiss,
}: BuiltForMobileSheetProps) {
  if (!isPresented) return null;

  return (
    <Host matchContents>
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={(presented) => {
          if (!presented) onDismiss();
        }}
        fitToContents
      >
        <VStack
          alignment="center"
          spacing={12}
          modifiers={[
            presentationDragIndicator("visible"),
            frame({ maxWidth: Infinity }),
            padding({ top: 24, leading: 24, trailing: 24, bottom: 24 }),
          ]}
        >
          <Text
            modifiers={[
              font({ textStyle: "title2", weight: "bold", design: "rounded" }),
              frame({ maxWidth: Infinity }),
            ]}
          >
            About the developer
          </Text>
          <Text
            modifiers={[
              font({ design: "rounded" }),
              frame({ maxWidth: Infinity }),
              multilineTextAlignment("center"),
            ]}
          >
            Follow the project and see more work on GitHub.
          </Text>
          <Button
            label="GitHub"
            onPress={() =>
              void Linking.openURL("https://github.com/adityasriv2317")
            }
            modifiers={[frame({ maxWidth: Infinity })]}
          />
          <Button
            label="Done"
            onPress={onDismiss}
            modifiers={[
              buttonStyle("borderedProminent"),
              frame({ maxWidth: Infinity }),
            ]}
          />
        </VStack>
      </BottomSheet>
    </Host>
  );
}
