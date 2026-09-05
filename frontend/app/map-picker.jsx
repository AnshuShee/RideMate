import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView from '../components/MapView';

// Default region: Ahmedabad, Gujarat, India
const DEFAULT_REGION = {
    latitude: 23.0225,
    longitude: 72.5714,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export default function MapPickerScreen() {
    const router = useRouter();
    const { mode } = useLocalSearchParams();  // 'pickup' or 'destination'

    const mapRef = useRef(null);

    // The selected location is always the CENTER of the map
    const [currentRegion, setCurrentRegion] = useState(DEFAULT_REGION);
    const [locationName, setLocationName] = useState('');
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    // ── Reverse-geocode a coordinate → human-readable address ─────────────────
    const getAddressFromCoords = async (latitude, longitude) => {
        try {
            const results = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (results && results.length > 0) {
                const r = results[0];
                const parts = [r.name, r.street, r.district, r.city].filter(Boolean);
                return parts.length > 0
                    ? parts.join(', ')
                    : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            }
        } catch (_) { /* fall through */ }
        return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    };

    // ── Called every time the map finishes panning/zooming ────────────────────
    // The center of the current region IS the selected location.
    const handleRegionChangeComplete = async (region) => {
        setCurrentRegion(region);
        setIsGeocoding(true);
        const name = await getAddressFromCoords(region.latitude, region.longitude);
        setLocationName(name);
        setIsGeocoding(false);
    };

    // ── "Use Current Location" button ─────────────────────────────────────────
    const handleCurrentLocation = async () => {
        setGettingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Location permission is required to use this feature.');
                return;
            }

            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = pos.coords;

            const newRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            mapRef.current?.animateToRegion(newRegion, 800);
            // handleRegionChangeComplete will fire after the animation
        } catch (err) {
            Alert.alert('Error', 'Could not get your location. Please try again.');
        } finally {
            setGettingLocation(false);
        }
    };

    // ── Confirm: store the center location and go back ────────────────────────
    const handleConfirm = () => {
        const location = {
            name: locationName || `${currentRegion.latitude.toFixed(5)}, ${currentRegion.longitude.toFixed(5)}`,
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
        };
        LocationResult.set(mode, location);
        router.back();
    };

    const title = mode === 'pickup' ? 'Select Pickup' : 'Select Destination';
    const pinColor = mode === 'pickup' ? '#2563EB' : '#DC2626';

    return (
        <View style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#172033" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* ── Instruction Banner ── */}
            <View style={styles.instructionBanner}>
                <Ionicons name="information-circle-outline" size={16} color="#2563EB" />
                <Text style={styles.instructionText}>
                    Pan &amp; zoom the map to place the pin on your location
                </Text>
            </View>

            {/* ── Map ── */}
            <View style={styles.mapWrapper}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={DEFAULT_REGION}
                    onRegionChangeComplete={handleRegionChangeComplete}
                    showsUserLocation
                    showsMyLocationButton={false}
                />

                {/* Center pin — always stays in the middle of the map view */}
                <View style={styles.pinContainer} pointerEvents="none">
                    {/* Shadow dot on ground */}
                    <View style={[styles.pinShadow, { backgroundColor: pinColor + '33' }]} />
                    {/* Pin icon */}
                    <Ionicons name="location" size={48} color={pinColor} style={styles.pinIcon} />
                </View>

                {/* Floating "Use Current Location" button */}
                <TouchableOpacity
                    style={styles.currentLocBtn}
                    onPress={handleCurrentLocation}
                    disabled={gettingLocation}
                >
                    {gettingLocation ? (
                        <ActivityIndicator size="small" color="#2563EB" />
                    ) : (
                        <Ionicons name="locate" size={24} color="#2563EB" />
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Bottom Card ── */}
            <View style={styles.bottomCard}>
                <Text style={styles.cardLabel}>Selected Location</Text>

                {isGeocoding ? (
                    <View style={styles.geocodingRow}>
                        <ActivityIndicator size="small" color="#2563EB" />
                        <Text style={styles.geocodingText}>Detecting address...</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.locationName} numberOfLines={2}>
                            {locationName || 'Pan the map to select a location'}
                        </Text>
                        <Text style={styles.coords}>
                            {currentRegion.latitude.toFixed(5)}, {currentRegion.longitude.toFixed(5)}
                        </Text>
                    </>
                )}

                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                    <Text style={styles.confirmBtnText}>CONFIRM LOCATION</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Simple module-level store to pass data back ──────────────────────────────
// Expo Router's router.back() cannot carry complex params,
// so we store the selected location here and the calling screen reads it
// in useFocusEffect after navigation returns.
export const LocationResult = (() => {
    let pickup = null;
    let destination = null;
    return {
        set: (mode, val) => { if (mode === 'pickup') pickup = val; else destination = val; },
        get: (mode) => (mode === 'pickup' ? pickup : destination),
        clear: (mode) => { if (mode === 'pickup') pickup = null; else destination = null; },
    };
})();

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        zIndex: 10,
    },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#172033' },

    instructionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#BFDBFE',
    },
    instructionText: { fontSize: 13, color: '#2563EB', fontWeight: '500', flex: 1 },

    // Map wrapper to support absolute-positioned center pin
    mapWrapper: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },

    // Center pin: always in the middle of mapWrapper
    pinContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        // The pin icon is 48px wide, so offset by -24 to center it horizontally.
        // The pin tip is at the bottom, so offset vertically so the TIP sits at center.
        marginLeft: -24,
        marginTop: -48,   // moves the whole pin up so its bottom tip = center point
        alignItems: 'center',
    },
    pinIcon: {
        // Drop shadow for visibility on any map background
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    pinShadow: {
        position: 'absolute',
        bottom: -4,
        width: 16,
        height: 8,
        borderRadius: 8,
    },

    // Floating locate-me button
    currentLocBtn: {
        position: 'absolute',
        right: 16,
        bottom: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },

    // Bottom card
    bottomCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        borderTopWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 8,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    geocodingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    geocodingText: { fontSize: 14, color: '#64748B' },
    locationName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 4,
    },
    coords: { fontSize: 13, color: '#64748B', marginBottom: 20 },
    confirmBtn: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
