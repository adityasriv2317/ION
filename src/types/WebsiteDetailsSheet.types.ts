export type WebsiteDetailsSheetProps = {
  isPresented: boolean;
  onDismiss: () => void;
  favicon?: string;
  title: string;
  url: string;
};
