import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Colors,
  type ColorScheme,
  type ThemeColors,
} from "@/styles/colors";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = "ion-theme-mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((storedMode) => {
        if (
          storedMode === "system" ||
          storedMode === "light" ||
          storedMode === "dark"
        ) {
          setModeState(storedMode);
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load theme preference.", error);
      });
  }, []);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    void AsyncStorage.setItem(STORAGE_KEY, nextMode).catch(
      (error: unknown) => {
        console.error("Failed to save theme preference.", error);
      },
    );
  }, []);

  const colorScheme =
    mode === "system" ? (systemScheme === "light" ? "light" : "dark") : mode;
  const value = useMemo(
    () => ({
      mode,
      colorScheme,
      colors: Colors[colorScheme],
      setMode,
    }),
    [colorScheme, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return theme;
}
