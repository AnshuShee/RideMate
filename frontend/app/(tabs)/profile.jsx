import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAllAuthData, getUserDetails } from '../../utils/auth';


export default function ProfileScreen() {
    const router = useRouter();
    const [loggedOut, setLoggedOut] = useState(false);
    const [userName, setUserName] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    // ALL hooks must be called before any early return (React rules)
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getUserDetails();
                if (user && user.name) {
                    setUserName(user.name);
                }
                const savedImage = await AsyncStorage.getItem('profile_image');
                if (savedImage) {
                    setProfileImage(savedImage);
                }
            } catch (err) {
                console.log('Error loading user:', err);
            }
        };
        loadUser();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllAuthData();
                        setLoggedOut(true);   // triggers <Redirect> below
                    },
                },
            ]
        );
    };

    // Early return AFTER all hooks — when loggedOut=true, Expo Router
    // handles the redirect at framework level (bypasses tab navigator)
    if (loggedOut) {
        return <Redirect href="/" />;
    }


    const pickImage = async () => {
        // Step 1: Request permission to access the photo library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow access to your photo library to set a profile picture.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Step 2: Open the image picker
        // NOTE: expo-image-picker v17 removed the MediaType enum.
        //       Use the plain string 'images' instead.
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',   // ✅ correct for expo-image-picker v17+
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setProfileImage(uri);
            await AsyncStorage.setItem('profile_image', uri);
        }
    };


    const menuItems = [
        { title: 'Personal Information', icon: 'person-outline' },
        { title: 'College Information', icon: 'school-outline' },
        { title: 'Ride History', icon: 'time-outline' },
        { title: 'Ratings', icon: 'star-outline' },
        { title: 'Settings', icon: 'settings-outline' },
    ];

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.pageTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.profileSection}>
                    <TouchableOpacity style={styles.avatarCircle} activeOpacity={0.7} onPress={pickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={{ width: 88, height: 88, borderRadius: 44 }} />
                        ) : (
                            <Ionicons name="person-outline" size={32} color="#64748B" />
                        )}
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={14} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    {userName ? <Text style={styles.userName}>{userName}</Text> : null}
                </View>

                <View style={styles.menuCard}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={styles.menuIconBox}>
                                <Ionicons name={item.icon} size={22} color="#172033" />
                            </View>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Ionicons name="arrow-forward" size={20} color="#64748B" />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={async () => {
                        await clearAllAuthData();
                        setLoggedOut(true);
                    }}
                >
                    <Ionicons name="log-in-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                    <Text style={styles.loginText}>Go to Login</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 44 : 20,
        paddingBottom: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#172033',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2563EB',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 4,
    },
    userRating: {
        fontSize: 15,
        color: '#172033',
        fontWeight: '600',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '500',
    },
    statDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#64748B',
        marginHorizontal: 12,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingVertical: 4,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#172033',
    },
    logoutButton: {
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
        marginBottom: 12,
    },
    logoutText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loginButton: {
        height: 56,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    loginText: {
        color: '#2563EB',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
