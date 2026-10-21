import type { ComponentProps } from "react";
import {
  Host,
  Button as NativeButton,
  Text as Txt,
} from "@expo/ui/jetpack-compose";
import { Icon } from "@expo/ui";
import {
  wrapContentHeight,
  wrapContentWidth,
  type ModifierConfig as AndroidModifierConfig,
} from "@expo/ui/jetpack-compose/modifiers";
import type { ModifierConfig as IOSModifierConfig } from "@expo/ui/swift-ui/modifiers";
import type { IconName } from "@expo/ui";
import { View } from "react-native";

type ButtonShape = ComponentProps<typeof NativeButton>["shape"];

export type AdaptiveButtonProps = {
  label?: string;
  systemImage?: IconName;
  onPressButton: () => void;
  disabled?: boolean;
  uiModifiers?: {
    ios?: IOSModifierConfig[];
    android?: AndroidModifierConfig[];
  };
  buttonShape?: ButtonShape;
  textColor?: string;
  backgroundColor?: string;
};

export default function AdaptiveButton({
  label,
  systemImage,
  onPressButton,
  disabled = false,
  uiModifiers,
  backgroundColor,
  textColor,
}: AdaptiveButtonProps) {
  return (
    <View style={{ marginVertical: "auto" }}>
      <Host matchContents>
        <NativeButton
          enabled={!disabled}
          onClick={onPressButton}
          colors={{
            containerColor: backgroundColor,
            contentColor: textColor,
            disabledContainerColor: "#2c0e3fcd",
            disabledContentColor: "#d5c6ff",
          }}
          modifiers={[
            ...(uiModifiers?.android ?? []),
            // wrapContentWidth("centerHorizontally"),
            // wrapContentHeight("centerVertically"),
          ]}
        >
          {systemImage && (
            <Icon name={systemImage} size={18} color={textColor} />
          )}
          {label && <Txt modifiers={[]}>{label}</Txt>}
        </NativeButton>
      </Host>
    </View>
  );
}
