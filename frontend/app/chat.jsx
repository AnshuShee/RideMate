import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../services/api';
import { getAuthToken, getUserDetails } from '../utils/auth';

export default function ChatScreen() {
    const router = useRouter();
    const { rideId, receiverId, receiverName, routeStr } = useLocalSearchParams();
    const scrollViewRef = useRef();

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                const user = await getUserDetails();
                if (user && user.id) {
                    setCurrentUserId(user.id);
                }
                await fetchMessages();
            } catch (err) {
                console.error('Failed to init chat:', err);
                Alert.alert('Error', 'Unable to load messages');
            } finally {
                setLoading(false);
            }
        };

        if (rideId && receiverId) {
            initChat();
        } else {
            Alert.alert('Error', 'Chat details missing');
            router.back();
        }
    }, [rideId]);

    const fetchMessages = async () => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_URL}/messages/${rideId}/${receiverId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                // Scroll to bottom when messages load
                setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
            } else {
                throw new Error('Failed to load messages');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;

        setSending(true);
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rideId,
                    receiverId,
                    message: messageInput.trim()
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error sending message');
            }

            // Add the new message to state immediately for responsiveness
            setMessages(prev => [...prev, data.data]);
            setMessageInput('');

            // Scroll to bottom
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (error) {
            console.error('Send message error:', error);
            Alert.alert('Error', 'Message could not be sent');
        } finally {
            setSending(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#172033" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerName} numberOfLines={1}>{receiverName || 'Chat'}</Text>
                    <Text style={styles.headerRoute} numberOfLines={1}>{routeStr || 'Ride Route'}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    style={styles.chatArea}
                    contentContainerStyle={styles.chatContentContainer}
                    ref={scrollViewRef}
                >
                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                            <ActivityIndicator size="small" color="#2563EB" />
                            <Text style={{ marginTop: 12, color: '#64748B' }}>Loading messages...</Text>
                        </View>
                    ) : messages.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                            <Text style={{ color: '#64748B', fontSize: 15 }}>No messages yet</Text>
                        </View>
                    ) : (
                        messages.map((msg, index) => {
                            const isCurrentUser = msg.sender?._id === currentUserId || msg.sender === currentUserId;
                            return (
                                <View key={msg._id || index} style={isCurrentUser ? styles.messageRowUser : styles.messageRowOther}>
                                    <View style={isCurrentUser ? styles.bubbleUser : styles.bubbleOther}>
                                        <Text style={isCurrentUser ? styles.textUser : styles.textOther}>
                                            {msg.message}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                <View style={styles.inputSection}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#64748B"
                            value={messageInput}
                            onChangeText={setMessageInput}
                            onSubmitEditing={handleSendMessage}
                            editable={!loading}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.sendButton, ((!messageInput.trim() || sending) && { opacity: 0.5 })]}
                        onPress={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#172033',
    },
    headerRoute: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    chatArea: {
        flex: 1,
    },
    chatContentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    messageRowOther: {
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    bubbleOther: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    textOther: {
        fontSize: 15,
        color: '#172033',
        lineHeight: 22,
    },
    messageRowUser: {
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    bubbleUser: {
        backgroundColor: '#2563EB',
        padding: 16,
        borderRadius: 20,
        borderBottomRightRadius: 4,
        maxWidth: '80%',
    },
    textUser: {
        fontSize: 15,
        color: '#FFFFFF',
        lineHeight: 22,
    },
    inputSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 28,
        height: 56,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        color: '#172033',
    },
    sendButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
});
