import { Button as NativeButton, Host } from "@expo/ui/jetpack-compose";
import type { ModifierConfig as AndroidModifierConfig } from "@expo/ui/jetpack-compose/modifiers";
import type { ModifierConfig as IOSModifierConfig } from "@expo/ui/swift-ui/modifiers";

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
  return (
    <Host matchContents>
      <NativeButton
        enabled={!disabled}
        onClick={onPress}
        modifiers={uiModifiers?.android ?? []}
      >
        {label}
      </NativeButton>
    </Host>
  );
}
