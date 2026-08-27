import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.content}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#172033" />
                        </TouchableOpacity>
                        <Image source={{ uri: 'https://res.cloudinary.com/dhnczdpqj/image/upload/v1787809503/ChatGPT_Image_Aug_27_2026_11_14_52_AM_zcktpq.png' }} style={styles.headerLogo} />
                        <View style={{ width: 24 }} />
                    </View>

                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join your college ride community</Text>

                    <View style={styles.formSection}>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#64748B" style={styles.icon} />
                                <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#64748B" />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>College Email</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.icon} />
                                <TextInput style={styles.input} placeholder="student@college.edu" placeholderTextColor="#64748B" keyboardType="email-address" />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>College</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="school-outline" size={20} color="#64748B" style={styles.icon} />
                                <TextInput style={styles.input} placeholder="Select your college" placeholderTextColor="#64748B" />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.icon} />
                                <TextInput style={styles.input} placeholder="Create password" placeholderTextColor="#64748B" secureTextEntry={!showPassword} />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.icon} />
                                <TextInput style={styles.input} placeholder="Repeat password" placeholderTextColor="#64748B" secureTextEntry={!showConfirmPassword} />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.createButton} onPress={() => router.replace('/')}>
                            <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.footerLink}>Login</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: -8,
        marginTop: -16, // also reduce top gap
    },
    backButton: {
        padding: 4,
    },
    headerLogo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#172033',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
    },
    formSection: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#172033',
        marginBottom: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        height: 48,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#172033',
    },
    createButton: {
        backgroundColor: '#2563EB',
        height: 50,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#64748B',
        fontSize: 13,
    },
    footerLink: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
    },
});
