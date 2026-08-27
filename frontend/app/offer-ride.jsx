import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OfferRideScreen() {
    const router = useRouter();

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
                            <TextInput style={styles.input} placeholder="Where are you starting?" placeholderTextColor="#64748B" />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Destination</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="flag-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput style={styles.input} placeholder="Where are you going?" placeholderTextColor="#64748B" />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="calendar-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput style={styles.input} placeholder="Select date" placeholderTextColor="#64748B" />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Departure Time</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="time-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput style={styles.input} placeholder="Select time" placeholderTextColor="#64748B" />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Available Seats</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="people-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput style={styles.input} placeholder="How many seats?" keyboardType="numeric" placeholderTextColor="#64748B" />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.offerButton} onPress={() => router.back()}>
                        <Text style={styles.offerButtonText}>OFFER RIDE</Text>
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
