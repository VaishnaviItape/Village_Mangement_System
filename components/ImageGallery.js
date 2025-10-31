import { Ionicons } from "@expo/vector-icons";
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

const ImageGallery = ({ images = [], onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🖼️ Open full-screen viewer
  const openViewer = (index) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  // 🗑️ Delete image
  const handleDelete = (index, image) => {
    if (onDelete) onDelete(index, image);
  };

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={40} color={Colors.grayColor} />
        <Text style={styles.emptyText}>No images uploaded yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => openViewer(index)}>
              <Image
                source={{ uri: img.fileUrl || img.uri || img.url || img }}
                style={styles.image}
              />
            </TouchableOpacity>
            {onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(index, img)}
              >
                <Ionicons name="close-circle" size={22} color="#E51C4B" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 🔍 Fullscreen Viewer */}
      <ImageViewing
        images={images.map((img) => ({ uri: img.fileUrl || img.uri || img.url || img }))}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
};

export default ImageGallery;

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2,
  },
  scrollContent: {
    paddingHorizontal: 5,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 8,
  },
  image: {
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding * 2,
  },
  emptyText: {
    marginTop: 8,
    color: Colors.grayColor,
    fontSize: 14,
  },
});
