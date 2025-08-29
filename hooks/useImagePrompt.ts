import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

export type SelectedImage = {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  base64?: string;
};

export type UseImagePromptOptions = {
  includeBase64?: boolean;
  quality?: number; // 0..1
  maxWidth?: number;
  maxHeight?: number;
};

export type UseImagePromptReturn = {
  pickImage: (options?: UseImagePromptOptions) => Promise<SelectedImage | null>;
  takePhoto: (options?: UseImagePromptOptions) => Promise<SelectedImage | null>;
  isPicking: boolean;
  lastImage: SelectedImage | null;
  error: string | null;
  reset: () => void;
};

function toSelectedImage(asset: ImagePicker.ImagePickerAsset): SelectedImage | null {
  if (!asset?.uri) return null;
  return {
    uri: asset.uri,
    fileName: (asset as any).fileName ?? undefined,
    type: asset.type ?? undefined,
    fileSize: (asset as any).fileSize ?? undefined,
    width: asset.width ?? undefined,
    height: asset.height ?? undefined,
    base64: asset.base64 ?? undefined,
  };
}

export function useImagePrompt(): UseImagePromptReturn {
  const [isPicking, setIsPicking] = useState(false);
  const [lastImage, setLastImage] = useState<SelectedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = useCallback(async (opts?: UseImagePromptOptions) => {
    console.log("🔍 HOOK: pickImage called with options:", opts);
    try {
      setError(null);
      setIsPicking(true);
      console.log("🔍 HOOK: State set, requesting permissions...");
      
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("🔍 HOOK: Permission result:", perm);
      if (!perm.granted) {
        console.log("🔍 HOOK: Permission denied");
        setError("Permiso de fotos denegado");
        return null;
      }

      console.log("🔍 HOOK: Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: opts?.quality ?? 0.9,
        base64: opts?.includeBase64 ?? false,
        allowsMultipleSelection: false,
        selectionLimit: 1,
        exif: false,
      });
      
      console.log("🔍 HOOK: Result from image picker:", result);
      if (result.canceled) {
        console.log("🔍 HOOK: User cancelled");
        return null;
      }
      const asset = result.assets?.[0];
      const selected = asset ? toSelectedImage(asset) : null;
      console.log("🔍 HOOK: Final selected image:", selected);
      setLastImage(selected);
      return selected;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      console.error("🔍 HOOK: Error in pickImage:", message);
      setError(message);
      return null;
    } finally {
      setIsPicking(false);
    }
  }, []);

  const takePhoto = useCallback(async (opts?: UseImagePromptOptions) => {
    console.log("🔍 HOOK: takePhoto called with options:", opts);
    try {
      setError(null);
      setIsPicking(true);

      const perm = await ImagePicker.requestCameraPermissionsAsync();
      console.log("🔍 HOOK: Camera permission result:", perm);
      if (!perm.granted) {
        console.log("🔍 HOOK: Camera permission denied");
        setError("Permiso de cámara denegado");
        return null;
      }

      console.log("🔍 HOOK: Launching camera...");
      const result = await ImagePicker.launchCameraAsync({
        quality: opts?.quality ?? 0.9,
        base64: opts?.includeBase64 ?? false,
        exif: false,
      });

      console.log("🔍 HOOK: Camera result:", result);
      if (result.canceled) {
        console.log("🔍 HOOK: User cancelled camera");
        return null;
      }
      const asset = result.assets?.[0];
      const captured = asset ? toSelectedImage(asset) : null;
      console.log("🔍 HOOK: Final captured image:", captured);
      setLastImage(captured);
      return captured;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      console.error("🔍 HOOK: Error in takePhoto:", message);
      setError(message);
      return null;
    } finally {
      setIsPicking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLastImage(null);
    setError(null);
  }, []);

  return { pickImage, takePhoto, isPicking, lastImage, error, reset };
}

export function buildMultipartFormData(
  image: SelectedImage,
  fieldName = "file",
  extraFields?: Record<string, string | number | boolean>
): FormData {
  const form = new FormData();
  const nameFromUri = image.uri.split("/").pop() || "image.jpg";
  const name = image.fileName || nameFromUri;
  const type = image.type || "image/jpeg";
  form.append(fieldName, ({ uri: image.uri, name, type } as unknown) as any);
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => form.append(k, String(v)));
  }
  return form;
}