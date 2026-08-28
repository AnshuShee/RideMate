import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarModal from '../../components/CalendarModal';
import { API_URL } from '../../services/api';

export default function SearchScreen() {
    const router = useRouter();

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const fetchRides = async (useFilters = true) => {
        setLoading(true);
        try {
            let url = `${API_URL}/rides`;
            if (useFilters) {
                const params = [];
                if (pickup.trim()) params.push(`pickup=${encodeURIComponent(pickup.trim())}`);
                if (destination.trim()) params.push(`destination=${encodeURIComponent(destination.trim())}`);
                if (date.trim()) params.push(`date=${encodeURIComponent(date.trim())}`);
                if (params.length > 0) {
                    url += `?${params.join('&')}`;
                }
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch rides');
            }
            const data = await response.json();
            setRides(data);
        } catch (err) {
            console.error(err);
            Alert.alert('Search Failed', 'Unable to retrieve rides from server');
        } finally {
            setLoading(false);
        }
    };

    // Load available rides on mount
    useEffect(() => {
        fetchRides(false);
    }, []);

    const handleSearch = () => {
        fetchRides(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#172033" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Find a Ride</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Block */}
                <View style={styles.searchBlock}>

                    <View style={styles.fieldBox}>
                        <Text style={styles.fieldLabel}>Pickup</Text>
                        <View style={styles.fieldValueContainer}>
                            <TextInput
                                style={{ flex: 1, color: '#172033', fontSize: 15 }}
                                placeholder="Enter pickup location (e.g. College)"
                                placeholderTextColor="#64748B"
                                value={pickup}
                                onChangeText={setPickup}
                            />
                        </View>
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.fieldLabel}>Destination</Text>
                        <View style={styles.fieldValueContainer}>
                            <TextInput
                                style={{ flex: 1, color: '#172033', fontSize: 15 }}
                                placeholder="Enter destination location"
                                placeholderTextColor="#64748B"
                                value={destination}
                                onChangeText={setDestination}
                            />
                        </View>
                    </View>

                    <View style={styles.rowFields}>
                        <TouchableOpacity
                            style={[styles.fieldBox, { flex: 1 }]}
                            activeOpacity={0.7}
                            onPress={() => setShowCalendar(true)}
                        >
                            <Text style={styles.fieldLabel}>Date</Text>
                            <View style={styles.fieldValueContainer}>
                                <TextInput
                                    style={{ flex: 1, color: '#172033', fontSize: 15 }}
                                    placeholder="Select date"
                                    placeholderTextColor="#64748B"
                                    value={date}
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.searchButton, loading && { opacity: 0.7 }]}
                        onPress={handleSearch}
                        disabled={loading}
                    >
                        <Text style={styles.searchButtonText}>{loading ? 'SEARCHING...' : 'SEARCH RIDES'}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Available Rides</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
                ) : rides.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 24, fontSize: 15 }}>
                        No rides matching your search.
                    </Text>
                ) : (
                    rides.map((ride) => (
                        <View key={ride._id} style={styles.rideCard}>
                            <View style={styles.rideRoute}>
                                <Text style={styles.routeText}>{ride.pickup} → {ride.destination}</Text>
                            </View>

                            <View style={styles.driverInfo}>
                                <Text style={styles.driverName}>{ride.driver?.name || 'Driver'}</Text>
                                <Text style={styles.ratingText}>₹{ride.price}</Text>
                            </View>

                            <Text style={styles.timeText}>{ride.date} • {ride.time}</Text>
                            <Text style={styles.seatsAvailable}>
                                {ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} available
                            </Text>

                            <TouchableOpacity
                                style={styles.viewRideButton}
                                onPress={() => router.push({
                                    pathname: '/ride-details',
                                    params: { id: ride._id }
                                })}
                            >
                                <Text style={styles.viewRideText}>VIEW RIDE →</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

            </ScrollView>

            <CalendarModal
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onSelectDate={setDate}
            />
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#172033',
    },
    searchBlock: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 32,
    },
    fieldBox: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#172033',
        marginBottom: 8,
    },
    fieldValueContainer: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    fieldValue: {
        fontSize: 15,
        color: '#172033',
    },
    rowFields: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    searchButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 16,
    },
    rideCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 16,
    },
    rideRoute: {
        marginBottom: 16,
    },
    routeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172033',
    },
    driverInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    driverName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#172033',
    },
    ratingText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 4,
    },
    seatsAvailable: {
        fontSize: 14,
        fontWeight: '600',
        color: '#16A34A',
        marginBottom: 16,
    },
    viewRideButton: {
        marginTop: 8,
    },
    viewRideText: {
        color: '#2563EB',
        fontStyle: 'normal',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
