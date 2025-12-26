import apiClient, { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/auth';
import { CountryLocation, HotelByLocationResponse, HotelSearchResponse, PopularDestination, VoucherResponse } from '@/types/hotelTypes';
import { FlightCardResponse, HotelCardResponse, LocationCardResponse, LocationDetail, PagedResponse, TourCardResponse } from '@/types/location';

export const homeService = {
    /**
     * Get featured locations for home page
     */
    async getFeaturedLocations(): Promise<LocationCardResponse[]> {
        try {
            const response = await apiClient.get<ApiResponse<LocationCardResponse[]>>(
                API_ENDPOINTS.HOME.LOCATIONS
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get featured locations error:', error);
            throw error;
        }
    },

    /**
     * Get featured flights for home page
     */
    async getFeaturedFlights(): Promise<FlightCardResponse[]> {
        try {
            const response = await apiClient.get<ApiResponse<FlightCardResponse[]>>(
                API_ENDPOINTS.HOME.FLIGHTS
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get featured flights error:', error);
            throw error;
        }
    },

    /**
     * Get featured hotels for home page
     */
    async getFeaturedHotels(): Promise<HotelCardResponse[]> {
        try {
            const response = await apiClient.get<ApiResponse<HotelCardResponse[]>>(
                API_ENDPOINTS.HOME.HOTELS
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get featured hotels error:', error);
            throw error;
        }
    },

    /**
     * Get featured tours for home page
     */
    async getFeaturedTours(page: number = 0, size: number = 4): Promise<TourCardResponse[]> {
        try {
            const response = await apiClient.get<ApiResponse<PagedResponse<TourCardResponse>>>(
                API_ENDPOINTS.TOURS.BASE,
                {
                    params: {
                        page,
                        size,
                        sortBy: 'id',
                        sortDir: 'desc'
                    }
                }
            );
            return response.data.result.content;
        } catch (error: any) {
            console.error('Get featured tours error:', error);
            throw error;
        }
    },

    /**
     * Get Vietnam locations for domestic hotels section
     */
    async getVietnamLocations(): Promise<LocationDetail[]> {
        try {
            const response = await apiClient.get<ApiResponse<LocationDetail[]>>(
                API_ENDPOINTS.LOCATIONS.VN_LOCATIONS
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get Vietnam locations error:', error);
            throw error;
        }
    },

    /**
     * Get vouchers for hotel page
     */
    async getVouchers(): Promise<VoucherResponse[]> {
        try {
            const response = await apiClient.get<ApiResponse<VoucherResponse[]>>(
                API_ENDPOINTS.HOME.VOUCHERS
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get vouchers error:', error);
            throw error;
        }
    },

    /**
     * Get country locations for international hotels
     */
    async getCountryLocations(): Promise<CountryLocation[]> {
        try {
            const response = await apiClient.get<ApiResponse<PopularDestination[]>>(
                API_ENDPOINTS.LOCATIONS.DROPDOWN_LOCATIONS
            );
            // Filter to get only countries
            const countries = response.data.result
                .filter(loc => loc.type === 'COUNTRY')
                .map(loc => ({
                    id: loc.id,
                    name: loc.name,
                    slug: loc.slug,
                    thumbnail: loc.thumbnail,
                    type: loc.type as 'COUNTRY',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }));
            return countries;
        } catch (error: any) {
            console.error('Get country locations error:', error);
            // Return empty array instead of throwing to prevent app crash
            return [];
        }
    },

    /**
     * Get popular destinations with hotel counts
     */
    async getPopularDestinations(): Promise<PopularDestination[]> {
        try {
            const response = await apiClient.get<ApiResponse<PopularDestination[]>>(
                API_ENDPOINTS.LOCATIONS.DROPDOWN_LOCATIONS
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get popular destinations error:', error);
            throw error;
        }
    },

    /**
     * Get hotels by Vietnam location ID
     */
    async getHotelsByLocation(locationId: number): Promise<HotelByLocationResponse[]> {
        try {
            const response = await apiClient.get<ApiResponse<HotelByLocationResponse[]>>(
                API_ENDPOINTS.HOTELS.BY_LOCATION(locationId)
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get hotels by location error:', error);
            throw error;
        }
    },

    /**
     * Get hotels by country ID
     */
    async getHotelsByCountry(countryId: number): Promise<HotelSearchResponse> {
        try {
            const response = await apiClient.get<ApiResponse<HotelSearchResponse>>(
                API_ENDPOINTS.HOTELS.SEARCH_BY_COUNTRY(countryId)
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get hotels by country error:', error);
            throw error;
        }
    },
};

export default homeService;
