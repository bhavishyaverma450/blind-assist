import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OCRScreen = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then(setVoices);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted" || mediaStatus.status !== 'granted') {
      Alert.alert("Permission required", "Camera access is needed to take pictures.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert("Error", "Could not retrieve image URI.");
        return;
      }

      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1600 } }, { rotate: 0 }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      uploadToOCR(manipResult.uri);
    }
  };

  const uploadToOCR = async (uri: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", { uri, type: "image/jpeg", name: "photo.jpg" } as any);
      formData.append("apikey", "K85911591688957");
      formData.append("language", "eng");
      formData.append("isOverlayRequired", "true");
      formData.append("OCREngine", "2"); 

      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!response.data.IsErroredOnProcessing) {
        const detectedText = response.data.ParsedResults[0]?.ParsedText.trim();
        if (detectedText) {
          setText(detectedText);
          speakText(detectedText);
        } else {
          setText("No text detected in the image.");
        }
      } else {
        setText("OCR Failed: " + response.data.ErrorMessage?.[0]);
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setText("Error during OCR");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (txt: string) => {
    Speech.stop();
    if (!voices.length) return;

    // Filter English voices
    const englishVoices = voices.filter(v => v.language.startsWith('en'));

    // Select male or female voice
    let voice = englishVoices.find(v => {
      if ('gender' in v) return v.gender?.toLowerCase() === selectedGender;
      if (selectedGender === 'female') return /female|samantha|victoria|joanna/i.test(v.name);
      else return /male|david|john|peter/i.test(v.name);
    }) || englishVoices[0]; // fallback

    const lines = txt.split("\n").filter(line => line.trim() !== "");
    let index = 0;

    const speakNextLine = () => {
      if (index < lines.length) {
        Speech.speak(lines[index], {
          voice: voice?.identifier,
          pitch: 1.0,
          rate: 1.0,
          onDone: () => {
            index++;
            speakNextLine();
          },
        });
      }
    };

    speakNextLine();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.advancedPickerWrapper}>
          <Text style={styles.advancedPickerLabel}>Select Voice</Text>
          <Picker
            selectedValue={selectedGender}
            style={styles.advancedPicker}
            dropdownIconColor="#4CAF50"
            onValueChange={(itemValue) => setSelectedGender(itemValue as 'male' | 'female')}
          >
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Male" value="male" />
          </Picker>
        </View>

        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={pickImage}
            disabled={loading}
          >
            <Ionicons name="camera-outline" size={36} color="#000" />
            <Text style={styles.captureButtonText}>Capture Image</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}
        </View>

        {text ? (
          <ScrollView style={styles.textScrollView}>
            <View style={styles.textCard}>
              <Text style={styles.ocrTextTitle}>Detected Text</Text>
              <Text style={styles.ocrText}>{text}</Text>

              <TouchableOpacity
                style={styles.repeatButton}
                onPress={() => speakText(text)}
              >
                <Ionicons name="volume-high-outline" size={24} color="#FFF" />
                <Text style={styles.repeatButtonText}>Repeat Voice</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'flex-start' },

  centerButtonWrapper: { flex: 0, alignItems: 'center', marginBottom: 30 },
  captureButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  captureButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  textScrollView: { flex: 1, marginBottom: 20 },
  textCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ocrTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B0B0B0',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingBottom: 5,
  },
  ocrText: { fontSize: 16, color: '#E0E0E0', lineHeight: 24 },

  advancedPickerWrapper: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  advancedPickerLabel: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  advancedPicker: {
    color: '#fff',
    width: '100%',
  },

  repeatButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  repeatButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OCRScreen;
