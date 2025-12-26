import SectionHeader from '@/components/home/SectionHeader';
import { AuthColors } from '@/constants/AuthStyles';
import homeService from '@/services/homeService';
import hotelService from '@/services/hotelService';
import recommendationService from '@/services/recommendationService';
import { CountryLocation, HotelByLocationResponse, PopularDestination, VoucherResponse } from '@/types/hotelTypes';
import { HotelCardResponse, LocationDetail } from '@/types/location';
import { HotelRecommendation } from '@/types/recommendationTypes';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function HotelsScreen() {
    const [hotels, setHotels] = useState<HotelCardResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Recommendations
    const [recommendations, setRecommendations] = useState<HotelRecommendation[]>([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

    // Vouchers
    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    // VN Locations & Hotels
    const [vnLocations, setVnLocations] = useState<LocationDetail[]>([]);
    const [isLoadingVnLocations, setIsLoadingVnLocations] = useState(true);
    const [selectedVNLocation, setSelectedVNLocation] = useState<LocationDetail | null>(null);
    const [vnHotels, setVnHotels] = useState<HotelByLocationResponse[]>([]);
    const [loadingVnHotels, setLoadingVnHotels] = useState(false);

    // International Locations & Hotels
    const [intlLocations, setIntlLocations] = useState<CountryLocation[]>([]);
    const [selectedIntlLocation, setSelectedIntlLocation] = useState<CountryLocation | null>(null);
    const [intlHotels, setIntlHotels] = useState<HotelByLocationResponse[]>([]);
    const [loadingIntlHotels, setLoadingIntlHotels] = useState(false);

    // Popular Destinations
    const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(true);

    useEffect(() => {
        loadHotels();
        loadRecommendations();
        loadVouchers();
        loadVnLocations();
        loadIntlLocations();
        loadPopularDestinations();
    }, []);

    // Load VN hotels when location is selected
    useEffect(() => {
        if (selectedVNLocation) {
            loadVnHotels(selectedVNLocation.id);
        }
    }, [selectedVNLocation]);

    // Load international hotels when location is selected
    useEffect(() => {
        if (selectedIntlLocation) {
            loadIntlHotels(selectedIntlLocation.id);
        }
    }, [selectedIntlLocation]);

    const loadHotels = async () => {
        try {
            setIsLoading(true);
            const data = await homeService.getFeaturedHotels();
            setHotels(data);
        } catch (error) {
            console.error('Error loading hotels:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadRecommendations = async () => {
        try {
            setIsLoadingRecommendations(true);
            const data = await recommendationService.getHotelRecommendations();
            setRecommendations(data);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        } finally {
            setIsLoadingRecommendations(false);
        }
    };

    const loadVouchers = async () => {
        try {
            setLoadingVouchers(true);
            const data = await homeService.getVouchers();
            setVouchers(data.slice(0, 3)); // Show first 3 vouchers
        } catch (error) {
            console.error('Error loading vouchers:', error);
        } finally {
            setLoadingVouchers(false);
        }
    };

    const loadVnLocations = async () => {
        try {
            setIsLoadingVnLocations(true);
            const data = await homeService.getVietnamLocations();
            setVnLocations(data);
            // Auto-select first location
            if (data.length > 0) {
                setSelectedVNLocation(data[0]);
            }
        } catch (error) {
            console.error('Error loading VN locations:', error);
        } finally {
            setIsLoadingVnLocations(false);
        }
    };

    const loadVnHotels = async (locationId: number) => {
        try {
            setLoadingVnHotels(true);
            const data = await homeService.getHotelsByLocation(locationId);
            setVnHotels(data.slice(0, 10)); // Limit to 10 hotels
        } catch (error) {
            console.error('Error loading VN hotels:', error);
            setVnHotels([]);
        } finally {
            setLoadingVnHotels(false);
        }
    };

    const loadIntlLocations = async () => {
        try {
            const data = await homeService.getCountryLocations();
            // Filter out Vietnam
            const filtered = data.filter(loc => loc.name !== 'Việt Nam');
            console.log('International Locations:', filtered);
            setIntlLocations(filtered);
            // Auto-select first location
            if (filtered.length > 0) {
                setSelectedIntlLocation(filtered[0]);
            }
        } catch (error) {
            console.error('Error loading international locations:', error);
        }
    };

    const loadIntlHotels = async (countryId: number) => {
        try {
            setLoadingIntlHotels(true);
            const data = await homeService.getHotelsByCountry(countryId);
            setIntlHotels(data.hotels?.slice(0, 10) || []); // Limit to 10 hotels
        } catch (error) {
            console.error('Error loading international hotels:', error);
            setIntlHotels([]);
        } finally {
            setLoadingIntlHotels(false);
        }
    };

    const loadPopularDestinations = async () => {
        try {
            setLoadingDestinations(true);
            const data = await homeService.getPopularDestinations();
            // Filter destinations with hotels
            const filtered = data.filter(dest => dest.count && dest.count > 0);
            setPopularDestinations(filtered);
        } catch (error) {
            console.error('Error loading popular destinations:', error);
        } finally {
            setLoadingDestinations(false);
        }
    };

    const handleToggleFavorite = async (hotelId: number) => {
        try {
            // Check if user is logged in
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm khách sạn yêu thích!');
                return;
            }

            await hotelService.toggleFavorite(hotelId);

            // Update local state for recommendations
            setRecommendations(prev =>
                prev.map(hotel =>
                    hotel.hotel_id === hotelId
                        ? { ...hotel, favorite: !hotel.favorite }
                        : hotel
                )
            );

            // Update VN hotels
            setVnHotels(prev =>
                prev.map(hotel =>
                    hotel.id === hotelId ? { ...hotel, favorite: !hotel.favorite } : hotel
                )
            );

            // Update international hotels
            setIntlHotels(prev =>
                prev.map(hotel =>
                    hotel.id === hotelId ? { ...hotel, favorite: !hotel.favorite } : hotel
                )
            );

            Alert.alert('Thành công', 'Đã cập nhật danh sách yêu thích!');
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
        }
    };


    const renderHotelCard = (hotel: HotelCardResponse | HotelByLocationResponse, showFavorite = true) => (
        <TouchableOpacity
            key={hotel.id}
            style={styles.hotelCard}
            onPress={() => router.push(`/(detail)/hotel/${hotel.id}` as any)}
        >
            <Image source={{ uri: hotel.thumbnail }} style={styles.hotelImage} resizeMode="cover" />
            {showFavorite && (
                <TouchableOpacity
                    style={styles.favoriteIcon}
                    onPress={() => handleToggleFavorite(hotel.id)}
                >
                    <Ionicons
                        name={hotel.favorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={hotel.favorite ? '#FF6B6B' : '#fff'}
                    />
                </TouchableOpacity>
            )}

            <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={1}>
                    {hotel.name}
                </Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{hotel.starRating || 0}</Text>
                    <Text style={styles.reviews}>
                        ({'totalReviews' in hotel ? hotel.totalReviews : 0} đánh giá)
                    </Text>
                </View>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={12} color={AuthColors.textLight} />
                    <Text style={styles.location} numberOfLines={1}>
                        {hotel.locationName}
                    </Text>
                </View>
                <Text style={styles.price}>
                    {'minPrice' in hotel
                        ? `${hotel.minPrice.toLocaleString('vi-VN')} VND`
                        : 'Liên hệ'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderRecommendationCard = (recommendation: HotelRecommendation) => (
        <TouchableOpacity
            key={recommendation.hotel_id}
            style={styles.hotelCard}
            onPress={() => router.push(`/(detail)/hotel/${recommendation.hotel_id}` as any)}
        >
            <Image
                source={{ uri: recommendation.thumbnail }}
                style={styles.hotelImage}
                resizeMode="cover"
            />
            <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => handleToggleFavorite(recommendation.hotel_id)}
            >
                <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={1}>
                    {recommendation.name}
                </Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{recommendation.average_rating}</Text>
                    <Text style={styles.reviews}>({recommendation.total_reviews} đánh giá)</Text>
                </View>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={12} color={AuthColors.textLight} />
                    <Text style={styles.location} numberOfLines={1}>
                        {recommendation.location}
                    </Text>
                </View>
                <Text style={styles.price}>
                    {recommendation.min_room_price.toLocaleString('vi-VN')} VND
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Split recommendations into two columns
    const column1Recommendations = recommendations.filter((_, index) => index % 2 === 0);
    const column2Recommendations = recommendations.filter((_, index) => index % 2 === 1);

    // Split VN hotels into two columns
    const column1VnHotels = vnHotels.filter((_, index) => index % 2 === 0);
    const column2VnHotels = vnHotels.filter((_, index) => index % 2 === 1);

    // Split international hotels into two columns
    const column1IntlHotels = intlHotels.filter((_, index) => index % 2 === 0);
    const column2IntlHotels = intlHotels.filter((_, index) => index % 2 === 1);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header */}
            <ImageBackground
                source={require('@/assets/images/slider/4.png')}
                style={styles.header}
                resizeMode="cover"
            >
                <View style={styles.headerOverlay} />
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Khách sạn</Text>
                    <Text style={styles.headerSubtitle}>Hàng trăm khách sạn chờ bạn khám phá</Text>
                </View>
            </ImageBackground>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={AuthColors.textLight} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm khách sạn"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={AuthColors.textLight}
                        />
                    </View>
                </View>


                {/* Có thể bạn sẽ thích */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Có thể bạn sẽ thích"
                        icon={<Ionicons name="heart" size={20} color={AuthColors.primary} />}
                    />
                    {isLoadingRecommendations ? (
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size="small" color={AuthColors.primary} />
                            <Text style={styles.loadingText}>Đang tải gợi ý...</Text>
                        </View>
                    ) : recommendations.length > 0 ? (
                        <View style={styles.hotelGrid}>
                            <View style={styles.gridColumn}>
                                {column1Recommendations.slice(0, 2).map(renderRecommendationCard)}
                            </View>
                            <View style={styles.gridColumn}>
                                {column2Recommendations.slice(0, 2).map(renderRecommendationCard)}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>Không có gợi ý</Text>
                    )}
                </View>

                {/* Khám phá khách sạn nội địa */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitleLarge}>Khám phá khách sạn nội địa</Text>
                    </View>

                    {/* Location Tabs */}
                    {vnLocations.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.locationTabs}
                        >
                            {vnLocations.map(location => (
                                <TouchableOpacity
                                    key={location.id}
                                    style={[
                                        styles.locationTab,
                                        selectedVNLocation?.id === location.id && styles.locationTabActive,
                                    ]}
                                    onPress={() => setSelectedVNLocation(location)}
                                >
                                    <Text
                                        style={[
                                            styles.locationTabText,
                                            selectedVNLocation?.id === location.id &&
                                            styles.locationTabTextActive,
                                        ]}
                                    >
                                        {location.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {loadingVnHotels ? (
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size="small" color={AuthColors.primary} />
                            <Text style={styles.loadingText}>Đang tải khách sạn...</Text>
                        </View>
                    ) : vnHotels.length > 0 ? (
                        <View style={styles.hotelGrid}>
                            <View style={styles.gridColumn}>
                                {column1VnHotels.slice(0, 2).map(hotel => renderHotelCard(hotel))}
                            </View>
                            <View style={styles.gridColumn}>
                                {column2VnHotels.slice(0, 2).map(hotel => renderHotelCard(hotel))}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>
                            Không có khách sạn tại {selectedVNLocation?.name}
                        </Text>
                    )}
                </View>

                {/* Ví vụ khách sạn quốc tế */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitleLarge}>Vi vu khách sạn quốc tế</Text>
                    </View>

                    {/* Country Tabs */}
                    {intlLocations.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.locationTabs}
                        >
                            {intlLocations.map(location => (
                                <TouchableOpacity
                                    key={location.id}
                                    style={[
                                        styles.locationTab,
                                        selectedIntlLocation?.id === location.id &&
                                        styles.locationTabActive,
                                    ]}
                                    onPress={() => setSelectedIntlLocation(location)}
                                >
                                    <Text
                                        style={[
                                            styles.locationTabText,
                                            selectedIntlLocation?.id === location.id &&
                                            styles.locationTabTextActive,
                                        ]}
                                    >
                                        {location.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {loadingIntlHotels ? (
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size="small" color={AuthColors.primary} />
                            <Text style={styles.loadingText}>Đang tải khách sạn...</Text>
                        </View>
                    ) : intlHotels.length > 0 ? (
                        <View style={styles.hotelGrid}>
                            <View style={styles.gridColumn}>
                                {column1IntlHotels.slice(0, 2).map(hotel => renderHotelCard(hotel))}
                            </View>
                            <View style={styles.gridColumn}>
                                {column2IntlHotels.slice(0, 2).map(hotel => renderHotelCard(hotel))}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>
                            Không có khách sạn tại {selectedIntlLocation?.name}
                        </Text>
                    )}
                </View>

                {/* Những điểm đến phổ biến */}
                <View style={styles.sectionContainer}>
                    <SectionHeader title="Những điểm đến phổ biến" />
                    {loadingDestinations ? (
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size="small" color={AuthColors.primary} />
                        </View>
                    ) : popularDestinations.length > 0 ? (
                        <View style={styles.destinationGrid}>
                            {popularDestinations.slice(0, 4).map(destination => (
                                <TouchableOpacity
                                    key={destination.id}
                                    style={styles.destinationCard}
                                    onPress={() =>
                                        router.push(`/hotels?locationId=${destination.id}` as any)
                                    }
                                >
                                    <Image
                                        source={{ uri: destination.thumbnail }}
                                        style={styles.destinationImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.destinationOverlay}>
                                        <Text style={styles.destinationName}>{destination.name}</Text>
                                        <Text style={styles.destinationCount}>
                                            {destination.count} khách sạn
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>Không có điểm đến nào</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 50,
        paddingHorizontal: 20,
        position: 'relative',
        justifyContent: 'flex-start',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backButton: {
        position: 'absolute',
        top: (StatusBar.currentHeight || 40) + 5,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContent: {
        alignItems: 'center',
        marginTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#fff',
        opacity: 0.95,
        marginTop: 5,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 48,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: AuthColors.text,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitleLarge: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0292C6',
        flex: 1,
    },
    centerLoading: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: AuthColors.textLight,
        fontSize: 13,
    },
    emptyText: {
        textAlign: 'center',
        color: AuthColors.textLight,
        fontSize: 14,
        paddingVertical: 20,
    },
    // Voucher styles
    voucherList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    voucherCard: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    voucherContent: {
        flexDirection: 'row',
        padding: 12,
        gap: 12,
    },
    voucherIconBox: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voucherInfo: {
        flex: 1,
    },
    voucherName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: AuthColors.primary,
        marginBottom: 4,
    },
    voucherDescription: {
        fontSize: 12,
        color: AuthColors.textLight,
        lineHeight: 18,
    },
    voucherFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FAFAFA',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    voucherCodeBox: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderStyle: 'dashed',
    },
    voucherCode: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#424242',
    },
    copyButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    copyButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: AuthColors.primary,
    },
    // Location tabs
    locationTabs: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
    locationTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AuthColors.textLight,
        backgroundColor: '#fff',
    },
    locationTabActive: {
        backgroundColor: AuthColors.primary,
        borderColor: AuthColors.primary,
    },
    locationTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: AuthColors.text,
    },
    locationTabTextActive: {
        color: '#fff',
    },
    // Hotel grid
    hotelGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    gridColumn: {
        flex: 1,
        gap: 12,
    },
    hotelCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    hotelImage: {
        width: '100%',
        height: 120,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 6,
    },
    hotelInfo: {
        padding: 12,
    },
    hotelName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: AuthColors.text,
        marginBottom: 6,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
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
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 2,
    },
    location: {
        fontSize: 11,
        color: AuthColors.textLight,
        flex: 1,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: AuthColors.primary,
    },
    // Destination grid
    destinationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    destinationCard: {
        width: '48%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    destinationImage: {
        width: '100%',
        height: '100%',
    },
    destinationOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    destinationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    destinationCount: {
        fontSize: 11,
        color: '#fff',
        opacity: 0.9,
    },
});
