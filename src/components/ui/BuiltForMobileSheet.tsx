import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type BuiltForMobileSheetProps = {
  isPresented: boolean;
  onDismiss: () => void;
};

export default function BuiltForMobileSheet({
  isPresented,
  onDismiss,
}: BuiltForMobileSheetProps) {
  return (
    <Modal
      visible={isPresented}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View style={styles.sheet}>
          <Text style={styles.title}>About the developer</Text>
          <Text style={styles.detail}>
            Follow the project and see more work on GitHub.
          </Text>
          <Pressable
            onPress={() =>
              void Linking.openURL("https://github.com/adityasriv23317")
            }
            style={styles.link}
          >
            <Text style={styles.linkText}>GitHub</Text>
          </Pressable>
          <Pressable onPress={onDismiss} style={styles.button}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000099",
  },
  link: {
    paddingVertical: 4,
  },
  linkText: { color: "#b7a5ff", fontSize: 14, fontWeight: "600" },
  sheet: {
    gap: 12,
    padding: 24,
    backgroundColor: "#24262c",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: { color: "#ffffff", fontSize: 22, fontWeight: "700" },
  detail: { color: "#c7c7cc", fontSize: 14 },
  button: {
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#7153e0",
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
