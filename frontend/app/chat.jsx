import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#172033" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerName}>Rahul Kumar</Text>
                    <Text style={styles.headerRoute}>Ahmedabad → Gandhinagar</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContentContainer}>

                    <View style={styles.messageRowOther}>
                        <View style={styles.bubbleOther}>
                            <Text style={styles.textOther}>Hey, I can pick you up from the University main gate.</Text>
                        </View>
                    </View>

                    <View style={styles.messageRowUser}>
                        <View style={styles.bubbleUser}>
                            <Text style={styles.textUser}>Perfect! I'll be there by 8:55 AM.</Text>
                        </View>
                    </View>

                    <View style={styles.messageRowOther}>
                        <View style={styles.bubbleOther}>
                            <Text style={styles.textOther}>See you soon.</Text>
                        </View>
                    </View>

                </ScrollView>

                <View style={styles.inputSection}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#64748B"
                        />
                    </View>
                    <TouchableOpacity style={styles.sendButton}>
                        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
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
