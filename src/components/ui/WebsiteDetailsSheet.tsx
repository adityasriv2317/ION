import {
  Image,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { WebsiteDetailsSheetProps } from "../../types/WebsiteDetailsSheet.types";

export function WebsiteDetailsSheet({
  isPresented,
  onDismiss,
  favicon,
  title,
  url,
}: WebsiteDetailsSheetProps) {
  return (
    <Modal visible={isPresented} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View style={styles.sheet}>
          {favicon ? <Image source={{ uri: favicon }} style={styles.favicon} /> : null}
          <Text style={styles.title}>{title || "Untitled website"}</Text>
          <Text style={styles.url}>{url}</Text>
          <Pressable onPress={() => void Share.share({ message: url })} style={styles.button}>
            <Text style={styles.buttonText}>Share</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "#00000099" },
  sheet: { gap: 12, padding: 24, backgroundColor: "#24262c", borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  favicon: { width: 56, height: 56, borderRadius: 12 },
  title: { color: "#ffffff", fontSize: 22, fontWeight: "700" },
  url: { color: "#c7c7cc", fontSize: 14 },
  button: { alignItems: "center", padding: 14, borderRadius: 12, backgroundColor: "#7153e0" },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
