// API Response wrapper
export interface ApiResponse<T> {
    code?: number;
    message?: string;
    result: T;
}

// Authentication Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
}

export interface LoginResponse {
    accessToken?: string;
    refreshToken?: string;
    accountId?: number;
    email?: string;
    roles?: any[];
    fullName?: string;
    id?: number;
    // Possible alternative field names from backend
    access_token?: string;
    refresh_token?: string;
    account_id?: number;
    // Backend typo: "accesToken" instead of "accessToken"
    accesToken?: string;
    // Full account object if backend returns differently
    account?: {
        id: number;
        email: string;
        roles?: any[];
    };
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface LogoutRequest {
    refreshToken: string;
}

export interface Account {
    id: number;
    email: string;
    fullName: string;
    phoneNumber?: string;
    roles: Role[];
    createdAt: string;
}

export interface Role {
    id: number;
    name: string;
}

// User Profile Types
export interface UserProfileResponse {
    id: number;
    email: string;
    fullName: string;
    phoneNumber?: string;
    avatar?: string;
    dateOfBirth?: string;
    address?: string;
}

export interface UpdateProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
}
