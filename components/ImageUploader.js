import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { Colors, Sizes } from "../constants/styles";

const ImageUploader = ({ images, onChange }) => {
  const [localImages, setLocalImages] = useState(images || []);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 📸 Pick images from gallery
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets;
      const updated = [...localImages, ...newImages];
      setLocalImages(updated);
      if (onChange) onChange(updated);
    }
  };

  // 🗑️ Delete a selected image
  const deleteImage = (index) => {
    const updated = localImages.filter((_, i) => i !== index);
    setLocalImages(updated);
    if (onChange) onChange(updated);
  };

  // 🖼️ Tap on image → open fullscreen viewer
  const openViewer = (index) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.uploadPhotoContainer}
        onPress={pickImages}
        activeOpacity={0.8}
      >
        {localImages.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
          >
            {localImages.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <TouchableOpacity onPress={() => openViewer(index)}>
                  <Image source={{ uri: img.uri }} style={styles.selectedImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImage(index)}
                >
                  <Ionicons name="close-circle" size={22} color="#E51C4B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={40} color={Colors.grayColor} />
            <Text style={styles.addFileText}>Upload Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 🔍 Fullscreen Image Viewer */}
      <ImageViewing
        images={localImages.map((img) => ({ uri: img.uri }))}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  uploadPhotoContainer: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    borderStyle: "dashed",
    paddingVertical: Sizes.fixPadding * 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.lightGray,
    minHeight: 128,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
  },
  addFileText: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: Sizes.fixPadding / 2,
  },
});
