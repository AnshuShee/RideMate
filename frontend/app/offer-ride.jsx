import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarModal from '../components/CalendarModal';
import { API_URL } from '../services/api';
import { getAuthToken } from '../utils/auth';

export default function OfferRideScreen() {
    const router = useRouter();

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [seats, setSeats] = useState('');
    const [price, setPrice] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const handleOfferRide = async () => {
        // Validation
        if (!pickup.trim() || !destination.trim() || !date.trim() || !time.trim() || !seats.trim() || !price.trim() || !vehicle.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
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
                    pickup: pickup.trim(),
                    destination: destination.trim(),
                    date: date.trim(),
                    time: time.trim(),
                    availableSeats: seatsNum,
                    price: priceNum,
                    vehicle: vehicle.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create ride');
            }

            Alert.alert('Success', 'Ride created successfully', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/(tabs)')
                }
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

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Pickup Location</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="location-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Where are you starting?"
                                placeholderTextColor="#64748B"
                                value={pickup}
                                onChangeText={setPickup}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Destination</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="flag-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Where are you going?"
                                placeholderTextColor="#64748B"
                                value={destination}
                                onChangeText={setDestination}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity
                            style={styles.inputWrapper}
                            activeOpacity={0.7}
                            onPress={() => setShowCalendar(true)}
                        >
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

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Departure Time</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="time-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Select time (e.g. 09:00)"
                                placeholderTextColor="#64748B"
                                value={time}
                                onChangeText={setTime}
                            />
                        </View>
                    </View>

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
        marginBottom: 32,
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#172033',
        marginBottom: 8,
    },
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
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#172033',
    },
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
