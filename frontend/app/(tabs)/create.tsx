import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../assets/styles/create.styles';
import { useRouter } from 'expo-router';

export default function CreateMovieScreen(): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [cast, setCast] = useState<string>('');
  const [image, setImage] = useState<any>(null);

  const router = useRouter();

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || !description || !image || !cast) {
      Alert.alert('Incomplete Form', 'Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cast', cast);
    formData.append('image', {
      uri: image.uri,
      name: 'poster.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await fetch('http://192.168.179.101:3000/movies', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Movie added successfully!');
        setTitle('');
        setDescription('');
        setCast('');
        setImage(null);
        router.push('/(tabs)');
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        Alert.alert('Error', 'Something went wrong while uploading.');
      }
    } catch (error) {
      console.error('Error uploading movie:', error);
      Alert.alert('Network Error', 'Could not connect to server.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>🎬 Add a Movie</Text>
            <Text style={styles.subtitle}>Share a great film with others</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="film-outline" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter movie title"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
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
              <View style={styles.inputContainer}>
                <Ionicons name="people-outline" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter cast names"
                  value={cast}
                  onChangeText={setCast}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Movie Poster</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {image ? (
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={32} color="#999" />
                    <Text style={styles.placeholderText}>Tap to select an image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Submit Movie</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

