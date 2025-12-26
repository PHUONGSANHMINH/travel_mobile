import apiClient, { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/auth';
import { HotelDetailResponse } from '@/types/hotelDetail';

export const hotelDetailService = {
    /**
     * Get hotel detail by ID
     */
    async getHotelById(id: number): Promise<HotelDetailResponse> {
        try {
            const response = await apiClient.get<ApiResponse<HotelDetailResponse>>(
                API_ENDPOINTS.HOTELS.DETAIL(id)
            );
            return response.data.result;
        } catch (error: any) {
            console.error('Get hotel detail error:', error);
            throw error;
        }
    },
};

export default hotelDetailService;
