import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function UserMessage({text}: {text: string}) {
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
        justifyContent: "flex-end",
        width: "100%",
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
        maxWidth: "80%",
        textAlign: "right",
        backgroundColor: "#323232d9",
        borderRadius: 30,
        padding: 10,
        alignSelf: "flex-end",
    }
});
