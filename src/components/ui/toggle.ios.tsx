import { Host, Toggle as NativeToggle } from "@expo/ui/swift-ui";
import { disabled } from "@expo/ui/swift-ui/modifiers";

import type { ToggleProps } from "./toggle";

export default function Toggle({
  value,
  onValueChange,
  disabled: isDisabled = false,
  uiModifiers,
}: ToggleProps) {
  return (
    <Host matchContents>
      <NativeToggle
        isOn={value}
        onIsOnChange={onValueChange}
        modifiers={[
          ...(uiModifiers?.ios ?? []),
          ...(isDisabled ? [disabled(true)] : []),
        ]}
      />
    </Host>
  );
}
