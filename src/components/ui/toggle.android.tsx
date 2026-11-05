import {
  Host,
  Switch,
  Icon,
  useMaterialColors,
} from "@expo/ui/jetpack-compose";
import type { ToggleProps } from "./toggle";

const check = require("@expo/material-symbols/check.xml");
const cross = require("@expo/material-symbols/close.xml");

export default function Toggle({
  value,
  onValueChange,
  disabled = false,
  uiModifiers,
}: ToggleProps) {
  const m3 = useMaterialColors();

  return (
    <Host matchContents>
      <Switch
        value={value}
        enabled={!disabled}
        onCheckedChange={onValueChange}
        modifiers={uiModifiers?.android}
        colors={{
          checkedThumbColor: "#FFFFFF",
          checkedTrackColor: "#7657E8",
          checkedBorderColor: "#7657E8",
          checkedIconColor: "#7657E8",
          uncheckedThumbColor: m3.outline,
          uncheckedTrackColor: "#3C3968",
          uncheckedBorderColor: m3.outline,
          uncheckedIconColor: m3.surfaceContainerHighest,
        }}
      >
        <Switch.ThumbContent>
          <Icon source={value ? check : cross} size={Switch.DefaultIconSize} />
        </Switch.ThumbContent>
      </Switch>
    </Host>
  );
}
