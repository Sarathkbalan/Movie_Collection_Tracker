
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../../assets/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const profile = {
  name: 'sarath k balan',
  email: 'sarath@gmail.com',
  image: 'https://via.placeholder.com/80', 
};

export default function ProfileScreen(): JSX.Element {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.153.101:3000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
       
        router.replace('/(auth)');
      } else {
        const errorData = await response.json();
        Alert.alert(
          'Logout Failed',
          errorData?.message || 'There was an issue logging you out. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Network error during logout. Please check your connection and try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profile.image }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}











// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import styles from '../../assets/styles/profile.styles'; // Import the styles
// import COLORS from '../../constants/colors'; // Import the color constants

// export default function ProfileScreen({ navigation }: any): JSX.Element {
//   const [profile, setProfile] = useState({
//     name: '',
//     email: '',
//     image: 'https://via.placeholder.com/80', // Replace with actual user image URL
//     createdAt: '',
//   });

//   const fetchProfile = async () => {
//     try {
//       const response = await fetch('http://192.168.153.101:3000/users/profile', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // To include cookies with the request
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setProfile({
//           name: data.name,
//           email: data.email,
//           image: 'https://via.placeholder.com/80', // Replace with the actual image URL if available
//           createdAt: data.createdAt,
//         });
//       } else {
//         Alert.alert('Error', 'Failed to load profile');
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       Alert.alert('Error', 'Network error. Please try again later.');
//     }
//   };

//   // Fetch profile when the component mounts
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://192.168.153.101:3000/users/logout', {
//         method: 'POST',
//         credentials: 'include', // To include cookies with the request
//       });

//       if (response.ok) {
//         navigation.replace('/(auth)'); // Navigate to the login screen
//       } else {
//         Alert.alert('Logout Failed', 'There was an issue logging you out. Please try again.');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Network error during logout. Please check your connection and try again.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.profileHeader}>
//         <Image source={{ uri: profile.image }} style={styles.profileImage} />
//         <View style={styles.profileInfo}>
//           <Text style={styles.username}>{profile.name}</Text>
//           <Text style={styles.email}>{profile.email}</Text>
//           <Text style={styles.memberSince}>
//             Member since {new Date(profile.createdAt).toLocaleDateString()}
//           </Text>
//         </View>
//       </View>

//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
// import styles from '../../assets/styles/profile.styles';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';

// const BASE_URL = 'http://192.168.153.101:3000'; // Change this IP to match your server's

// type UserProfile = {
//   name: string;
//   email: string;
//   image?: string;
// };

// export default function ProfileScreen(): JSX.Element {
//   const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/users/profile`, {
//           credentials: 'include', // Important for cookie-based auth
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setProfile(data);
//         } else {
//           const error = await res.json();
//           Alert.alert('Error', error.message || 'Could not fetch profile');
//         }
//       } catch (error) {
//         console.error('Fetch profile error:', error);
//         Alert.alert('Error', 'Network error while fetching profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/users/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       if (response.ok) {
//         router.replace('/(auth)');
//       } else {
//         const errorData = await response.json();
//         Alert.alert('Logout Failed', errorData.message || 'Please try again later.');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Network error during logout.');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
//         <View style={styles.profileHeader}>
//           <Image
//             source={{ uri: profile.image || 'https://via.placeholder.com/80' }}
//             style={styles.profileImage}
//           />
//           <View style={styles.profileInfo}>
//             <Text style={styles.username}>{profile.name}</Text>
//             <Text style={styles.email}>{profile.email}</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} color="white" />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }
