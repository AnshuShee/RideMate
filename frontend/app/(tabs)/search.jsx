import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
    const router = useRouter();

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
                            <Text style={styles.fieldValue}>University Campus</Text>
                        </View>
                    </View>

                    <View style={styles.fieldBox}>
                        <Text style={styles.fieldLabel}>Destination</Text>
                        <View style={styles.fieldValueContainer}>
                            <Text style={styles.fieldValue}>Ahmedabad Railway Station</Text>
                        </View>
                    </View>

                    <View style={styles.rowFields}>
                        <View style={[styles.fieldBox, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.fieldLabel}>Date</Text>
                            <View style={styles.fieldValueContainer}>
                                <Text style={styles.fieldValue}>27 Aug</Text>
                            </View>
                        </View>

                        <View style={[styles.fieldBox, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.fieldLabel}>Time</Text>
                            <View style={styles.fieldValueContainer}>
                                <Text style={styles.fieldValue}>09:00 AM</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>SEARCH RIDES</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Available Rides</Text>

                {/* Ride Card */}
                <View style={styles.rideCard}>
                    <View style={styles.rideRoute}>
                        <Text style={styles.routeText}>University Campus → Railway Station</Text>
                    </View>

                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>Vikram Singh</Text>
                        <Text style={styles.ratingText}>★ 4.9</Text>
                    </View>

                    <Text style={styles.timeText}>09:15 AM</Text>
                    <Text style={styles.seatsAvailable}>1 seat available</Text>

                    <TouchableOpacity style={styles.viewRideButton} onPress={() => router.push('/ride-details')}>
                        <Text style={styles.viewRideText}>VIEW RIDE →</Text>
                    </TouchableOpacity>
                </View>

                {/* Second Ride Card */}
                <View style={styles.rideCard}>
                    <View style={styles.rideRoute}>
                        <Text style={styles.routeText}>University Campus → Railway Station</Text>
                    </View>

                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>Anjali Desai</Text>
                        <Text style={styles.ratingText}>★ 4.7</Text>
                    </View>

                    <Text style={styles.timeText}>09:45 AM</Text>
                    <Text style={styles.seatsAvailable}>3 seats available</Text>

                    <TouchableOpacity style={styles.viewRideButton} onPress={() => router.push('/ride-details')}>
                        <Text style={styles.viewRideText}>VIEW RIDE →</Text>
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
