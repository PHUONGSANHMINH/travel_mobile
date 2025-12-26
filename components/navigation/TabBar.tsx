import { AuthColors } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Define icons based on route name
                    let iconName: any = 'home';
                    if (route.name === 'index') iconName = 'home-outline';
                    else if (route.name === 'booking') iconName = 'clipboard-outline';
                    else if (route.name === 'wishlist') iconName = 'heart-outline';
                    else if (route.name === 'profile') iconName = 'person-outline';

                    // Solid icons for focused state if available
                    if (isFocused) {
                        if (route.name === 'index') iconName = 'home';
                        else if (route.name === 'booking') iconName = 'clipboard';
                        else if (route.name === 'wishlist') iconName = 'heart';
                        else if (route.name === 'profile') iconName = 'person';
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={(options as any).tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[
                                styles.tabItem,
                                isFocused ? styles.tabItemFocused : null,
                            ]}
                        >
                            <Ionicons
                                name={iconName}
                                size={24}
                                color={isFocused ? AuthColors.primary : '#FFFFFF'}
                            />
                            {isFocused && (
                                <Text style={styles.tabLabel}>
                                    {label as string}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: AuthColors.primary,
        borderRadius: 32,
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 25,
    },
    tabItemFocused: {
        flex: 2, // Grow to fit text
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        gap: 8,
    },
    tabLabel: {
        color: AuthColors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
