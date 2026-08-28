import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../services/api';

export default function RideDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRideDetails = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${API_URL}/rides/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to retrieve ride details');
                }
                const data = await response.json();
                setRide(data);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', err.message || 'Unable to connect to server');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchRideDetails();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

    if (!ride) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>Ride details not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#172033" />
                    </TouchableOpacity>
                    <View style={{ width: 40 }} />
                </View>

                {/* Route Presentation */}
                <View style={styles.routeContainer}>
                    <Text style={styles.cityText}>{ride.pickup}</Text>
                    <Text style={styles.areaText}>Starting Point</Text>

                    <View style={styles.arrowBox}>
                        <Ionicons name="arrow-down" size={24} color="#64748B" />
                    </View>

                    <Text style={styles.cityText}>{ride.destination}</Text>
                    <Text style={styles.areaText}>Ending Destination</Text>
                </View>

                {/* Date and Time */}
                <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateText}>{ride.date}</Text>
                    <Text style={styles.timeText}>{ride.time}</Text>
                </View>

                {/* Driver Section */}
                <Text style={styles.sectionTitle}>Driver & Vehicle</Text>
                <View style={styles.driverCard}>
                    <View style={styles.driverInfo}>
                        <View style={styles.driverAvatar}>
                            <Ionicons name="person-outline" size={24} color="#64748B" />
                        </View>
                        <View style={styles.driverText}>
                            <Text style={styles.driverName}>{ride.driver?.name || 'Driver'}</Text>
                            <Text style={styles.driverStats}>{ride.vehicle} • {ride.driver?.email}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.seatsAvailable}>
                    {ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} available • ₹{ride.price}
                </Text>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>JOIN RIDE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/chat')}>
                        <Text style={styles.secondaryButtonText}>Message Driver</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    routeContainer: {
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#FFFFFF',
        padding: 32,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    cityText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#172033',
        textAlign: 'center',
    },
    areaText: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
    },
    arrowBox: {
        marginVertical: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateTimeContainer: {
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    dateText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172033',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 16,
    },
    driverCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 24,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    driverText: {
        marginLeft: 16,
    },
    driverName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#172033',
    },
    driverStats: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    seatsAvailable: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#16A34A',
        marginBottom: 32,
    },
    buttonGroup: {
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryButtonText: {
        color: '#172033',
        fontSize: 16,
        fontWeight: '600',
    },
});
