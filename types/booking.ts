// Booking data types
export interface BookingData {
    hotel: {
        id: number;
        name: string;
        thumbnail: string;
        address: string;
        starRating: number;
    };
    room: {
        id: number;
        name: string;
        price: number;
        capacity: number;
        area: number;
    };
    checkInDate: string; // ISO date string
    checkOutDate: string; // ISO date string
    guests: number;
    nights: number;
    totalPrice: number;
}

// Payment request payload
export interface PaymentRequest {
    type: 'HOTEL';
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    paymentMethod: 'ATM' | 'CREDIT_CARD' | 'INTERNATIONAL_CARD' | 'MOMO';
    voucherCode?: string;
    quantity: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    passengers: PassengerInfo[];
}

export interface PassengerInfo {
    fullName: string;
    gender: 'MALE' | 'FEMALE';
    dob: string;
    nationality: string;
    phoneNumber: string;
    type: 'ADULT' | 'CHILD';
}

// Payment response from API
export interface PaymentResponse {
    code: number;
    message: string;
    result: {
        qrCode: string; // QR code data string
        checkoutUrl: string; // Payment link URL
        orderCode: string; // Order code for tracking
        paymentLinkId: string; // Payment ID
        amount: number;
        createdAt: string;
    };
}
