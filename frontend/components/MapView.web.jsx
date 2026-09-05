import { Text, View } from 'react-native';

export const Marker = () => null;
export const Polyline = () => null;

export default function MapView({ style, children }) {
    return (
        <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0', borderWidth: 1, borderColor: '#cbd5e1' }]}>
            <Text style={{ color: '#64748b' }}>Map view is only available on iOS and Android.</Text>
            <View style={{ display: 'none' }}>{children}</View>
        </View>
    );
}
