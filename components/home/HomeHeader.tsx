import { AuthColors } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeHeader() {
    const [activeTab, setActiveTab] = useState<'hotel' | 'flight' | 'tour'>('hotel');

    return (
        <View style={styles.container}>
            {/* Background Image & Hero Text */}
            <ImageBackground
                source={require('@/assets/images/tour/Banner.png')}
                style={styles.headerBackground}
                resizeMode="cover"
            >
                {/* Lighter overlay */}
                <View style={styles.overlay} />

                <View style={styles.headerContent}>
                    <View style={styles.topBar}>
                        <View style={styles.appNameContainer}>
                            <Image
                                source={require('@/assets/images/icons/Logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.appName}>TripGo</Text>
                        </View>
                        <View style={styles.notificationBadge}>
                            <Ionicons name="notifications-outline" size={24} color="#fff" />
                        </View>
                    </View>

                    <Text style={styles.heroTitle}>
                        Khám phá thế giới,{'\n'}tìm kiếm hành trình của bạn
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Đặt khách sạn, chuyến bay và tour du lịch với giá tốt nhất
                    </Text>
                </View>
            </ImageBackground>

            {/* Search Box */}
            <View style={styles.searchBoxContainer}>
                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'hotel' && styles.activeTab]}
                        onPress={() => setActiveTab('hotel')}
                    >
                        <Ionicons name="business-outline" size={20} color={activeTab === 'hotel' ? AuthColors.primary : '#666'} />
                        <Text style={[styles.tabText, activeTab === 'hotel' && styles.activeTabText]}>Khách sạn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'flight' && styles.activeTab]}
                        onPress={() => setActiveTab('flight')}
                    >
                        <Ionicons name="airplane-outline" size={20} color={activeTab === 'flight' ? AuthColors.primary : '#666'} />
                        <Text style={[styles.tabText, activeTab === 'flight' && styles.activeTabText]}>Vé máy bay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'tour' && styles.activeTab]}
                        onPress={() => setActiveTab('tour')}
                    >
                        <Ionicons name="map-outline" size={20} color={activeTab === 'tour' ? AuthColors.primary : '#666'} />
                        <Text style={[styles.tabText, activeTab === 'tour' && styles.activeTabText]}>Tour du lịch</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider removed, using proper spacing and borders */}

                {/* Inputs */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Điểm đến</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="location-outline" size={20} color={AuthColors.primary} />
                        <TextInput
                            placeholder="Bạn muốn đi đâu?"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={[styles.inputGroup, { marginTop: 12 }]}>
                    <Text style={styles.label}>Ngày</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="calendar-outline" size={20} color={AuthColors.primary} />
                        <TextInput
                            placeholder="15/10/2023"
                            style={styles.input}
                            placeholderTextColor="#ccc"
                            editable={false}
                        />
                    </View>
                </View>

                <View style={[styles.inputGroup, { marginTop: 12 }]}>
                    <Text style={styles.label}>Số lượng khách</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="people-outline" size={20} color={AuthColors.primary} />
                        <TextInput
                            placeholder="2 người lớn, 1 phòng"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Search Button */}
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 160, // Increased to prevent search box from being covered
    },
    headerBackground: {
        width: '100%',
        height: 300,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.35)', // Darker overlay for blur effect
    },
    headerContent: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    appNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 32,
        height: 32,
    },
    appName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    notificationBadge: {
        padding: 5,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        lineHeight: 34,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#eee',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchBoxContainer: {
        position: 'absolute',
        top: 180,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 10, // Ensure it sits on top
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        paddingBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: AuthColors.primary,
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: AuthColors.primary,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
    inputGroup: {
        marginTop: 16,
    },
    label: {
        fontSize: 13,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF4F8',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    searchButton: {
        backgroundColor: AuthColors.primary,
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
});
