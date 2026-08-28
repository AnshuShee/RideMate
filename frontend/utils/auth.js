import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const setAuthToken = async (token) => {
    try {
        await SecureStore.setItemAsync('token', token);
    } catch (err) {
        console.error('Error saving secure token:', err);
    }
};

export const getAuthToken = async () => {
    try {
        return await SecureStore.getItemAsync('token');
    } catch (err) {
        console.error('Error getting secure token:', err);
        return null;
    }
};

export const deleteAuthToken = async () => {
    try {
        await SecureStore.deleteItemAsync('token');
    } catch (err) {
        console.error('Error deleting secure token:', err);
    }
};

export const saveUserDetails = async (user) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
        console.error('Error storing user details:', err);
    }
};

export const getUserDetails = async () => {
    try {
        const val = await AsyncStorage.getItem('user');
        return val ? JSON.parse(val) : null;
    } catch (err) {
        console.error('Error retrieving user details:', err);
        return null;
    }
};

export const clearUserDetails = async () => {
    try {
        await AsyncStorage.removeItem('user');
    } catch (err) {
        console.error('Error clearing user details:', err);
    }
};
