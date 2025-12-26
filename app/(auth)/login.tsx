import AuthHeader from '@/components/auth/AuthHeader';
import InputField from '@/components/auth/InputField';
import PrimaryButton from '@/components/auth/PrimaryButton';
import SocialButton from '@/components/auth/SocialButton';
import { AuthStyles } from '@/constants/AuthStyles';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
            return;
        }

        try {
            setIsLoading(true);
            await login(email, password);
            Alert.alert('Thành công', 'Đăng nhập thành công!');
            router.replace('/(home)');
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Đăng nhập thất bại. Vui lòng thử lại.';
            Alert.alert('Lỗi', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (platform: string) => {
        Alert.alert('Social Login', `Đăng nhập bằng ${platform}`);
    };

    return (
        <KeyboardAvoidingView
            style={AuthStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={AuthStyles.scrollView}
                keyboardShouldPersistTaps="handled"
            >
                <AuthHeader
                    imageSource={require('@/assets/images/start.png')}
                />

                <View style={AuthStyles.formContainer}>
                    <Text style={AuthStyles.title}>Đăng nhập</Text>
                    <Text style={AuthStyles.subtitle}>Chào mừng bạn trở lại!</Text>

                    <InputField
                        label="Email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <InputField
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 20 }} />
                    ) : (
                        <PrimaryButton title="Đăng nhập" onPress={handleLogin} />
                    )}

                    {/* Divider */}
                    <View style={AuthStyles.dividerContainer}>
                        <View style={AuthStyles.dividerLine} />
                        <Text style={AuthStyles.dividerText}>Tùy chọn khác</Text>
                        <View style={AuthStyles.dividerLine} />
                    </View>
                    {/* Social Login Buttons */}
                    <View style={AuthStyles.socialButtonsContainer}>
                        <SocialButton
                            icon="logo-google"
                            iconColor="#DB4437"
                            title=""
                            onPress={() => handleSocialLogin('Google')}
                        />
                        <SocialButton
                            icon="logo-facebook"
                            iconColor="#4267B2"
                            title=""
                            onPress={() => handleSocialLogin('Facebook')}
                        />
                        <SocialButton
                            icon="logo-apple"
                            iconColor="#000000"
                            title=""
                            onPress={() => handleSocialLogin('Apple')}
                        />
                    </View>

                    {/* Register Link */}
                    <View style={AuthStyles.linkContainer}>
                        <Text style={AuthStyles.linkText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register-option')}>
                            <Text style={AuthStyles.linkTextBold}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms and Privacy */}
                    <View style={AuthStyles.termsContainer}>
                        <Text style={AuthStyles.termsText}>
                            Bằng cách tiếp tục, bạn đồng ý với{' '}
                            <Text style={AuthStyles.termsLink}>Điều khoản & Điều kiện</Text>
                            {'\n'}và đã đọc được thông báo về{' '}
                            <Text style={AuthStyles.termsLink}>
                                Chính sách quyền riêng tư
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
