export type BrowserTab = {
  id: string;
  url: string;
  title: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  createdAt: number;
};

export type HistoryEntry = {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
};
