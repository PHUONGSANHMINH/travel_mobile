// Voucher types
export interface VoucherResponse {
    id: number;
    voucherName: string;
    voucherCode: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

// Popular destination with hotel count
export interface PopularDestination {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    type: 'COUNTRY' | 'CITY' | 'PROVINCE';
    count: number; // Number of hotels in this location
}

// Country location for international hotels
export interface CountryLocation {
    id: number;
    name: string;
    slug: string;
    thumbnail: string;
    type: 'COUNTRY';
    createdAt: string;
    updatedAt: string;
}

// Hotel search response by country
export interface HotelSearchResponse {
    hotels: HotelByCountryResponse[];
    totalElements: number;
}

export interface HotelByCountryResponse {
    id: number;
    name: string;
    address: string;
    starRating: number;
    locationName: string;
    thumbnail: string;
    minPrice: number;
    hotelType: string;
    favorite?: boolean;
}

// Hotel by location response (for VN locations)
export interface HotelByLocationResponse {
    id: number;
    name: string;
    address: string;
    starRating: number;
    locationName: string;
    thumbnail: string;
    minPrice: number;
    hotelType: string;
    favorite?: boolean;
}
