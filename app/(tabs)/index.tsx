import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";

import { useImagePrompt } from "@/hooks/useImagePrompt";
import ChatInput from "../components/chatInput";
import ChatMessage from "../components/chatMessage";
import UserMessage from "../components/userMessage";
import { ChatMessageModel } from "../models/chat-models";


export default function HomeScreen() {
  const { pickImage, takePhoto } = useImagePrompt();
  const [messages, setMessages] = useState<ChatMessageModel[]>([
    {
      text: "Hola, soy tu asistente contable, en que puedo ayudarte?",
      isUser: false,
    },
  ]);
  const bottom = useBottomTabOverflow();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(
          Platform.OS === "android" ? e.endCoordinates.height : 0
        );
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onSend = (text: string) => {
    setMessages((prev) => [...prev, { text, isUser: true }]);
  };

  const onSelectImage = async () => {
    console.log("🔍 BUTTON CLICKED - onSelectImage started");
    try {
      console.log("🔍 About to call pickImage...");
      const img = await pickImage({ quality: 0.8 });
      console.log("🔍 pickImage completed. Result:", img);
      if (!img) {
        console.log("🔍 No image selected or cancelled");
        return;
      }
    
    // Agregar mensaje de usuario con la imagen
    setMessages((prev) => [...prev, { 
      text: "📷 Procesando imagen... ", 
      isUser: true 
    }]);
    

    } catch (error) {
      console.error("🔍 ERROR in onSelectImage:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        {messages.map((message, index) =>
          message.isUser ? (
            <UserMessage key={index} text={message.text} />
          ) : (
            <ChatMessage key={index} text={message.text} />
          )
        )}

        {/* Spacer to prevent last message from being hidden behind the input */}
        <View
          style={{
            height:
              80 + bottom + (Platform.OS === "android" ? keyboardHeight : 0),
          }}
        />
      </ParallaxScrollView>

      <ChatInput
        onSend={onSend}
        onPressImage={onSelectImage}
        onPressMic={() => {
          /* grabación futura */
        }}
      />
    </View>
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
  inputWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323232d9",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendLabel: {
    color: "#fff",
    fontWeight: "600",
  },
});
