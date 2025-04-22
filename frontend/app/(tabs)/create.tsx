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


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Platform,
//   KeyboardAvoidingView,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Ionicons } from '@expo/vector-icons';
// import styles from '../../assets/styles/create.styles';
// import { useRouter } from 'expo-router';

// export default function CreateMovieScreen(): JSX.Element {
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [image, setImage] = useState<string | null>(null);
//   const [imageBase64, setImageBase64] = useState<string | null>(null);
//   const [rating, setRating] = useState<number>(0);

//   const router = useRouter();

//   const pickImage = async (): Promise<void> => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//       base64: true,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const selected = result.assets[0];
//       setImage(selected.uri);
//       setImageBase64(selected.base64 || null);
//     }
//   };

//   const handleSubmit = async (): Promise<void> => {
//     if (!title || !description || !imageBase64 || rating === 0) {
//       Alert.alert('Incomplete Form', 'Please fill out all fields.');
//       return;
//     }

//     const fullBase64Image = `data:image/jpeg;base64,${imageBase64}`;

//     try {
//       const response = await fetch('http://127.0.0.1:3000/movies', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           image: fullBase64Image,
//           rating,
//         }),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Movie added successfully!');
//         setTitle('');
//         setDescription('');
//         setImage(null);
//         setImageBase64(null);
//         setRating(0);
//         router.push('/'); // Navigate to Home or another screen
//       } else {
//         const errorData = await response.json();
//         console.error('Upload failed:', errorData);
//         Alert.alert('Error', 'Something went wrong while uploading.');
//       }
//     } catch (error) {
//       console.error('Error uploading movie:', error);
//       Alert.alert('Network Error', 'Could not connect to server.');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={80}
//     >
//       <View style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.container}>
//           <View style={styles.card}>
//             <View style={styles.header}>
//               <Text style={styles.title}>🎬 Add a Movie</Text>
//               <Text style={styles.subtitle}>Share a great film with others</Text>
//             </View>

//             <View style={styles.form}>
//               {/* Title */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.label}>Title</Text>
//                 <View style={styles.inputContainer}>
//                   <Ionicons name="film-outline" size={20} style={styles.inputIcon} />
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter movie title"
//                     value={title}
//                     onChangeText={setTitle}
//                   />
//                 </View>
//               </View>

//               {/* Description */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.label}>Description</Text>
//                 <TextInput
//                   style={styles.textArea}
//                   placeholder="Write a short description..."
//                   value={description}
//                   onChangeText={setDescription}
//                   multiline
//                 />
//               </View>

//               {/* Poster */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.label}>Movie Poster</Text>
//                 <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//                   {image ? (
//                     <Image source={{ uri: image }} style={styles.previewImage} />
//                   ) : (
//                     <View style={styles.placeholderContainer}>
//                       <Ionicons name="image-outline" size={32} color="#999" />
//                       <Text style={styles.placeholderText}>Tap to select an image</Text>
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* Rating */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.label}>Rating</Text>
//                 <View style={styles.ratingContainer}>
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <TouchableOpacity
//                       key={star}
//                       onPress={() => setRating(star)}
//                       style={styles.starButton}
//                     >
//                       <Ionicons
//                         name={star <= rating ? 'star' : 'star-outline'}
//                         size={24}
//                         color="#f5a623"
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Submit */}
//               <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                 <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.buttonIcon} />
//                 <Text style={styles.buttonText}>Submit Movie</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
