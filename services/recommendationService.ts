import { HotelRecommendation, RecommendationResponse } from '@/types/recommendationTypes';
import tokenStorage from './tokenStorage';

const RECOMMENDER_API_BASE = 'https://recommender-trip-go-api.onrender.com/api';

export const recommendationService = {
    /**
     * Get personalized hotel recommendations for a user
     */
    async getHotelRecommendations(userId?: number): Promise<HotelRecommendation[]> {
        try {
            // Get user ID from stored user info if not provided
            let finalUserId = userId;
            if (!finalUserId) {
                const userInfo = await tokenStorage.getUserInfo();
                finalUserId = userInfo?.id || 1; // Default to 1 if no user info
            }

            // Get access token
            const token = await tokenStorage.getAccessToken();

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Add authorization header if token exists
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(
                `${RECOMMENDER_API_BASE}/recommend/smart/${finalUserId}/`,
                {
                    method: 'GET',
                    headers: headers,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: RecommendationResponse = await response.json();

            console.log('Recommendations data:', data);
            console.log('User ID:', finalUserId);
            console.log('Token:', token ? 'Present' : 'Not found');

            return data.recommendations || [];
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return []; // Return empty array on error instead of throwing
        }
    },
};

export default recommendationService;
