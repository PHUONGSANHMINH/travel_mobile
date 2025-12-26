import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

// Base URL
export const API_BASE_URL = 'https://tripgo-api.onrender.com/api';

// API Endpoints - Organized by feature
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh-token',
        LOGOUT: '/auth/logout',
    },

    // Public APIs - Home
    HOME: {
        LOCATIONS: '/public/home/locations',
        FLIGHTS: '/public/home/flights',
        HOTELS: '/public/home/hotels',
        VOUCHERS: '/public/home/vouchers',
        TOURS: '/public/home/tours',
        TOP_LOCATIONS: '/public/home/top-10-locations',
        SEARCH_LOCATION: '/public/home/search/location/hotel',
    },

    // Hotels
    HOTELS: {
        BASE: '/public/hotels',
        DETAIL: (id: number) => `/public/hotels/${id}`,
        SEARCH: '/public/hotels/search',
        BY_LOCATION: (locationId: number) => `/public/hotels/by-location/${locationId}`,
        SEARCH_BY_COUNTRY: (countryId: number) => `/public/hotels/search?countryId=${countryId}`,
    },

    // Flights
    FLIGHTS: {
        BASE: '/public/flights',
        DETAIL: (id: number) => `/public/flights/${id}`,
        CARDS: '/public/flights/cards',
        SEARCH: '/public/flights/search',
        SEAT_CLASSES: (id: number) => `/public/flights/${id}/seat-classes`,
    },

    // Tours
    TOURS: {
        BASE: '/public/tours',
        DETAIL: (id: number) => `/public/tours/${id}`,
        SEARCH: '/public/tours/search',
    },

    // Bookings
    BOOKING: {
        BASE: '/public/booking',
        MY_BOOKINGS: '/public/booking/my-bookings',
        MY_HOTELS: '/public/booking/my-hotels',
        MY_FLIGHTS: '/public/booking/my-flights',
        MY_CANCELLED: '/public/booking/my-cancelled',
        LOOKUP: (bookingCode: string) => `/public/booking/lookup/${bookingCode}`,
        DETAIL: (id: number) => `/public/booking/${id}`,
        CANCEL: (id: number) => `/public/booking/${id}/cancel`,
        CHECK_VOUCHERS: '/public/booking/vouchers/check-hotel',
    },

    // Payment
    PAYMENT: {
        CREATE_LINK: '/payment/create-payment-link',
        SUCCESS: '/payment/success',
        CANCEL: '/payment/cancel',
        WEBHOOK: '/payment/payos-webhook',
        CHECK_STATUS: (orderCode: number) => `/payment/check-status/${orderCode}`,
    },

    // Reviews
    REVIEWS: {
        BASE: '/public/reviews',
        DETAIL: (reviewId: number) => `/public/reviews/${reviewId}`,
        BY_HOTEL: (hotelId: number) => `/public/reviews/hotel/${hotelId}`,
        MY_REVIEW: (hotelId: number) => `/public/reviews/my-review/${hotelId}`,
    },

    // Favorites
    FAVORITES: {
        HOTELS: '/public/favorites/hotels',
        TOGGLE: (hotelId: number) => `/public/favorites/hotels/${hotelId}`,
        CHECK: (hotelId: number) => `/public/favorites/hotels/${hotelId}/check`,
        COUNT: '/public/favorites/hotels/count',
    },

    // User Profile
    USER: {
        PROFILE: '/public/user/profile',
    },

    // Vouchers
    VOUCHERS: {
        BASE: '/public/vouchers',
        DETAIL: (id: number) => `/public/vouchers/${id}`,
        HOTEL_PAGE: '/public/vouchers/hotel-page',
        FLIGHT_PAGE: '/public/vouchers/flight-page',
        TOUR_PAGE: '/public/vouchers/tour-page',
    },

    // Locations
    LOCATIONS: {
        BASE: '/public/locations',
        DETAIL: (id: number) => `/public/locations/${id}`,
        VN_LOCATIONS: '/public/locations/vn-location',
        COUNTRY_LOCATIONS: '/public/locations/country-location',
        DROPDOWN_LOCATIONS: '/public/locations/dropdown',
    },

    // Airlines
    AIRLINES: {
        BASE: '/public/airlines',
        DETAIL: (id: number) => `/public/airlines/${id}`,
    },

    // Airports
    AIRPORTS: {
        BASE: '/public/airports',
        DETAIL: (id: number) => `/public/airports/${id}`,
    },

    // Rooms
    ROOMS: {
        BASE: '/public/rooms',
        DETAIL: (id: number) => `/public/rooms/${id}`,
    },

    // Notifications
    NOTIFICATIONS: {
        BASE: '/notifications',
        DETAIL: (id: number) => `/notifications/${id}`,
        RECENT: '/notifications/recent',
        UNREAD_COUNT: '/notifications/unread-count',
        MARK_READ: (id: number) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
    },

    // Chat
    CHAT: {
        MESSAGES: (targetUserId: number) => `/messages/${targetUserId}`,
        MARK_READ: (senderId: number) => `/messages/mark-read/${senderId}`,
        ADMIN_CONVERSATIONS: '/chat/admin/conversations',
    },

    // Admin APIs (if needed later)
    ADMIN: {
        HOTELS: {
            BASE: '/admin/hotels',
            DETAIL: (id: number) => `/admin/hotels/${id}`,
            NAVIGATE: '/admin/hotels/navigate',
        },
        FLIGHTS: {
            BASE: '/admin/flights',
            DETAIL: (id: number) => `/admin/flights/${id}`,
        },
        TOURS: {
            BASE: '/admin/tours',
            DETAIL: (id: number) => `/admin/tours/${id}`,
        },
        VOUCHERS: {
            BASE: '/admin/vouchers',
            DETAIL: (id: number) => `/admin/vouchers/${id}`,
        },
        BOOKINGS: {
            BASE: '/admin/bookings',
            DETAIL: (id: number) => `/admin/bookings/${id}`,
        },
    },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Attach access token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('Error getting access token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    // Try to refresh token
                    const response = await axios.post(
                        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
                        { refreshToken }
                    );

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                        response.data.result;

                    // Save new tokens
                    await AsyncStorage.setItem('accessToken', newAccessToken);
                    await AsyncStorage.setItem('refreshToken', newRefreshToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                // TODO: Navigate to login screen
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
