import { AuthStyles } from '@/constants/AuthStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface GenderSelectorProps {
    selectedGender: 'male' | 'female' | 'other';
    onSelectGender: (gender: 'male' | 'female' | 'other') => void;
}

export default function GenderSelector({
    selectedGender,
    onSelectGender,
}: GenderSelectorProps) {
    const genders = [
        { value: 'male' as const, label: 'Nam' },
        { value: 'female' as const, label: 'Nữ' },
        { value: 'other' as const, label: 'Khác' },
    ];

    return (
        <View style={AuthStyles.genderContainer}>
            <Text style={AuthStyles.inputLabel}>Giới tính</Text>
            <View style={AuthStyles.genderButtonGroup}>
                {genders.map((gender) => (
                    <TouchableOpacity
                        key={gender.value}
                        style={[
                            AuthStyles.genderButton,
                            selectedGender === gender.value
                                ? AuthStyles.genderButtonSelected
                                : AuthStyles.genderButtonUnselected,
                        ]}
                        onPress={() => onSelectGender(gender.value)}
                    >
                        <Text
                            style={
                                selectedGender === gender.value
                                    ? AuthStyles.genderButtonTextSelected
                                    : AuthStyles.genderButtonTextUnselected
                            }
                        >
                            {gender.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
