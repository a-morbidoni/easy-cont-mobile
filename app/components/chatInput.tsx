import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onSend: (text: string) => void;
  onPressImage?: () => void;
  onPressMic?: () => void;
};

export default function ChatInput({ onSend, onPressImage, onPressMic }: Props) {
  const [inputText, setInputText] = useState("");
  const bottom = useBottomTabOverflow();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(Platform.OS === "android" ? e.endCoordinates.height : 0);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    onSend(text);
    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? bottom : 0}
      style={[
        styles.inputWrapper,
        Platform.OS === "android" ? { bottom: keyboardHeight } : null,
      ]}
    >
      <View style={[styles.rowContainer, { marginBottom: bottom }]}>
        <View style={styles.inputContainer}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              onPress={onPressImage}
              activeOpacity={0.8}
              style={styles.iconButton}
              accessibilityLabel="Enviar imagen"
            >
              <Ionicons name="image-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#999"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.8} accessibilityLabel="Enviar mensaje">
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onPressMic}
          activeOpacity={0.8}
          style={styles.micButton}
          accessibilityLabel="Grabar audio"
        >
          <Ionicons name="mic" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323232d9",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
  },
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
