import { AuthStyles } from '@/constants/AuthStyles';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
}

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
    return (
        <TouchableOpacity style={AuthStyles.primaryButton} onPress={onPress}>
            <Text style={AuthStyles.primaryButtonText}>{title}</Text>
        </TouchableOpacity>
    );
}
