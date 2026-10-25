import { Icon } from "@expo/ui";
import {
  Button,
  Column,
  Host,
  ModalBottomSheet,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, padding } from "@expo/ui/jetpack-compose/modifiers";
import { Image as RNImage, Share } from "react-native";

import { SystemIcons } from "@/constants/icons";

import type { WebsiteDetailsSheetProps } from "../../types/WebsiteDetailsSheet.types";

export function WebsiteDetailsSheet({
  isPresented,
  onDismiss,
  favicon,
  title,
  url,
}: WebsiteDetailsSheetProps) {
  const shareUrl = () => {
    void Share.share({ message: url });
  };

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
          {favicon ? (
            <RNImage
              source={{ uri: favicon }}
              accessibilityLabel="Website favicon"
              style={{ width: 56, height: 56, borderRadius: 12 }}
            />
          ) : (
            <Icon name={SystemIcons.incognitoOff} size={40} color="#c7c7cc" />
          )}
          <Text
            style={{ fontSize: 22, fontWeight: "bold", textAlign: "center" }}
            modifiers={[padding(0, 12, 0, 4)]}
          >
            {title || "Untitled website"}
          </Text>
          <Text style={{ fontSize: 14 }} modifiers={[padding(0, 0, 0, 16)]}>
            {url}
          </Text>
          <Button onClick={shareUrl} modifiers={[fillMaxWidth()]}>
            <Text>Share</Text>
          </Button>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
