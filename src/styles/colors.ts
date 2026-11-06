export const Colors = {
  light: {
    text: "#1B1A24",
    background: "#F6F5FB",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#EDE8FF",
    textSecondary: "#6F6B7A",
    border: "#E2E0EC",
    iconBackground: "#EAE7F7",
    accent: "#7657E8",
    accentText: "#FFFFFF",
    muted: "#918DAF",
    dangerBackground: "#FCE8EE",
    danger: "#B4234D",
    buttonBg: "#e3e1e6",
  },
  dark: {
    text: "#FFFFFF",
    background: "#111121",
    backgroundElement: "#1B1B2D",
    backgroundSelected: "#292747",
    textSecondary: "#B5B5C7",
    border: "#29293B",
    iconBackground: "#292747",
    accent: "#7657E8",
    accentText: "#FFFFFF",
    muted: "#918DAF",
    dangerBackground: "#34202E",
    danger: "#F4A5B5",
    buttonBg: "#2b2746",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ColorScheme = keyof typeof Colors;
export type ThemeColors = (typeof Colors)[ColorScheme];
