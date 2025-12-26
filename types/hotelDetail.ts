// Hotel detail response types
export interface HotelDetailResponse {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    address: string;
    description: string;
    starRating: number;
    type: 'HOTEL' | 'RESORT' | 'HOSTEL' | 'VILLA' | 'APARTMENT';
    checkInTime: string;
    checkOutTime: string;
    contactPhone: string;
    contactEmail: string;
    averageRating: number;
    totalReviews: number;
    cleanlinessScore: number;
    comfortScore: number;
    locationScore: number;
    facilitiesScore: number;
    staffScore: number;
    pricePerNightFrom: number;
    priceRange: 'BUDGET' | 'MID_RANGE' | 'LUXURY' | 'PREMIUM';
    designStyle: 'MODERN' | 'TRADITIONAL' | 'MINIMALIST' | 'CLASSIC';
    location: LocationDetail;
    amenities: Amenity[];
    images: HotelImage[];
    rooms: Room[];
    reviews: Review[];
}

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

export interface Amenity {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    icon: string;
    isProminent: boolean;
}

export interface HotelImage {
    id: number;
    imageUrl: string;
    caption: string;
}

export interface Room {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    price: number;
    capacity: number;
    quantity: number;
    area: number;
    isAvailable: boolean;
}

export interface Review {
    id: number;
    createdAt: string;
    updatedAt: string;
    cleanlinessRating: number;
    comfortRating: number;
    locationRating: number;
    staffRating: number;
    facilitiesRating: number;
    averageRating: number;
    comment: string;
    user: ReviewUser;
}

export interface ReviewUser {
    id: number;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
