import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from '../components/MapView';
import { API_URL } from '../services/api';
import { getAuthToken, getUserDetails } from '../utils/auth';

// Returns a display string for a location field (handles old string + new object)
const locationStr = (loc) => {
    if (!loc) return '—';
    if (typeof loc === 'string') return loc;
    return loc.name || `${loc.latitude?.toFixed(4)}, ${loc.longitude?.toFixed(4)}`;
};

// Returns lat/lng from a location field, or null if not available
const locationCoords = (loc) => {
    if (!loc) return null;
    if (typeof loc === 'object' && loc.latitude != null && loc.longitude != null) {
        return { latitude: loc.latitude, longitude: loc.longitude };
    }
    return null;
};

export default function RideDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchRideDetails = async () => {
            if (!id) return;
            try {
                const user = await getUserDetails();
                if (user && user.id) setCurrentUserId(user.id);

                const response = await fetch(`${API_URL}/rides/${id}`);
                if (!response.ok) throw new Error('Failed to retrieve ride details');
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

    const handleJoinRide = async () => {
        setActionLoading(true);
        try {
            const token = await getAuthToken();
            if (!token) {
                Alert.alert('Session Expired', 'Please log in again to join a ride.');
                return;
            }
            const response = await fetch(`${API_URL}/rides/${id}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Server error: ${text.substring(0, 100)}`);
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error joining ride');
            Alert.alert('Success', 'Ride joined successfully');
            router.push('/(tabs)/rides');
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelRide = () => {
        Alert.alert('Cancel Ride?', 'Are you sure you want to drop out of this ride?', [
            { text: 'GO BACK', style: 'cancel' },
            {
                text: 'DROP OUT', style: 'destructive',
                onPress: async () => {
                    setActionLoading(true);
                    try {
                        const token = await getAuthToken();
                        const response = await fetch(`${API_URL}/rides/${id}/cancel`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.message || 'Error cancelling ride');
                        Alert.alert('Success', 'You have been removed from the ride');
                        router.push('/(tabs)/rides');
                    } catch (err) {
                        Alert.alert('Error', err.message);
                    } finally {
                        setActionLoading(false);
                    }
                }
            }
        ]);
    };

    const handleDeleteRide = () => {
        Alert.alert('Delete Ride?', 'Are you sure you want to permanently delete this ride? This action cannot be undone.', [
            { text: 'GO BACK', style: 'cancel' },
            {
                text: 'DELETE RIDE', style: 'destructive',
                onPress: async () => {
                    setActionLoading(true);
                    try {
                        const token = await getAuthToken();
                        const response = await fetch(`${API_URL}/rides/${id}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.message || 'Error deleting ride');
                        Alert.alert('Success', 'Ride deleted successfully');
                        router.replace('/(tabs)/rides');
                    } catch (err) {
                        Alert.alert('Error', err.message);
                    } finally {
                        setActionLoading(false);
                    }
                }
            }
        ]);
    };

    const handleStartRide = async () => {
        setActionLoading(true);
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_URL}/rides/${id}/start`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error starting ride');

            Alert.alert('Success', 'Ride started successfully');
            setRide(data.ride); // trigger re-render with updated status
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteRide = () => {
        Alert.alert(
            'Complete Ride?',
            'Are you sure you want to mark this ride as completed?',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'COMPLETE',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            const token = await getAuthToken();
                            const response = await fetch(`${API_URL}/rides/${id}/complete`, {
                                method: 'PUT',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.message || 'Error completing ride');

                            Alert.alert('Success', 'Ride completed successfully');
                            setRide(data.ride);
                        } catch (err) {
                            Alert.alert('Error', err.message);
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

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

    const userIdStr = currentUserId ? currentUserId.toString() : null;
    const isDriver = ride.driver?._id?.toString() === userIdStr || ride.driver?.toString() === userIdStr;
    const isPassenger = ride.passengers && ride.passengers.some(p => p.toString() === userIdStr);
    const isFull = ride.availableSeats <= 0;

    // ── Map: only show if both coordinates are available ──────────────────────
    const pickupCoords = locationCoords(ride.pickup);
    const destCoords = locationCoords(ride.destination);
    const showMap = pickupCoords && destCoords;

    // Centre the map between pickup and destination
    const mapRegion = showMap ? {
        latitude: (pickupCoords.latitude + destCoords.latitude) / 2,
        longitude: (pickupCoords.longitude + destCoords.longitude) / 2,
        latitudeDelta: Math.abs(pickupCoords.latitude - destCoords.latitude) * 2.5 + 0.02,
        longitudeDelta: Math.abs(pickupCoords.longitude - destCoords.longitude) * 2.5 + 0.02,
    } : null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#172033" />
                    </TouchableOpacity>

                    {ride.status && (
                        <View style={[
                            styles.statusBadge,
                            ride.status === 'upcoming' ? { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' } :
                                ride.status === 'started' ? { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' } :
                                    ride.status === 'completed' ? { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' } :
                                        { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                ride.status === 'upcoming' ? { color: '#2563EB' } :
                                    ride.status === 'started' ? { color: '#EA580C' } :
                                        ride.status === 'completed' ? { color: '#16A34A' } :
                                            { color: '#DC2626' }
                            ]}>
                                {ride.status.toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* ── Route Presentation ── */}
                <View style={styles.routeContainer}>
                    <Text style={styles.cityText}>{locationStr(ride.pickup)}</Text>
                    <Text style={styles.areaText}>Starting Point</Text>
                    <View style={styles.arrowBox}>
                        <Ionicons name="arrow-down" size={24} color="#64748B" />
                    </View>
                    <Text style={styles.cityText}>{locationStr(ride.destination)}</Text>
                    <Text style={styles.areaText}>Ending Destination</Text>
                </View>

                {/* ── Mini Map (only when both coords exist) ── */}
                {showMap && (
                    <View style={styles.mapContainer}>
                        <Text style={styles.sectionTitle}>Route Map</Text>
                        <MapView
                            style={styles.miniMap}
                            region={mapRegion}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            pitchEnabled={false}
                            rotateEnabled={false}
                        >
                            {/* Pickup marker — blue */}
                            <Marker coordinate={pickupCoords} pinColor="#2563EB" title="Pickup" description={locationStr(ride.pickup)} />
                            {/* Destination marker — red */}
                            <Marker coordinate={destCoords} pinColor="#DC2626" title="Destination" description={locationStr(ride.destination)} />
                            {/* Straight line between the two points */}
                            <Polyline
                                coordinates={[pickupCoords, destCoords]}
                                strokeColor="#2563EB"
                                strokeWidth={2}
                                lineDashPattern={[6, 4]}
                            />
                        </MapView>
                        {/* Legend */}
                        <View style={styles.mapLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.dot, { backgroundColor: '#2563EB' }]} />
                                <Text style={styles.legendText}>{locationStr(ride.pickup)}</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
                                <Text style={styles.legendText}>{locationStr(ride.destination)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* ── Date and Time ── */}
                <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateText}>{ride.date}</Text>
                    <Text style={styles.timeText}>{ride.time}</Text>
                </View>

                {/* ── Driver Section ── */}
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

                {isDriver && ride.passengers && ride.passengers.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <Text style={styles.sectionTitle}>Passengers</Text>
                        {ride.passengers.map((passenger, index) => (
                            <View key={passenger._id || index} style={styles.passengerCard}>
                                <View style={styles.driverInfo}>
                                    <View style={styles.driverAvatar}>
                                        <Ionicons name="person" size={20} color="#64748B" />
                                    </View>
                                    <View style={[styles.driverText, { flex: 1 }]}>
                                        <Text style={styles.driverName}>{passenger.name || 'Passenger'}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.messageRiderBtn}
                                        onPress={() => router.push({
                                            pathname: '/chat',
                                            params: {
                                                rideId: ride._id,
                                                receiverId: passenger._id,
                                                receiverName: passenger.name,
                                                routeStr: `${locationStr(ride.pickup)} → ${locationStr(ride.destination)}`
                                            }
                                        })}
                                    >
                                        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563EB" />
                                        <Text style={styles.messageRiderText}>Message</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.seatsAvailable}>
                    {ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} available • ₹{ride.price}
                </Text>

                <View style={styles.buttonGroup}>
                    {isDriver ? (
                        <>
                            {ride.status === 'upcoming' && (
                                <TouchableOpacity style={[styles.primaryButton, { marginBottom: 12 }]} onPress={handleStartRide} disabled={actionLoading}>
                                    <Text style={styles.primaryButtonText}>{actionLoading ? 'Starting...' : 'START RIDE'}</Text>
                                </TouchableOpacity>
                            )}
                            {ride.status === 'started' && (
                                <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#EA580C', marginBottom: 12 }]} onPress={handleCompleteRide} disabled={actionLoading}>
                                    <Text style={styles.primaryButtonText}>{actionLoading ? 'Completing...' : 'COMPLETE RIDE'}</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#DC2626' }]} onPress={handleDeleteRide} disabled={actionLoading}>
                                <Text style={styles.primaryButtonText}>{actionLoading ? 'Deleting...' : 'DELETE RIDE'}</Text>
                            </TouchableOpacity>
                        </>
                    ) : isPassenger ? (
                        <>
                            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#DC2626' }]} onPress={handleCancelRide} disabled={actionLoading}>
                                <Text style={styles.primaryButtonText}>{actionLoading ? 'Processing...' : 'DROP OUT'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => router.push({
                                    pathname: '/chat',
                                    params: {
                                        rideId: ride._id,
                                        receiverId: ride.driver?._id,
                                        receiverName: ride.driver?.name,
                                        routeStr: `${locationStr(ride.pickup)} → ${locationStr(ride.destination)}`
                                    }
                                })}>
                                <Text style={styles.secondaryButtonText}>Message Driver</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={[styles.primaryButton, isFull && { opacity: 0.5 }]} onPress={handleJoinRide} disabled={actionLoading || isFull}>
                                <Text style={styles.primaryButtonText}>
                                    {actionLoading ? 'Joining...' : isFull ? 'RIDE FULL' : 'JOIN RIDE'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => router.push({
                                    pathname: '/chat',
                                    params: {
                                        rideId: ride._id,
                                        receiverId: ride.driver?._id,
                                        receiverName: ride.driver?.name,
                                        routeStr: `${locationStr(ride.pickup)} → ${locationStr(ride.destination)}`
                                    }
                                })}>
                                <Text style={styles.secondaryButtonText}>Message Driver</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
    },
    backButton: { padding: 8, marginLeft: -8 },
    routeContainer: {
        alignItems: 'center', marginBottom: 24,
        backgroundColor: '#FFFFFF', padding: 32, borderRadius: 24,
        borderWidth: 1, borderColor: '#E2E8F0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03, shadowRadius: 12, elevation: 2,
    },
    cityText: { fontSize: 20, fontWeight: '800', color: '#172033', textAlign: 'center' },
    areaText: { fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center' },
    arrowBox: {
        marginVertical: 16, width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#E2E8F0',
    },
    // ── Map ──
    mapContainer: { marginBottom: 24 },
    miniMap: {
        width: '100%', height: 200, borderRadius: 20,
        overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0',
    },
    mapLegend: {
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginTop: 12,
        borderWidth: 1, borderColor: '#E2E8F0', gap: 8,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    legendText: { fontSize: 14, color: '#172033', fontWeight: '500', flex: 1 },
    // ── Rest ──
    dateTimeContainer: { alignItems: 'flex-start', marginBottom: 24 },
    dateText: { fontSize: 15, color: '#64748B', fontWeight: '500', marginBottom: 4 },
    timeText: { fontSize: 24, fontWeight: 'bold', color: '#172033' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#172033', marginBottom: 16 },
    driverCard: {
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24,
    },
    driverInfo: { flexDirection: 'row', alignItems: 'center' },
    driverAvatar: {
        width: 56, height: 56, borderRadius: 28, backgroundColor: '#F8FAFC',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#E2E8F0',
    },
    driverText: { marginLeft: 16 },
    driverName: { fontSize: 17, fontWeight: 'bold', color: '#172033' },
    driverStats: { fontSize: 14, color: '#64748B', marginTop: 4 },
    seatsAvailable: { fontSize: 16, fontWeight: 'bold', color: '#16A34A', marginBottom: 32 },
    buttonGroup: { gap: 16 },
    passengerCard: {
        backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12,
    },
    messageRiderBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF',
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE'
    },
    messageRiderText: {
        color: '#2563EB', fontSize: 13, fontWeight: 'bold', marginLeft: 6
    },
    primaryButton: {
        backgroundColor: '#2563EB', height: 58, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
    secondaryButton: {
        backgroundColor: '#FFFFFF', height: 58, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#E2E8F0',
    },
    secondaryButtonText: { color: '#172033', fontSize: 16, fontWeight: '600' },
});
