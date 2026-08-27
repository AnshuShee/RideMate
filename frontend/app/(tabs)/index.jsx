import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={styles.greeting}>Good morning, Anshu</Text>
                        <Text style={styles.headerTitle}>Where are you going today?</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="notifications-outline" size={24} color="#172033" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileAvatar} onPress={() => router.push('/(tabs)/profile')}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Find a Ride Card */}
                <View style={styles.mainCard}>
                    <Text style={styles.cardTitle}>Find a Ride</Text>

                    <View style={styles.searchFields}>
                        <View style={styles.fieldRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="location-outline" size={20} color="#2563EB" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Pickup</Text>
                                <Text style={styles.fieldText}>University Campus</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.fieldRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="flag-outline" size={20} color="#16A34A" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Destination</Text>
                                <Text style={styles.fieldTextPlaceholder}>Where do you want to go?</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.fieldRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="calendar-outline" size={20} color="#F59E0B" />
                            </View>
                            <View style={styles.fieldContent}>
                                <Text style={styles.fieldLabel}>Date</Text>
                                <Text style={styles.fieldText}>Today</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/search')}>
                        <Text style={styles.searchButtonText}>SEARCH RIDES</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/search')}>
                        <View style={[styles.actionIconWrapper, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="search" size={24} color="#2563EB" />
                        </View>
                        <Text style={styles.actionText}>Find a Ride</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/offer-ride')}>
                        <View style={[styles.actionIconWrapper, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="car" size={24} color="#2563EB" />
                        </View>
                        <Text style={styles.actionText}>Offer a Ride</Text>
                    </TouchableOpacity>
                </View>

                {/* Nearby Rides */}
                <Text style={styles.sectionTitle}>Nearby Rides</Text>

                <View style={styles.rideCard}>
                    <View style={styles.rideRoute}>
                        <View style={styles.routeLocations}>
                            <Text style={styles.cityText}>Ahmedabad</Text>
                            <Text style={styles.areaText}>University Campus</Text>

                            <View style={styles.arrowContainer}>
                                <Ionicons name="arrow-down" size={20} color="#64748B" />
                            </View>

                            <Text style={styles.cityText}>Gandhinagar</Text>
                            <Text style={styles.areaText}>Sector 21</Text>
                        </View>
                    </View>

                    <View style={styles.driverInfo}>
                        <View style={styles.driverRow}>
                            <Text style={styles.driverName}>Rahul Kumar</Text>
                            <Text style={styles.ratingText}>★ 4.8</Text>
                        </View>
                        <Text style={styles.timeText}>09:00 AM</Text>
                        <Text style={styles.seatsAvailable}>2 seats available</Text>
                    </View>

                    <TouchableOpacity style={styles.viewRideButton} onPress={() => router.push('/ride-details')}>
                        <Text style={styles.viewRideText}>VIEW RIDE</Text>
                        <Ionicons name="arrow-forward" size={16} color="#2563EB" style={{ marginLeft: 4 }} />
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
        paddingTop: Platform.OS === 'android' ? 44 : 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    greeting: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#172033',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    profileAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 32,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 20,
    },
    searchFields: {
        marginBottom: 20,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        alignItems: 'center',
        marginRight: 16,
    },
    fieldContent: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 2,
    },
    fieldText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#172033',
    },
    fieldTextPlaceholder: {
        fontSize: 16,
        color: '#64748B',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 16,
        marginLeft: 56,
    },
    searchButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
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
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 16,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#172033',
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
    routeLocations: {
        alignItems: 'flex-start',
    },
    cityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172033',
    },
    areaText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 2,
    },
    arrowContainer: {
        marginVertical: 12,
    },
    driverInfo: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        marginBottom: 16,
    },
    driverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    driverName: {
        fontSize: 15,
        fontWeight: '600',
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
    },
    viewRideButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    viewRideText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
