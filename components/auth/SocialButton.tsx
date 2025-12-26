import { AuthColors, AuthStyles } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface SocialButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    title: string;
    onPress: () => void;
}

export default function SocialButton({
    icon,
    iconColor = AuthColors.text,
    title,
    onPress,
}: SocialButtonProps) {
    return (
        <TouchableOpacity
            style={title ? AuthStyles.socialButton : AuthStyles.socialButtonIconOnly}
            onPress={onPress}
        >
            <Ionicons
                name={icon}
                size={24}
                color={iconColor}
                style={title ? AuthStyles.socialButtonIcon : undefined}
            />
            {title ? <Text style={AuthStyles.socialButtonText}>{title}</Text> : null}
        </TouchableOpacity>
    );
}
