import {
  BottomSheet,
  Button,
  Host,
  Image,
  RNHostView,
  Text,
  VStack,
  Group,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  multilineTextAlignment,
  padding,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { Image as RNImage, Share, View } from "react-native";

import type { WebsiteDetailsSheetProps } from "../../types/WebsiteDetailsSheet.types";

const FAVICON_SIZE = 96;

export function WebsiteDetailsSheet({
  isPresented,
  onDismiss,
  favicon,
  title,
  url,
}: WebsiteDetailsSheetProps) {
  const shareUrl = () => {
    void Share.share({ message: url, url });
  };

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
        <Group modifiers={[presentationDragIndicator("visible")]}>
          <VStack
            alignment="center"
            spacing={48}
            modifiers={[
              frame({ maxWidth: Infinity }),
              padding({ top: 24, leading: 24, trailing: 24 }),
            ]}
          >
            {favicon ? (
              <RNHostView>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    height: FAVICON_SIZE,
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: "black",
                  }}
                >
                  <RNImage
                    source={{ uri: favicon }}
                    accessibilityLabel="Website favicon"
                    style={{
                      width: FAVICON_SIZE,
                      height: FAVICON_SIZE,
                      borderRadius: 12,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </RNHostView>
            ) : (
              <Image systemName="globe" size={48} color="secondary" />
            )}

            <VStack
              alignment="center"
              spacing={12}
              modifiers={[frame({ maxWidth: Infinity })]}
            >
              <Text
                modifiers={[
                  font({ textStyle: "title2", weight: "bold" }),
                  multilineTextAlignment("center"),
                  lineLimit(2),
                  frame({ maxWidth: Infinity }),
                ]}
              >
                {title || "Untitled website"}
              </Text>

              <Text
                modifiers={[
                  font({ textStyle: "subheadline" }),
                  foregroundStyle("secondary"),
                  multilineTextAlignment("center"),
                  lineLimit(3),
                  frame({ maxWidth: Infinity }),
                ]}
              >
                {url}
              </Text>
            </VStack>

            <Button
              label="Share"
              systemImage="square.and.arrow.up"
              onPress={shareUrl}
              modifiers={[
                buttonStyle("borderedProminent"),
                frame({ maxWidth: Infinity }),
              ]}
            />
          </VStack>
        </Group>
      </BottomSheet>
    </Host>
  );
}
