import { Switch as NativeSwitch } from "react-native";
import type { ModifierConfig as AndroidModifierConfig } from "@expo/ui/jetpack-compose/modifiers";
import type { ModifierConfig as IOSModifierConfig } from "@expo/ui/swift-ui/modifiers";

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  uiModifiers?: {
    ios?: IOSModifierConfig[];
    android?: AndroidModifierConfig[];
  };
};

export default function Toggle({
  value,
  onValueChange,
  disabled = false,
}: ToggleProps) {
  return (
    <NativeSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    />
  );
}
