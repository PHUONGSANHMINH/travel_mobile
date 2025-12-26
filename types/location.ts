// Location types for home page
export interface LocationCardResponse {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
}

// Flight types for home page
export interface FlightCardResponse {
    id: number;
    flightNumber: string;
    airlineLogo: string;
    airlineName: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    fromLocation: string;
    toLocation: string;
    minPrice: number;
    image: string;
}

// Hotel types for home page
export interface HotelCardResponse {
    id: number;
    name: string;
    address: string;
    starRating: number;
    totalReviews: number;
    locationName: string;
    thumbnail: string;
    minPrice: number;
    hotelType: string;
    isFavorite: boolean;
    favorite?: boolean;
}

// Tour types for home page
export interface TourCardResponse {
    id: number;
    title: string;
    slug: string;
    duration: string;
    startLocationName: string;
    destinationName: string;
    thumbnail: string;
    price: number;
    transportation: string;
}

// Paginated response wrapper
export interface PagedResponse<T> {
    totalPages: number;
    totalElements: number;
    first: boolean;
    numberOfElements: number;
    last: boolean;
    size: number;
    content: T[];
    number: number;
    empty: boolean;
}

// Location detail type for VN locations
export interface LocationDetail {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    type: 'COUNTRY' | 'CITY' | 'PROVINCE';
}
