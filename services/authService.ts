import apiClient, { API_ENDPOINTS } from '@/constants/api';
import {
    Account,
    ApiResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RefreshTokenRequest,
    RegisterRequest,
} from '@/types/auth';
import tokenStorage from './tokenStorage';

export const authService = {
    /**
     * Login with email and password
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>(
                API_ENDPOINTS.AUTH.LOGIN,
                { email, password } as LoginRequest
            );

            console.log('=== LOGIN API RESPONSE DEBUG ===');
            console.log('Full Response:', JSON.stringify(response.data, null, 2));
            console.log('Status:', response.status);

            const loginData = response.data.result;
            console.log('Login Result Data:', JSON.stringify(loginData, null, 2));

            // Handle different possible response structures
            // NOTE: Backend has a typo - returns "accesToken" instead of "accessToken"
            const accessToken = loginData.accessToken || loginData.access_token || (loginData as any).accesToken;
            const refreshToken = loginData.refreshToken || loginData.refresh_token;
            const accountId = loginData.accountId || loginData.account_id || (loginData as any).id;
            const userEmail = loginData.email || loginData.account?.email || email;
            const userRoles = loginData.roles?.map((r: any) => r.name || r) || loginData.account?.roles?.map((r: any) => r.name || r) || [];

            console.log('Extracted Tokens:', {
                accessToken: accessToken ? 'EXISTS' : 'MISSING',
                refreshToken: refreshToken ? 'EXISTS' : 'MISSING',
                accountId,
                email: userEmail
            });

            // Check if tokens exist
            if (!accessToken || !refreshToken) {
                console.error('❌ Missing tokens in response!');
                console.error('Response structure:', loginData);
                throw new Error('Phản hồi từ server không chứa access token hoặc refresh token. Vui lòng kiểm tra console để biết chi tiết.');
            }

            // Save tokens to storage
            await tokenStorage.saveTokens(accessToken, refreshToken);

            // Save user info
            await tokenStorage.saveUserInfo({
                accountId,
                email: userEmail,
                roles: userRoles,
            });

            console.log('✅ Login successful, tokens saved');

            return {
                accessToken,
                refreshToken,
                accountId: accountId!,
                email: userEmail,
                roles: userRoles,
            } as LoginResponse;
        } catch (error: any) {
            console.error('❌ Login error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            throw error;
        }
    },

    /**
     * Register new account
     */
    async register(registerData: RegisterRequest): Promise<Account> {
        try {
            const response = await apiClient.post<ApiResponse<Account>>(
                API_ENDPOINTS.AUTH.REGISTER,
                registerData
            );

            return response.data.result;
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        }
    },

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<LoginResponse> {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>(
                API_ENDPOINTS.AUTH.REFRESH_TOKEN,
                { refreshToken } as RefreshTokenRequest
            );

            const newTokens = response.data.result;

            // Extract tokens with fallback
            const accessToken = newTokens.accessToken || newTokens.access_token;
            const newRefreshToken = newTokens.refreshToken || newTokens.refresh_token;

            if (!accessToken || !newRefreshToken) {
                throw new Error('Failed to refresh token: missing tokens in response');
            }

            // Save new tokens
            await tokenStorage.saveTokens(accessToken, newRefreshToken);

            return newTokens;
        } catch (error: any) {
            console.error('Refresh token error:', error);
            throw error;
        }
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        try {
            const refreshToken = await tokenStorage.getRefreshToken();
            const accessToken = await tokenStorage.getAccessToken();

            if (refreshToken && accessToken) {
                // Call logout API
                await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
                    refreshToken,
                } as LogoutRequest);
            }
        } catch (error: any) {
            console.error('Logout API error:', error);
            // Continue with local logout even if API fails
        } finally {
            // Always clear local storage
            await tokenStorage.clearAll();
        }
    },

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        return await tokenStorage.isAuthenticated();
    },

    /**
     * Get current user info from storage
     */
    async getCurrentUser(): Promise<any> {
        return await tokenStorage.getUserInfo();
    },
};

export default authService;
