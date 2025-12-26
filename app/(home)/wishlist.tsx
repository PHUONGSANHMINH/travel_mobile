import { AuthColors } from '@/constants/AuthStyles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WishlistScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Màn hình Yêu thích</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    text: {
        fontSize: 18,
        color: AuthColors.text,
    },
});
