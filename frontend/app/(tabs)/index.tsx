import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from '../../assets/styles/home.styles';
import { useRouter } from 'expo-router';

type Movie = {
  _id: string;
  title: string;
  description: string;
  image: string; // Base64 string
  cast: string;
};

const BASE_URL = "http://192.168.179.101:3000"; // Update with your LAN IP for physical device testing

export default function HomeScreen(): JSX.Element {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${BASE_URL}/movies`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, [])
  );
  const handleEdit = (id: string): void => {
    console.log('Edit movie with ID:', id);
    router.push(`/(tabs)/create?id=${id}`);
  };
  

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/movies/${id}`, {
        method: 'DELETE',
      });
      fetchMovies();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const renderItem: ListRenderItem<Movie> = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
          style={styles.bookImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.caption}>{item.description}</Text>
        <Text style={[styles.caption, { marginTop: 4, fontStyle: 'italic' }]}>
          🎭 Cast: {item.cast}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => handleEdit(item._id)}
            style={{ marginRight: 16 }}
          >
            <Feather name="edit-3" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash-bin-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎬 Movie List</Text>
          <Text style={styles.headerSubtitle}>Browse your favorite films</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#333" />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}


