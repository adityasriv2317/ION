import { Button as NativeButton, Host, Text } from "@expo/ui/swift-ui";
import { Icon } from "@expo/ui";
import {
  disabled as disabledModifier,
  foregroundStyle,
  padding,
  type ModifierConfig as IOSModifierConfig,
  buttonStyle,
} from "@expo/ui/swift-ui/modifiers";
import type { AdaptiveButtonProps } from "./button";

export default function AdaptiveButton({
  label,
  systemImage,
  onPressButton,
  disabled = false,
  uiModifiers,
}: AdaptiveButtonProps) {
  const modifiers: IOSModifierConfig[] = [
    ...(uiModifiers?.ios ?? []),
    ...(disabled ? [disabledModifier(true)] : []),
  ];

  return (
    <Host matchContents>
      <NativeButton
        onPress={onPressButton}
        modifiers={[...modifiers, buttonStyle("plain")]}
      >
        <>
          {systemImage && (
            <Icon
              name={systemImage}
              size={20}
              color="#ffffff"
              modifiers={[
                padding(
                  label === ""
                    ? { horizontal: 12, vertical: 10 }
                    : { leading: 10 },
                ),
              ]}
            />
          )}
          {label && (
            <Text modifiers={[foregroundStyle("#ffffff"), padding({ all: 8 })]}>
              {label}
            </Text>
          )}
        </>
      </NativeButton>
    </Host>
  );
}
