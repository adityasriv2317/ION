import { Button as NativeButton, Host, Text } from "@expo/ui/swift-ui";
import {
  disabled as disabledModifier,
  foregroundStyle,
  padding,
  type ModifierConfig as IOSModifierConfig,
  buttonStyle,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import type { ModifierConfig as AndroidModifierConfig } from "@expo/ui/jetpack-compose/modifiers";

export type AdaptiveButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  uiModifiers?: {
    ios?: IOSModifierConfig[];
    android?: AndroidModifierConfig[];
  };
};

export default function AdaptiveButton({
  label,
  onPress,
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
        onPress={onPress}
        modifiers={[...modifiers, buttonStyle("plain")]}
      >
        {label ? (
          <Text modifiers={[foregroundStyle("#ffffff"), padding({ all: 6 })]}>
            {label}
          </Text>
        ) : undefined}
      </NativeButton>
    </Host>
  );
}
