import { AuthColors } from '@/constants/AuthStyles';
import bookingStorage from '@/services/bookingStorage';
import hotelDetailService from '@/services/hotelDetailService';
import { BookingData } from '@/types/booking';
import { HotelDetailResponse, Room } from '@/types/hotelDetail';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HotelDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [hotel, setHotel] = useState<HotelDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (id) {
            loadHotelDetail(parseInt(id));
        }
    }, [id]);

    const loadHotelDetail = async (hotelId: number) => {
        try {
            setIsLoading(true);
            const data = await hotelDetailService.getHotelById(hotelId);
            setHotel(data);
        } catch (error) {
            console.error('Error loading hotel detail:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = (event: any) => {
        const slideSize = SCREEN_WIDTH;
        const offset = event.nativeEvent.contentOffset.x;
        const index = Math.round(offset / slideSize);
        setCurrentImageIndex(index);
    };

    const handleBookRoom = async (room: Room) => {
        if (!hotel) return;

        try {
            // Calculate dates
            const today = new Date();
            const checkInDate = today.toISOString();

            const checkOutDate = new Date(today);
            checkOutDate.setDate(today.getDate() + 2); // 2 days later
            const checkOutDateISO = checkOutDate.toISOString();

            // Calculate nights
            const nights = 2;
            const totalPrice = room.price * nights;

            // Create booking data
            const bookingData: BookingData = {
                hotel: {
                    id: hotel.id,
                    name: hotel.name,
                    thumbnail: hotel.images?.[0]?.imageUrl || '',
                    address: hotel.address,
                    starRating: hotel.starRating,
                },
                room: {
                    id: room.id,
                    name: room.name,
                    price: room.price,
                    capacity: room.capacity,
                    area: room.area,
                },
                checkInDate,
                checkOutDate: checkOutDateISO,
                guests: room.capacity,
                nights,
                totalPrice,
            };

            // Save to AsyncStorage
            await bookingStorage.saveBooking(bookingData);

            // Set selected room
            setSelectedRoom(room);

            // Navigate to payment page
            router.push('/(payment)');
        } catch (error) {
            console.error('Error saving booking:', error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin đặt phòng. Vui lòng thử lại.');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AuthColors.primary} />
            </View>
        );
    }

    if (!hotel) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy thông tin khách sạn</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {hotel.images && hotel.images.length > 0 ? (
                            hotel.images.map((image, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: image.imageUrl }}
                                    style={styles.hotelImage}
                                    resizeMode="cover"
                                />
                            ))
                        ) : (
                            <Image
                                source={{ uri: 'https://via.placeholder.com/400x300' }}
                                style={styles.hotelImage}
                                resizeMode="cover"
                            />
                        )}
                    </ScrollView>

                    {/* Image Counter */}
                    <View style={styles.imageCounter}>
                        <Text style={styles.imageCounterText}>
                            {currentImageIndex + 1}/{hotel.images?.length || 1}
                        </Text>
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>

                    {/* Favorite Button */}
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>

                {/* Hotel Info */}
                <View style={styles.contentContainer}>
                    {/* Hotel Name */}
                    <Text style={styles.hotelName}>{hotel.name}</Text>

                    {/* Rating */}
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{hotel.averageRating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>
                            ({hotel.totalReviews.toLocaleString('vi-VN')} đánh giá)
                        </Text>
                    </View>

                    {/* Address */}
                    <View style={styles.addressContainer}>
                        <Ionicons name="location-sharp" size={16} color={AuthColors.primary} />
                        <Text style={styles.addressText}>{hotel.address}</Text>
                    </View>

                    {/* Description Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Giới thiệu</Text>
                        <Text style={styles.descriptionText}>{hotel.description}</Text>
                    </View>

                    {/* Amenities Section */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tiện nghi</Text>
                            <View style={styles.amenitiesGrid}>
                                {hotel.amenities.slice(0, 8).map((amenity) => (
                                    <View key={amenity.id} style={styles.amenityItem}>
                                        <View style={styles.amenityIconContainer}>
                                            <Ionicons
                                                name={getAmenityIcon(amenity.icon)}
                                                size={24}
                                                color={AuthColors.primary}
                                            />
                                        </View>
                                        <Text style={styles.amenityText}>{amenity.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Rooms Section */}
                    {hotel.rooms && hotel.rooms.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Loại phòng</Text>
                            {hotel.rooms.map((room) => (
                                <View key={room.id} style={styles.roomCard}>
                                    <View style={styles.roomRow}>
                                        <View style={styles.roomLeft}>
                                            <Text style={styles.roomName}>{room.name}</Text>
                                            <View style={styles.roomInfo}>
                                                <View style={styles.roomInfoItem}>
                                                    <Ionicons name="resize-outline" size={12} color="#666" />
                                                    <Text style={styles.roomInfoText}>{room.area}m²</Text>
                                                </View>
                                                <View style={styles.roomInfoItem}>
                                                    <Ionicons name="people-outline" size={12} color="#666" />
                                                    <Text style={styles.roomInfoText}>
                                                        {room.capacity} người
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.roomFeatures}>
                                                <View style={styles.featureBadge}>
                                                    <Text style={styles.featureBadgeText}>Giường King</Text>
                                                </View>
                                                <View style={styles.featureBadge}>
                                                    <Text style={styles.featureBadgeText}>View biển</Text>
                                                </View>
                                                <View style={styles.featureBadge}>
                                                    <Text style={styles.featureBadgeText}>Bàn công</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.roomRight}>
                                            <Text style={styles.roomPrice}>
                                                {room.price.toLocaleString('vi-VN')}đ
                                            </Text>
                                            <TouchableOpacity
                                                style={[
                                                    styles.bookButton,
                                                    !room.isAvailable && styles.bookButtonDisabled,
                                                ]}
                                                disabled={!room.isAvailable}
                                                onPress={() => handleBookRoom(room)}
                                            >
                                                <Text style={styles.bookButtonText}>
                                                    {room.isAvailable ? 'Đặt phòng' : 'Hết phòng'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Reviews Section */}
                    {hotel.reviews && hotel.reviews.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Đánh giá của khách hàng</Text>
                            {hotel.reviews.slice(0, 3).map((review) => (
                                <View key={review.id} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <View style={styles.reviewUserInfo}>
                                            <View style={styles.avatarPlaceholder}>
                                                <Ionicons name="person" size={20} color="#999" />
                                            </View>
                                            <View>
                                                <Text style={styles.reviewUserName}>
                                                    {review.user?.email?.split('@')[0] || 'Người dùng'}
                                                </Text>
                                                <Text style={styles.reviewDate}>
                                                    {new Date(review.createdAt).toLocaleDateString(
                                                        'vi-VN'
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.reviewRating}>
                                            {[...Array(5)].map((_, i) => (
                                                <Ionicons
                                                    key={i}
                                                    name="star"
                                                    size={12}
                                                    color={
                                                        i < review.averageRating
                                                            ? '#FFD700'
                                                            : '#DDD'
                                                    }
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={styles.reviewComment}>{review.comment}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

// Helper function to map amenity icons
function getAmenityIcon(icon: string): any {
    const iconMap: { [key: string]: any } = {
        wifi: 'wifi',
        'wifi-outline': 'wifi-outline',
        'wifi-off': 'wifi-outline',
        pool: 'water-outline',
        parking: 'car-outline',
        restaurant: 'restaurant-outline',
        gym: 'fitness-outline',
        spa: 'flower-outline',
        'air-conditioner': 'snow-outline',
        tv: 'tv-outline',
    };

    return iconMap[icon.toLowerCase()] || 'checkmark-circle-outline';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    hotelImage: {
        width: SCREEN_WIDTH,
        height: 300,
    },
    imageCounter: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    imageCounterText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    favoriteButton: {
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AuthColors.primary,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    addressText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        flex: 1,
    },
    section: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    amenityItem: {
        width: (SCREEN_WIDTH - 80) / 4,
        alignItems: 'center',
    },
    amenityIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    amenityText: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    roomCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    roomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roomLeft: {
        flex: 1,
        marginRight: 12,
    },
    roomName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    roomInfo: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    roomInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    roomInfoText: {
        fontSize: 11,
        color: '#666',
    },
    roomFeatures: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    featureBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    featureBadgeText: {
        fontSize: 11,
        color: '#666',
    },
    roomRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    roomPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AuthColors.primary,
        marginBottom: 8,
    },
    roomDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    roomDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    roomDetailText: {
        fontSize: 12,
        color: '#666',
    },
    roomFeature: {
        fontSize: 12,
        color: '#666',
    },
    bookButton: {
        backgroundColor: AuthColors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    bookButtonDisabled: {
        backgroundColor: '#CCC',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    reviewCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewUserName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
    reviewRating: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewComment: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
});
