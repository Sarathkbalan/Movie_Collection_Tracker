import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../assets/styles/create.styles'; // ✅ adjust path if needed
import { useLocalSearchParams, useRouter } from 'expo-router';

const BASE_URL = 'http://192.168.179.101:3000';

export default function EditMovieScreen() {
  // Get the movie ID from the URL params
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cast, setCast] = useState('');
  const [image, setImage] = useState<any>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch movie details when the component is mounted
  const fetchMovie = async () => {
    try {
      const res = await fetch(`${BASE_URL}/movies/${id}`);
      if (!res.ok) throw new Error('Failed to fetch movie details.');
      const data = await res.json();
      setTitle(data.title);
      setDescription(data.description);
      setCast(data.cast);
      setExistingImage(data.image);
    } catch (err) {
      Alert.alert('Error', 'Could not fetch movie details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      Alert.alert('Error', 'Invalid movie ID.');
      router.push('/(tabs)'); // Redirect to home screen if no valid ID is found
      return;
    }
    fetchMovie(); // Fetch movie details using the ID
  }, [id]); // Re-run the effect if `id` changes

  // Handle image selection using ImagePicker
  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]); // Set selected image in the state
    }
  };

  // Handle movie update request
  const handleUpdate = async (): Promise<void> => {
    if (!title || !description || !cast) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cast', cast);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: 'poster.jpg',
        type: 'image/jpeg',
      } as any);
    }

    setUpdating(true); // Set updating to true to show loading state

    try {
      const res = await fetch(`${BASE_URL}/movies/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        Alert.alert('Success', 'Movie updated successfully!');
        router.push('/(tabs)'); // Redirect to the main screen
      } else {
        Alert.alert('Error', 'Failed to update movie.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred during update.');
    } finally {
      setUpdating(false); // Set updating to false once done
    }
  };

  // If data is still loading, show loading spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 100}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>✏️ Edit Movie</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter movie title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write a short description..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cast</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter cast"
              value={cast}
              onChangeText={setCast}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Movie Poster</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
              ) : existingImage ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${existingImage}` }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="image-outline" size={32} color="#999" />
                  <Text style={styles.placeholderText}>Tap to select an image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={updating}>
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Update Movie</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
