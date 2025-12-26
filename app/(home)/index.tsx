import HomeHeader from '@/components/home/HomeHeader';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import DestinationItem from '@/components/home/DestinationItem';
import SectionHeader from '@/components/home/SectionHeader';
import ServiceCard from '@/components/home/ServiceCard';
import { AuthColors } from '@/constants/AuthStyles';
import homeService from '@/services/homeService';
import { FlightCardResponse, HotelCardResponse, LocationCardResponse, TourCardResponse } from '@/types/location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
    const [locations, setLocations] = useState<LocationCardResponse[]>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [flights, setFlights] = useState<FlightCardResponse[]>([]);
    const [isLoadingFlights, setIsLoadingFlights] = useState(true);
    const [hotels, setHotels] = useState<HotelCardResponse[]>([]);
    const [isLoadingHotels, setIsLoadingHotels] = useState(true);
    const [tours, setTours] = useState<TourCardResponse[]>([]);
    const [isLoadingTours, setIsLoadingTours] = useState(true);

    useEffect(() => {
        loadLocations();
        loadFlights();
        loadHotels();
        loadTours();
    }, []);

    const loadLocations = async () => {
        try {
            setIsLoadingLocations(true);
            const data = await homeService.getFeaturedLocations();
            setLocations(data);
        } catch (error) {
            console.error('Error loading locations:', error);
        } finally {
            setIsLoadingLocations(false);
        }
    };

    const loadFlights = async () => {
        try {
            setIsLoadingFlights(true);
            const data = await homeService.getFeaturedFlights();
            setFlights(data);
        } catch (error) {
            console.error('Error loading flights:', error);
        } finally {
            setIsLoadingFlights(false);
        }
    };

    const loadHotels = async () => {
        try {
            setIsLoadingHotels(true);
            const data = await homeService.getFeaturedHotels();
            setHotels(data);
        } catch (error) {
            console.error('Error loading hotels:', error);
        } finally {
            setIsLoadingHotels(false);
        }
    };

    const loadTours = async () => {
        try {
            setIsLoadingTours(true);
            const data = await homeService.getFeaturedTours(0, 4);
            setTours(data);
        } catch (error) {
            console.error('Error loading tours:', error);
        } finally {
            setIsLoadingTours(false);
        }
    };

    // Split locations into two columns for grid layout (limit to 4 items)
    const limitedLocations = locations.slice(0, 4);
    const column1 = limitedLocations.filter((_, index) => index % 2 === 0);
    const column2 = limitedLocations.filter((_, index) => index % 2 === 1);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <HomeHeader />

                {/* Banner Section - Enjoyment Combo */}
                <View style={styles.sectionContainer}>
                    <View style={styles.promoBannerContainer}>
                        <Image
                            source={require('@/assets/images/new/04.jpg')}
                            style={styles.promoBannerImage}
                            resizeMode="cover"
                        />
                        {/* If we wanted to code the text overlay we could, but an image is safer for now given the complexity of the design image */}
                    </View>
                </View>

                {/* Exclusive Offers */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Ưu đãi độc quyền dành cho bạn"
                    />
                    <Text style={styles.sectionSubtitle}>Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn nhất</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {/* Offer 1 */}
                        <View style={styles.offerCard}>
                            <View style={styles.offerIconContainer}>
                                <Ionicons name="business" size={24} color={AuthColors.primary} />
                            </View>
                            <View style={styles.offerContent}>
                                <Text style={styles.offerTitle}>Giảm đến 200.000đ Khách sạn Nội địa</Text>
                                <Text style={styles.offerDesc}>Giảm 5% tối đa 200.000đ. Đặt tối thiểu 1tr5.</Text>
                                <Text style={styles.offerNote}>Áp dụng tất cả khách sạn.</Text>

                                <View style={styles.couponRow}>
                                    <View style={styles.couponCodeContainer}>
                                        <Text style={styles.couponCode}>KSNOIDIA200</Text>
                                    </View>
                                    <TouchableOpacity style={styles.copyButton}>
                                        <Text style={styles.copyButtonText}>Sao chép</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Decorative circles */}
                            <View style={[styles.circle, styles.circleLeft]} />
                            <View style={[styles.circle, styles.circleRight]} />
                            <View style={styles.dashedLine} />
                        </View>

                        {/* Offer 2 */}
                        <View style={styles.offerCard}>
                            <View style={styles.offerIconContainer}>
                                <Ionicons name="business" size={24} color={AuthColors.primary} />
                            </View>
                            <View style={styles.offerContent}>
                                <Text style={styles.offerTitle}>Giảm đến 500.000đ Khách sạn Quốc tế</Text>
                                <Text style={styles.offerDesc}>Giảm 7% tối đa 500.000đ. Đặt tối thiểu 3tr.</Text>
                                <Text style={styles.offerNote}>Áp dụng khách sạn quốc tế.</Text>

                                <View style={styles.couponRow}>
                                    <View style={styles.couponCodeContainer}>
                                        <Text style={styles.couponCode}>KSQUOCTE500</Text>
                                    </View>
                                    <TouchableOpacity style={styles.copyButton}>
                                        <Text style={styles.copyButtonText}>Sao chép</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.circle, styles.circleLeft]} />
                            <View style={[styles.circle, styles.circleRight]} />
                            <View style={styles.dashedLine} />
                        </View>
                    </ScrollView>
                </View>
                {/* Destinations Section */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Địa điểm không thể bỏ lỡ"
                        subtitle="Lên kế hoạch cho chuyến đi tiếp theo của bạn đến những địa danh này"
                        icon={<Ionicons name="map" size={24} color={AuthColors.primary} />}
                    />
                    {isLoadingLocations ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <ActivityIndicator size="large" color={AuthColors.primary} />
                            <Text style={{ marginTop: 12, color: AuthColors.textLight }}>Đang tải địa điểm...</Text>
                        </View>
                    ) : locations.length === 0 ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <Text style={{ color: AuthColors.textLight }}>Không có địa điểm nào</Text>
                        </View>
                    ) : (
                        <View style={styles.destinationsGrid}>
                            {/* Column 1 */}
                            <View style={styles.gridColumn}>
                                {column1.map((location, index) => (
                                    <DestinationItem
                                        key={location.id}
                                        name={location.name}
                                        imageSource={{ uri: location.thumbnail }}
                                        style={{ height: index % 2 === 0 ? 220 : 150 }}
                                    />
                                ))}
                            </View>
                            {/* Column 2 */}
                            <View style={styles.gridColumn}>
                                {column2.map((location, index) => (
                                    <DestinationItem
                                        key={location.id}
                                        name={location.name}
                                        imageSource={{ uri: location.thumbnail }}
                                        style={{ height: index % 2 === 0 ? 150 : 220 }}
                                    />
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Best Flight Deals */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Vé máy bay giá tốt nhất"
                        subtitle="Khám phá thế giới với vé bay giá tốt nhất, bay là thích!"
                        icon={<Ionicons name="airplane" size={24} color={AuthColors.primary} />}
                    />
                    {isLoadingFlights ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <ActivityIndicator size="large" color={AuthColors.primary} />
                            <Text style={{ marginTop: 12, color: AuthColors.textLight }}>Đang tải chuyến bay...</Text>
                        </View>
                    ) : flights.length === 0 ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <Text style={{ color: AuthColors.textLight }}>Không có chuyến bay nào</Text>
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                            {flights.map((flight) => (
                                <ServiceCard
                                    key={flight.id}
                                    title={`${flight.fromLocation} - ${flight.toLocation}`}
                                    price={`${flight.minPrice.toLocaleString('vi-VN')} VND`}
                                    imageSource={{ uri: flight.image }}
                                    airlineLogo={flight.airlineLogo}
                                    pricePrefix="Giá chỉ từ"
                                />
                            ))}
                        </ScrollView>
                    )}
                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <TouchableOpacity style={styles.seeMoreButton}>
                            <Text style={styles.seeMoreButtonText}>Xem thêm</Text>
                            <Ionicons name="chevron-forward" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hotel Deals */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Khách sạn giá ưu đãi"
                        subtitle="Trải nghiệm lưu trú chất lượng với mức giá tối ưu"
                        icon={<Ionicons name="business" size={24} color={AuthColors.primary} />}
                    />
                    {isLoadingHotels ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <ActivityIndicator size="large" color={AuthColors.primary} />
                            <Text style={{ marginTop: 12, color: AuthColors.textLight }}>Đang tải khách sạn...</Text>
                        </View>
                    ) : hotels.length === 0 ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <Text style={{ color: AuthColors.textLight }}>Không có khách sạn nào</Text>
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                            {hotels.map((hotel) => (
                                <ServiceCard
                                    key={hotel.id}
                                    title={hotel.name}
                                    location={hotel.locationName}
                                    price={`${hotel.minPrice.toLocaleString('vi-VN')} VND`}
                                    rating={hotel.starRating}
                                    reviews={hotel.totalReviews}
                                    imageSource={{ uri: hotel.thumbnail }}
                                />
                            ))}
                        </ScrollView>
                    )}
                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <TouchableOpacity
                            style={styles.seeMoreButton}
                            onPress={() => router.push('/(more)/hotel')}
                        >
                            <Text style={styles.seeMoreButtonText}>Xem thêm</Text>
                            <Ionicons name="chevron-forward" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Featured Tours */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Tour nổi bật hôm nay"
                        subtitle="Giá tốt - lịch trình linh hoạt - trải nghiệm tuyệt vời"
                        icon={<Ionicons name="binoculars" size={24} color={AuthColors.primary} />}
                    />
                    {isLoadingTours ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <ActivityIndicator size="large" color={AuthColors.primary} />
                            <Text style={{ marginTop: 12, color: AuthColors.textLight }}>Đang tải tour...</Text>
                        </View>
                    ) : tours.length === 0 ? (
                        <View style={{ alignItems: 'center', padding: 40 }}>
                            <Text style={{ color: AuthColors.textLight }}>Không có tour nào</Text>
                        </View>
                    ) : (
                        <View style={styles.tourGrid}>
                            {tours.map((tour) => (
                                <ServiceCard
                                    key={tour.id}
                                    title={tour.title}
                                    location={tour.destinationName}
                                    price={`${tour.price.toLocaleString('vi-VN')} VND`}
                                    imageSource={{ uri: tour.thumbnail }}
                                    duration={tour.duration}
                                    capacity={tour.transportation}
                                    style={styles.tourCardGrid}
                                />
                            ))}
                        </View>
                    )}
                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <TouchableOpacity style={styles.seeMoreButton}>
                            <Text style={styles.seeMoreButtonText}>Xem thêm</Text>
                            <Ionicons name="chevron-forward" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Testimonials */}
                <View style={styles.sectionContainer}>
                    <SectionHeader title="Khách hàng nói gì về chúng tôi" />
                    <View style={styles.testimonialContainer}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <View style={styles.testimonialContent}>
                            <Text style={styles.customerName}>Nguyễn Thị Minh Anh</Text>
                            <View style={styles.ratingWrapper}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Ionicons key={i} name="star" size={14} color="#FFD700" />
                                ))}
                            </View>
                            <Text style={styles.comment}>
                                "Trải nghiệm tuyệt vời! Giá tour rất phải chăng và nhân viên hỗ trợ nhiệt tình từ đội ngũ tư vấn."
                            </Text>
                        </View>
                    </View>
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
    scrollContent: {
        paddingBottom: 100, // Space for floating tab bar
    },
    sectionContainer: {
        marginBottom: 24,
    },
    horizontalScroll: {
        paddingLeft: 20,
    },
    bannerContainer: {
        width: 300,
        height: 150,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    gridContainer: {
        paddingHorizontal: 20,
    },
    destinationsGrid: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        gap: 0,
    },
    gridColumn: {
        flex: 1,
    },
    gridRow: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    testimonialContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    testimonialContent: {
        flex: 1,
    },
    customerName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: AuthColors.text,
        marginBottom: 4,
    },
    ratingWrapper: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    comment: {
        fontSize: 12,
        color: AuthColors.textLight,
        fontStyle: 'italic',
    },

    // New Styles
    promoBannerContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 200,
        marginHorizontal: 20,
        height: 160,
        backgroundColor: '#f0f0f0',
    },
    promoBannerImage: {
        width: '100%',
        height: '100%',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: AuthColors.textLight,
        marginHorizontal: 20,
        marginTop: -16, // Check this spacing
        marginBottom: 16,
    },
    offerCard: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        position: 'relative',
        overflow: 'hidden',
    },
    offerIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0F7FA', // Light cyan
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    offerContent: {
        flex: 1,
    },
    offerTitle: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#333',
        marginBottom: 4,
    },
    offerDesc: {
        fontSize: 11,
        color: '#666',
        marginBottom: 4,
    },
    offerNote: {
        fontSize: 10,
        color: '#999',
        marginBottom: 8,
    },
    couponRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    couponCodeContainer: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    couponCode: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333',
    },
    copyButton: {
        backgroundColor: '#E0F7FA',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    copyButtonText: {
        fontSize: 11,
        color: AuthColors.primary,
        fontWeight: 'bold',
    },
    circle: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F5F5F5', // Match screen background
        top: '50%',
        marginTop: -10,
    },
    circleLeft: {
        left: -10,
    },
    circleRight: {
        right: -10,
    },
    dashedLine: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 10,
        // height: 1,
        // borderWidth: 1,
        // borderColor: '#ddd',
        // borderStyle: 'dashed',
        // zIndex: -1,
    },
    seeMoreButton: {
        backgroundColor: AuthColors.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeMoreButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    seeMoreButtonOutline: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AuthColors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeMoreButtonTextOutline: {
        color: AuthColors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    tourGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12, // Adjusted to match margin
    },
    tourCardGrid: {
        width: '45.5%', // Approx half width minus margins
        marginBottom: 16,
    },
});
