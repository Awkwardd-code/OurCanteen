import { Alert } from 'react-native';

const CLOUDINARY_UPLOAD_PRESET = "expo_upload";
const CLOUDINARY_CLOUD_NAME = "dsswmv4u9";

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message: string };
}

export const uploadImageToCloudinary = async (uri: string, setUploading: (uploading: boolean) => void): Promise<string | null> => {
  setUploading(true);

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as unknown as Blob); // Type coercion workaround for React Native FormData

  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data: CloudinaryUploadResponse = await response.json();

    if (data.secure_url) {
      console.log('Uploaded image URL:', data.secure_url);
      return data.secure_url;
    } else {
      throw new Error('Upload failed, no secure_url returned');
    }
  } catch (error: any) {
    Alert.alert('Upload Error', error.message);
    return null;
  } finally {
    setUploading(false);
  }
};