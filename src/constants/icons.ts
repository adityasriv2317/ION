import { Icon } from "@expo/ui";
import closeIcon from "@expo/material-symbols/close.xml";
import {
  Archive03Icon,
  ArrowLeftIcon,
  ArrowRight01Icon,
  ArrowRightIcon,
  Bookmark01Icon,
  CancelCircleIcon,
  CreditCardIcon,
  Delete03Icon,
  Download04Icon,
  Globe02Icon,
  IncognitoIcon,
  PlusSignIcon,
  RefreshIcon,
  Rocket01Icon,
  SearchAreaIcon,
  Settings02Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

export const SystemIcons = {
  add: Icon.select({
    ios: "plus",
    android: import("@expo/material-symbols/add.xml"),
  }),
  arrowBack: Icon.select({
    ios: "chevron.left",
    android: import("@expo/material-symbols/arrow_back.xml"),
  }),
  arrowForward: Icon.select({
    ios: "chevron.right",
    android: import("@expo/material-symbols/arrow_forward.xml"),
  }),
  arrowUp: Icon.select({
    ios: "arrow.up",
    android: import("@expo/material-symbols/arrow_upward.xml"),
  }),
  bookmark: Icon.select({
    ios: "bookmark",
    android: import("@expo/material-symbols/bookmark.xml"),
  }),
  close: closeIcon,
  delete: Icon.select({
    ios: "trash",
    android: import("@expo/material-symbols/delete.xml"),
  }),
  done: Icon.select({
    ios: "checkmark",
    android: import("@expo/material-symbols/check.xml"),
  }),
  edit: Icon.select({
    ios: "pencil",
    android: import("@expo/material-symbols/edit.xml"),
  }),
  history: Icon.select({
    ios: "clock.arrow.circlepath",
    android: import("@expo/material-symbols/history.xml"),
  }),
  incognito: Icon.select({
    ios: "eye",
    android: import("@expo/material-symbols/eyeglasses.xml"),
  }),
  incognitoOff: Icon.select({
    ios: "eye.slash",
    android: import("@expo/material-symbols/owl.xml"),
  }),
  loading: Icon.select({
    ios: "progress.indicator",
    android: import("@expo/material-symbols/progress_activity.xml"),
  }),
  reload: Icon.select({
    ios: "arrow.clockwise",
    android: import("@expo/material-symbols/refresh.xml"),
  }),
  search: Icon.select({
    ios: "magnifyingglass",
    android: import("@expo/material-symbols/search.xml"),
  }),
  shield: Icon.select({
    ios: "eye.slash",
    android: import("@expo/material-symbols/eyeglasses.xml"),
  }),
  stack: Icon.select({
    ios: "square.on.square",
    android: import("@expo/material-symbols/stack.xml"),
  }),
} as const;

export const HugeIcons = {
  archive: Archive03Icon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  arrowRight01: ArrowRight01Icon,
  bookmark: Bookmark01Icon,
  cancelCircle: CancelCircleIcon,
  creditCard: CreditCardIcon,
  delete: Delete03Icon,
  download: Download04Icon,
  globe: Globe02Icon,
  incognito: IncognitoIcon,
  plus: PlusSignIcon,
  refresh: RefreshIcon,
  rocket: Rocket01Icon,
  searchArea: SearchAreaIcon,
  settings: Settings02Icon,
  zap: ZapIcon,
} as const;
