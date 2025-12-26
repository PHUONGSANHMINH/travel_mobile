// Recommendation API types
export interface HotelRecommendation {
    hotel_id: number;
    hybrid_score: number;
    content_score: number;
    collab_score: number;
    source_hotels?: number[];
    name: string;
    address: string;
    star_rating: number;
    average_rating: number;
    total_reviews: number;
    location: string;
    thumbnail: string;
    min_room_price: number;
    favorite?: boolean;
}

export interface RecommendationResponse {
    recommendations: HotelRecommendation[];
    message?: string;
}
