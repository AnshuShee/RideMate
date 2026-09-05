import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarModal from '../components/CalendarModal';
import { API_URL } from '../services/api';
import { getAuthToken } from '../utils/auth';
import { LocationResult } from './map-picker';

export default function OfferRideScreen() {
    const router = useRouter();

    // pickup / destination are objects: { name, latitude, longitude }
    const [pickup, setPickup] = useState(null);
    const [destination, setDestination] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [seats, setSeats] = useState('');
    const [price, setPrice] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    // ── Read location result when screen comes back into focus ────────────────
    // The map-picker stores its result in LocationResult before calling router.back().
    // useFocusEffect fires every time this screen becomes visible again.
    useFocusEffect(
        useCallback(() => {
            const pickupResult = LocationResult.get('pickup');
            if (pickupResult) {
                setPickup(pickupResult);
                LocationResult.clear('pickup');
            }
            const destResult = LocationResult.get('destination');
            if (destResult) {
                setDestination(destResult);
                LocationResult.clear('destination');
            }
        }, [])
    );

    const handleOfferRide = async () => {
        if (!pickup || !destination || !date.trim() || !time.trim() || !seats.trim() || !price.trim() || !vehicle.trim()) {
            Alert.alert('Error', 'Please fill in all fields including pickup and destination');
            return;
        }
        const seatsNum = Number(seats);
        if (isNaN(seatsNum) || seatsNum <= 0) {
            Alert.alert('Error', 'Available seats must be greater than 0');
            return;
        }
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum < 0) {
            Alert.alert('Error', 'Price cannot be negative');
            return;
        }

        setLoading(true);
        try {
            const token = await getAuthToken();
            if (!token) {
                Alert.alert('Error', 'Authentication token not found. Please log in again.');
                router.replace('/');
                return;
            }

            const response = await fetch(`${API_URL}/rides`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pickup,        // { name, latitude, longitude }
                    destination,   // { name, latitude, longitude }
                    date: date.trim(),
                    time: time.trim(),
                    availableSeats: seatsNum,
                    price: priceNum,
                    vehicle: vehicle.trim()
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create ride');

            Alert.alert('Success', 'Ride created successfully', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (err) {
            console.error(err);
            Alert.alert('Offer Ride Failed', err.message || 'Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#172033" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Offer a Ride</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.formCard}>

                    {/* ── Pickup ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Pickup Location</Text>
                        <TouchableOpacity
                            style={styles.locationButton}
                            onPress={() => router.push({ pathname: '/map-picker', params: { mode: 'pickup' } })}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="location-outline" size={22} color="#2563EB" style={styles.icon} />
                            <Text style={[styles.locationButtonText, pickup && styles.locationSelected]}>
                                {pickup ? pickup.name || `${pickup.latitude?.toFixed(4)}, ${pickup.longitude?.toFixed(4)}` : 'Select on Map'}
                            </Text>
                            <Ionicons name="map-outline" size={18} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* ── Destination ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Destination</Text>
                        <TouchableOpacity
                            style={styles.locationButton}
                            onPress={() => router.push({ pathname: '/map-picker', params: { mode: 'destination' } })}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="flag-outline" size={22} color="#DC2626" style={styles.icon} />
                            <Text style={[styles.locationButtonText, destination && styles.locationSelected]}>
                                {destination ? destination.name || `${destination.latitude?.toFixed(4)}, ${destination.longitude?.toFixed(4)}` : 'Select on Map'}
                            </Text>
                            <Ionicons name="map-outline" size={18} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* ── Date ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.inputWrapper} activeOpacity={0.7} onPress={() => setShowCalendar(true)}>
                            <Ionicons name="calendar-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={[styles.input, { color: '#172033' }]}
                                placeholder="Select date"
                                placeholderTextColor="#64748B"
                                value={date}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* ── Time ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Departure Time</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="time-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 09:00"
                                placeholderTextColor="#64748B"
                                value={time}
                                onChangeText={setTime}
                            />
                        </View>
                    </View>

                    {/* ── Seats ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Available Seats</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="people-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="How many seats?"
                                keyboardType="numeric"
                                placeholderTextColor="#64748B"
                                value={seats}
                                onChangeText={setSeats}
                            />
                        </View>
                    </View>

                    {/* ── Price ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Price (per seat)</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="cash-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Price in ₹"
                                keyboardType="numeric"
                                placeholderTextColor="#64748B"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    </View>

                    {/* ── Vehicle ── */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Vehicle Details</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="car-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Honda City"
                                placeholderTextColor="#64748B"
                                value={vehicle}
                                onChangeText={setVehicle}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.offerButton, loading && { opacity: 0.7 }]}
                        onPress={handleOfferRide}
                        disabled={loading}
                    >
                        <Text style={styles.offerButtonText}>{loading ? 'Creating ride...' : 'OFFER RIDE'}</Text>
                    </TouchableOpacity>
                </View>

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
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#172033' },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.03,
        shadowRadius: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#172033', marginBottom: 8 },
    // Location picker button style
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    locationButtonText: {
        flex: 1,
        fontSize: 15,
        color: '#64748B',
    },
    locationSelected: {
        color: '#172033',
        fontWeight: '500',
    },
    // Regular text input style
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    icon: { marginRight: 12 },
    input: { flex: 1, fontSize: 15, color: '#172033' },
    offerButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    offerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
