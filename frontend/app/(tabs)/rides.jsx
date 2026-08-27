import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MyRidesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('upcoming');

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

                {activeTab === 'upcoming' ? (
                    <>
                        <View style={styles.rideCard}>
                            <View style={styles.routeHeader}>
                                <Text style={styles.routeText}>Ahmedabad → Gandhinagar</Text>
                            </View>

                            <Text style={styles.dateTimeText}>27 Aug • 09:00 AM</Text>

                            <View style={styles.passengersRow}>
                                <Text style={styles.passengerText}>Driver</Text>
                                <Text style={styles.passengerText}>3 Passengers</Text>
                            </View>

                            <TouchableOpacity style={styles.viewRideButton} onPress={() => router.push('/ride-details')}>
                                <Text style={styles.viewRideText}>VIEW RIDE →</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={[styles.rideCard, { borderColor: '#E2E8F0' }]}>
                            <View style={styles.routeHeader}>
                                <Text style={styles.routeText}>Gandhinagar → Ahmedabad</Text>
                            </View>

                            <View style={styles.completedRow}>
                                <Text style={styles.dateTimeText}>25 Aug • </Text>
                                <Text style={styles.completedText}>Completed</Text>
                            </View>

                            <View style={styles.starsRow}>
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <Ionicons name="star" size={20} color="#F59E0B" />
                                <Ionicons name="star" size={20} color="#F59E0B" />
                            </View>
                        </View>
                    </>
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
