import AuthHeader from '@/components/auth/AuthHeader';
import SocialButton from '@/components/auth/SocialButton';
import { AuthStyles } from '@/constants/AuthStyles';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterOptionScreen() {
    const handleSocialRegister = (platform: string) => {
        Alert.alert('Social Register', `Đăng ký bằng ${platform}`);
    };

    const handlePhoneRegister = () => {
        router.push('/(auth)/register');
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
                    <Text style={AuthStyles.title}>Đăng ký</Text>
                    <Text style={AuthStyles.subtitle}>
                        Giá thấp hơn và phần thưởng đang chờ bạn.
                    </Text>

                    {/* Social Register Buttons - Stacked Vertical */}
                    <View style={{ gap: 4 }}>
                        <SocialButton
                            icon="logo-google"
                            iconColor="#DB4437"
                            title="Đăng ký bằng Google"
                            onPress={() => handleSocialRegister('Google')}
                        />
                        <SocialButton
                            icon="logo-facebook"
                            iconColor="#4267B2"
                            title="Đăng ký bằng Facebook"
                            onPress={() => handleSocialRegister('Facebook')}
                        />
                        <SocialButton
                            icon="logo-apple"
                            iconColor="#000000"
                            title="Đăng ký bằng Apple"
                            onPress={() => handleSocialRegister('Apple')}
                        />
                    </View>

                    {/* Divider */}
                    <View style={AuthStyles.dividerContainer}>
                        <View style={AuthStyles.dividerLine} />
                        <Text style={AuthStyles.dividerText}>Tuỳ chọn khác</Text>
                        <View style={AuthStyles.dividerLine} />
                    </View>

                    {/* Phone Register Button */}
                    <SocialButton
                        icon="call-outline"
                        iconColor="#333333"
                        title="Đăng ký bằng Số điện thoại"
                        onPress={handlePhoneRegister}
                    />

                    {/* Login Link */}
                    <View style={AuthStyles.linkContainer}>
                        <Text style={AuthStyles.linkText}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text style={AuthStyles.linkTextBold}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms and Privacy */}
                    <View style={AuthStyles.termsContainer}>
                        <Text style={AuthStyles.termsText}>
                            Bằng cách tiếp tục, bạn đồng ý với{' '}
                            <Text style={AuthStyles.termsLink}>Điều khoản & Điều kiện</Text>
                            {'\n'}và đã được thông báo về{' '}
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
