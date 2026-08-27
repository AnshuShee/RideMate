import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>

                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Image source={{ uri: 'https://res.cloudinary.com/dhnczdpqj/image/upload/v1787657764/ChatGPT_Image_Aug_25_2026_05_04_44_PM_nlu8o0.png' }} style={styles.logoImage} />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.subtitleText}>Login to continue to RideMate</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#64748B"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={22} color="#64748B" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#64748B"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.footerLink}>Create Account</Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoBox: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 160,
        height: 160,
        borderRadius: 32,
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#172033',
        marginBottom: 8,
    },
    brandTagline: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '500',
    },
    formSection: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#172033',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#172033',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 12,
    },
    iconRight: {
        padding: 4,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#172033',
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    forgotText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#2563EB',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
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
        fontSize: 14,
    },
    footerLink: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
});
