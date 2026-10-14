import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useBrowserStore } from "@/stores/browserStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsScreen() {
  const router = useRouter();
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const setActiveTab = useBrowserStore((s) => s.setActiveTab);
  const addTab = useBrowserStore((s) => s.addTab);
  const closeTab = useBrowserStore((s) => s.closeTab);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#111121",
        paddingHorizontal: 20,
        paddingTop: 16,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 20,
        }}
      >
        Tabs
      </Text>

      <FlatList
        data={tabs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const isActive = item.id === activeTabId;

          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
                marginBottom: 10,
                borderRadius: 14,
                backgroundColor: isActive ? "#292747" : "#1B1B2D",
                borderWidth: 1,
                borderColor: isActive ? "#7657E8" : "#29293B",
              }}
            >
              <Pressable
                onPress={() => {
                  setActiveTab(item.id);
                  router.back();
                }}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: isActive ? "#FFFFFF" : "#B5B5C7",
                    fontSize: 15,
                    fontWeight: isActive ? "600" : "500",
                  }}
                >
                  {item.title || "New Tab"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => closeTab(item.id)}
                accessibilityRole="button"
                accessibilityLabel="Close tab"
                hitSlop={8}
                style={{
                  width: 32,
                  height: 32,
                  marginLeft: 12,
                  borderRadius: 10,
                  backgroundColor: "#34202E",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#F4A5B5",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  ×
                </Text>
              </Pressable>
            </View>
          );
        }}
      />

      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <Pressable
          onPress={() => {
            addTab();
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel="Add new tab"
          style={{
            width: 58,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#7657E8",
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "400",
              lineHeight: 32,
            }}
          >
            +
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
