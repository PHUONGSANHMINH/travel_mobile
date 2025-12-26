import AuthHeader from '@/components/auth/AuthHeader';
import GenderSelector from '@/components/auth/GenderSelector';
import InputField from '@/components/auth/InputField';
import PrimaryButton from '@/components/auth/PrimaryButton';
import { AuthColors, AuthStyles } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        phone: '', // Pre-filled or passed from previous screen
        fullName: '',
        password: '',
        gender: 'male' as 'male' | 'female' | 'other',
        dob: new Date(),
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validate = () => {
        let valid = true;
        let newErrors: { [key: string]: string } = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
            valid = false;
        }

        if (!form.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            valid = false;
        } else if (form.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = () => {
        if (validate()) {
            Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
            router.replace('/(home)');
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setForm({ ...form, dob: selectedDate });
        }
    };

    const formatDate = (date: Date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
                    <Text style={AuthStyles.title}>Đăng ký tài khoản</Text>

                    {/* Phone Input */}
                    <InputField
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại"
                        value={form.phone}
                        onChangeText={(text) => setForm({ ...form, phone: text })}
                        prefix="+ 84"
                        keyboardType="phone-pad"
                    />

                    {/* Full Name Input */}
                    <InputField
                        label="Họ và tên"
                        placeholder="Họ và tên của bạn"
                        value={form.fullName}
                        onChangeText={(text) => setForm({ ...form, fullName: text })}
                        icon="person-outline"
                        hint="Để đảm bảo thông tin đặt chỗ chính xác, vui lòng nhập đúng như trên CMND/CCCD hoặc hộ chiếu"
                        error={errors.fullName}
                    />

                    {/* Password Input */}
                    <InputField
                        label="Mật khẩu"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChangeText={(text) => setForm({ ...form, password: text })}
                        icon="lock-closed-outline"
                        secureTextEntry
                        hint="Tối thiểu 8 kí tự, kết hợp chữ cái, chữ số và kí hiệu đặc biệt"
                        error={errors.password}
                    />

                    {/* Gender Selector */}
                    <GenderSelector
                        selectedGender={form.gender}
                        onSelectGender={(gender) => setForm({ ...form, gender })}
                    />

                    {/* Date of Birth Picker */}
                    <View style={AuthStyles.inputContainer}>
                        <Text style={AuthStyles.inputLabel}>Ngày sinh</Text>
                        <TouchableOpacity
                            style={[AuthStyles.input, errors.dob ? { borderColor: AuthColors.error } : null]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color={AuthColors.textLight}
                                style={AuthStyles.inputIcon}
                            />
                            <Text style={AuthStyles.inputText}>{formatDate(form.dob)}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={form.dob}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    <PrimaryButton title="Đăng ký" onPress={handleRegister} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({});
