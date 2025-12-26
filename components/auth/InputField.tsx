import { AuthColors, AuthStyles } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: keyof typeof Ionicons.glyphMap;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    prefix?: string;
    hint?: string;
    editable?: boolean;
    onPress?: () => void;
}

export default function InputField({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    secureTextEntry = false,
    keyboardType = 'default',
    prefix,
    hint,
    error,
    editable = true,
    onPress,
}: InputFieldProps & { error?: string }) {
    // Nếu có prefix, render split layout
    if (prefix) {
        return (
            <View style={AuthStyles.inputContainer}>
                <Text style={AuthStyles.inputLabel}>{label}</Text>
                <View style={AuthStyles.splitInputWrapper}>
                    <View style={[AuthStyles.prefixContainer, error ? { borderColor: AuthColors.error } : null]}>
                        <Text style={AuthStyles.phonePrefix}>{prefix}</Text>
                    </View>
                    <View style={[AuthStyles.mainInputContainer, error ? { borderColor: AuthColors.error } : null]}>
                        <TextInput
                            style={AuthStyles.inputSplit}
                            placeholder={placeholder}
                            placeholderTextColor={AuthColors.textPlaceholder}
                            value={value}
                            onChangeText={onChangeText}
                            secureTextEntry={secureTextEntry}
                            keyboardType={keyboardType}
                            editable={editable}
                        />
                    </View>
                </View>
                {error ? (
                    <Text style={AuthStyles.errorText}>{error}</Text>
                ) : hint ? (
                    <Text style={AuthStyles.hintText}>{hint}</Text>
                ) : null}
            </View>
        );
    }

    const InputContainer = onPress ? TouchableOpacity : View;

    return (
        <View style={AuthStyles.inputContainer}>
            <Text style={AuthStyles.inputLabel}>{label}</Text>
            <InputContainer
                style={[AuthStyles.input, error ? { borderColor: AuthColors.error } : null]}
                onPress={onPress}
                disabled={!onPress}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={AuthColors.textLight}
                        style={AuthStyles.inputIcon}
                    />
                )}
                <TextInput
                    style={AuthStyles.inputText}
                    placeholder={placeholder}
                    placeholderTextColor={AuthColors.textPlaceholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    editable={editable && !onPress}
                />
            </InputContainer>
            {error ? (
                <Text style={AuthStyles.errorText}>{error}</Text>
            ) : hint ? (
                <Text style={AuthStyles.hintText}>{hint}</Text>
            ) : null}
        </View>
    );
}
