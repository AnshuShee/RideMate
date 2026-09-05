import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// ─── Token (stored in SecureStore) ────────────────────────────────────────────

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

/**
 * Deletes the JWT token from SecureStore.
 * Unlike the old version, this deliberately does NOT silently swallow the error
 * so the caller can detect if deletion actually failed.
 */
export const deleteAuthToken = async () => {
    await SecureStore.deleteItemAsync('token'); // throws on real failure
};

// ─── User details (stored in AsyncStorage) ────────────────────────────────────

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

// ─── Logout helper ─────────────────────────────────────────────────────────────

/**
 * Clears every piece of auth data from storage.
 * Each operation runs independently so one failure never blocks the others.
 * Returns true if the token was successfully deleted, false otherwise.
 */
export const clearAllAuthData = async () => {
    let tokenDeleted = false;

    // 1. Delete JWT from SecureStore
    try {
        await SecureStore.deleteItemAsync('token');
        tokenDeleted = true;
    } catch (err) {
        console.error('Failed to delete auth token from SecureStore:', err);
    }

    // 2. Clear user details from AsyncStorage
    try {
        await AsyncStorage.removeItem('user');
    } catch (err) {
        console.error('Failed to clear user details:', err);
    }

    // 3. Clear profile image from AsyncStorage
    try {
        await AsyncStorage.removeItem('profile_image');
    } catch (err) {
        console.error('Failed to clear profile image:', err);
    }

    return tokenDeleted;
};
