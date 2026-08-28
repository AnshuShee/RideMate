import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getApiBaseUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:5000';
    }
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:5000`;
    }
    return 'http://10.0.2.2:5000';
};

export const API_URL = `${getApiBaseUrl()}/api`;
