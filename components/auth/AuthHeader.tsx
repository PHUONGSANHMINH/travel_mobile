import { AuthColors, AuthStyles } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AuthHeaderProps {
    imageSource: any;
}

export default function AuthHeader({ imageSource }: AuthHeaderProps) {
    return (
        <View style={styles.container}>
            <Image source={imageSource} style={AuthStyles.headerImage} />
            <View style={AuthStyles.logoContainer}>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('@/assets/images/icons/logo_auth.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={AuthStyles.logoText}>TripGo</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },
    logoImage: {
        width: 24,
        height: 24,
    },
});
