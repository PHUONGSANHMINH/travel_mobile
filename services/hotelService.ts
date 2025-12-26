import apiClient, { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/auth';

export const hotelService = {
    /**
     * Toggle favorite status for a hotel
     */
    async toggleFavorite(hotelId: number): Promise<boolean> {
        try {
            const response = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(
                API_ENDPOINTS.FAVORITES.TOGGLE(hotelId)
            );
            return response.data.result.isFavorite;
        } catch (error: any) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    },

    /**
     * Check if hotel is favorited
     */
    async checkFavoriteStatus(hotelId: number): Promise<boolean> {
        try {
            const response = await apiClient.get<ApiResponse<{ isFavorite: boolean }>>(
                API_ENDPOINTS.FAVORITES.CHECK(hotelId)
            );
            return response.data.result.isFavorite;
        } catch (error: any) {
            console.error('Check favorite status error:', error);
            throw error;
        }
    },
};

export default hotelService;
