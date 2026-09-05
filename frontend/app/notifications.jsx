import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../services/api';
import { getAuthToken } from '../utils/auth';

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_URL}/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Fetch Notifications Error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = await getAuthToken();
            await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Mark Read Error:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        } catch (err) {
            console.error('Mark All Read Error:', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n._id !== id));
            }
        } catch (err) {
            console.error('Delete Notification Error:', err);
        }
    };

    const handlePressNotification = (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }) => {
        const isUnread = !item.read;

        let iconName = 'notifications-outline';
        if (item.type === 'message') iconName = 'chatbubble-ellipses-outline';
        if (item.type === 'ride') iconName = 'car-outline';
        if (item.type === 'alert') iconName = 'alert-circle-outline';

        return (
            <TouchableOpacity 
                style={[styles.notificationCard, isUnread && styles.unreadCard]} 
                onPress={() => handlePressNotification(item)}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={24} color={isUnread ? '#2563EB' : '#64748B'} />
                        {isUnread && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={[styles.title, isUnread && styles.unreadTitle]}>{item.title}</Text>
                        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteNotification(item._id)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="#DC2626" />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.message, isUnread && styles.unreadMessage]}>{item.message}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#172033" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                
                <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                    <Text style={styles.markAllText}>Mark all as read</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="notifications-off-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#172033',
        flex: 1,
        marginLeft: 12,
    },
    markAllButton: {
        padding: 8,
    },
    markAllText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    notificationCard: {
        backgroundColor: '#F1F5F9', // light background for read
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    unreadCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#BFDBFE',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    unreadDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2563EB',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#64748B',
    },
    unreadTitle: {
        fontWeight: 'bold',
        color: '#172033',
    },
    time: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    message: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        marginLeft: 60, // align with text, bypassing icon
    },
    unreadMessage: {
        color: '#334155',
        fontWeight: '500',
    },
    deleteButton: {
        padding: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 16,
        fontWeight: '500',
    },
});
