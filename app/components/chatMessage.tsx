import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function ChatMessage({text}: {text: string}) {
  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="default" style={styles.message}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  message: {
    width: "80%",
    textAlign: "left",
    marginRight: "20%",
  },
});
