import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/');
    };

    const [profileImage, setProfileImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
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

            <View style={styles.scrollContent}>

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

                    <Text style={styles.userName}>Anshu Shee</Text>
                    <Text style={styles.userRating}>★ 4.8</Text>

                    <View style={styles.statsRow}>
                        <Text style={styles.statText}>24 Rides</Text>
                        <View style={styles.statDot} />
                        <Text style={styles.statText}>16 Driver</Text>
                    </View>
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

            </View>
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
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
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
    },
    logoutText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
