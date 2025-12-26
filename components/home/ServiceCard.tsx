import { AuthColors } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ServiceCardProps {
    imageSource: any;
    title: string;
    location?: string;
    price: string;
    rating?: number;
    reviews?: number;
    originalPrice?: string;
    discount?: string;
    style?: any;
    duration?: string;
    capacity?: string;
    airlineLogo?: string; // For flight cards
    pricePrefix?: string; // e.g., "Giá chỉ từ"
}

export default function ServiceCard({
    imageSource,
    title,
    location,
    price,
    rating,
    reviews,
    originalPrice,
    discount,
    style,
    duration,
    capacity,
    airlineLogo,
    pricePrefix,
}: ServiceCardProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} resizeMode="cover" />
                {discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}</Text>
                    </View>
                )}
                <View style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={20} color="#fff" />
                </View>
            </View>

            <View style={styles.content}>
                {location && (
                    <View style={styles.locationWrapper}>
                        <Ionicons name="location-sharp" size={14} color={AuthColors.textLight} />
                        <Text style={styles.location} numberOfLines={1}>{location}</Text>
                    </View>
                )}

                <Text style={styles.title} numberOfLines={2}>{title}</Text>

                {(duration || capacity) && (
                    <View style={styles.tourDetailsRow}>
                        {duration && (
                            <View style={styles.tourDetail}>
                                <Ionicons name="calendar-outline" size={12} color={AuthColors.textLight} />
                                <Text style={styles.tourDetailText}>{duration}</Text>
                            </View>
                        )}
                        {capacity && (
                            <View style={styles.tourDetail}>
                                <Ionicons name="people-outline" size={12} color={AuthColors.textLight} />
                                <Text style={styles.tourDetailText}>{capacity}</Text>
                            </View>
                        )}
                    </View>
                )}

                {(rating !== undefined && reviews !== undefined) && (
                    <View style={styles.ratingWrapper}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.rating}>{rating}</Text>
                        <Text style={styles.reviews}>({reviews} đánh giá)</Text>
                    </View>
                )}

                <View style={styles.priceContainer}>
                    {(airlineLogo || pricePrefix) && (
                        <View style={styles.pricePrefixRow}>
                            {airlineLogo && (
                                <Image source={{ uri: airlineLogo }} style={styles.airlineLogoSmall} resizeMode="contain" />
                            )}
                            {pricePrefix && (
                                <Text style={styles.pricePrefix}>{pricePrefix}</Text>
                            )}
                        </View>
                    )}
                    {originalPrice && (
                        <Text style={styles.originalPrice}>{originalPrice}</Text>
                    )}
                    <Text style={styles.price}>{price}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 120,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF4757',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    content: {
        padding: 12,
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 2,
    },
    location: {
        fontSize: 12,
        color: AuthColors.textLight,
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: AuthColors.text,
        marginBottom: 8,
        height: 15,
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: 'bold',
        color: AuthColors.text,
    },
    reviews: {
        fontSize: 12,
        color: AuthColors.textLight,
    },
    priceContainer: {

    },
    pricePrefixRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    airlineLogoSmall: {
        width: 20,
        height: 20,
    },
    pricePrefix: {
        fontSize: 11,
        color: AuthColors.textLight,
    },
    originalPrice: {
        fontSize: 12,
        color: AuthColors.textLight,
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AuthColors.primary,
    },
    tourDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    tourDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tourDetailText: {
        fontSize: 11,
        color: AuthColors.textLight,
    },
});