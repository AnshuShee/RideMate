import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../services/api';
import { getAuthToken, getUserDetails } from '../../utils/auth';

export default function MyRidesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const fetchMyRides = async () => {
                setLoading(true);
                try {
                    const token = await getAuthToken();
                    const user = await getUserDetails();
                    if (user && user.id) {
                        setCurrentUserId(user.id);
                    }

                    const response = await fetch(`${API_URL}/rides/my-rides`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setRides(data);
                    }
                } catch (err) {
                    console.error('Error fetching my rides:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMyRides();
        }, [])
    );

    const upcomingRides = rides.filter(r => r.status === 'upcoming' || r.status === 'started');
    const completedRides = rides.filter(r => r.status === 'completed' || r.status === 'cancelled');

    const locationStr = (loc) => {
        if (!loc) return '—';
        if (typeof loc === 'string') return loc;
        return loc.name || `${loc.latitude?.toFixed(4)}, ${loc.longitude?.toFixed(4)}`;
    };

    const renderRides = (rideList) => {
        if (rideList.length === 0) {
            return (
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                    <Text style={{ color: '#64748B', fontSize: 16 }}>
                        {activeTab === 'upcoming' ? 'No upcoming rides' : 'No completed rides'}
                    </Text>
                </View>
            );
        }

        return rideList.map(ride => {
            const userIdStr = currentUserId ? currentUserId.toString() : null;
            const isDriver = ride.driver?._id?.toString() === userIdStr || ride.driver?.toString() === userIdStr;

            return (
                <View key={ride._id} style={[styles.rideCard, activeTab === 'completed' && { borderColor: '#E2E8F0', opacity: 0.8 }]}>
                    <View style={styles.routeHeader}>
                        <Text style={styles.routeText}>{locationStr(ride.pickup)} → {locationStr(ride.destination)}</Text>
                    </View>

                    <Text style={styles.dateTimeText}>{ride.date} • {ride.time}</Text>

                    <View style={styles.passengersRow}>
                        <Text style={styles.passengerText}>{isDriver ? "Driver" : "Passenger"}</Text>
                        <Text style={styles.passengerText}>₹{ride.price} • {ride.availableSeats} Seats left</Text>
                    </View>

                    {activeTab === 'upcoming' && !isDriver && (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: '#16A34A', fontWeight: 'bold' }}>JOINED</Text>
                        </View>
                    )}

                    {activeTab === 'completed' && (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: ride.status === 'cancelled' ? '#DC2626' : '#16A34A', fontWeight: 'bold' }}>
                                {ride.status.toUpperCase()}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.viewRideButton} onPress={() => router.push(`/ride-details?id=${ride._id}`)}>
                        <Text style={styles.viewRideText}>VIEW DETAILS →</Text>
                    </TouchableOpacity>
                </View>
            );
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>My Rides</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'upcoming' && styles.activeTabButton]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'completed' && styles.activeTabButton]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : (
                    renderRides(activeTab === 'upcoming' ? upcomingRides : completedRides)
                )}
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
        paddingTop: Platform.OS === 'android' ? 24 : 10,
        paddingBottom: 24,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#172033',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: '#E2E8F0',
        borderRadius: 16,
        padding: 6,
        marginBottom: 24,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTabButton: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#172033',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    rideCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    routeHeader: {
        marginBottom: 12,
    },
    routeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172033',
    },
    dateTimeText: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 16,
        fontWeight: '500',
    },
    passengersRow: {
        flexDirection: 'column',
        marginBottom: 24,
    },
    passengerText: {
        fontSize: 15,
        color: '#172033',
        marginBottom: 4,
        fontWeight: '500',
    },
    viewRideButton: {
        alignItems: 'flex-start',
    },
    viewRideText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: 'bold',
    },
    completedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    completedText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#16A34A',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 4,
    },
});
