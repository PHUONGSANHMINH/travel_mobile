import TabBar from '@/components/navigation/TabBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Trang chủ',
                }}
            />
            <Tabs.Screen
                name="booking"
                options={{
                    title: 'Đặt chỗ',
                }}
            />
            <Tabs.Screen
                name="wishlist"
                options={{
                    title: 'Yêu thích',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Tài khoản',
                }}
            />
        </Tabs>
    );
}
