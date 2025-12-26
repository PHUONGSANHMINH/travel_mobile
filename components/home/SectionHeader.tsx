import { AuthColors } from '@/constants/AuthStyles';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.titleWrapper}>
                    {icon}
                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        marginTop: 24,
        paddingHorizontal: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AuthColors.primary,
    },
    subtitle: {
        fontSize: 12,
        color: AuthColors.textLight,
        marginLeft: 0,
    },
    seeAllText: {
        fontSize: 14,
        color: AuthColors.textLight,
    },
});
