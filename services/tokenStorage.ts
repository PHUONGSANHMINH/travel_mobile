import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_INFO: 'userInfo',
};

export const tokenStorage = {
    // Save tokens
    async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
        try {
            await AsyncStorage.multiSet([
                [TOKEN_KEYS.ACCESS_TOKEN, accessToken],
                [TOKEN_KEYS.REFRESH_TOKEN, refreshToken],
            ]);
        } catch (error) {
            console.error('Error saving tokens:', error);
            throw error;
        }
    },

    // Get access token
    async getAccessToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },

    // Get refresh token
    async getRefreshToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    },

    // Save user info
    async saveUserInfo(userInfo: any): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEYS.USER_INFO, JSON.stringify(userInfo));
        } catch (error) {
            console.error('Error saving user info:', error);
            throw error;
        }
    },

    // Get user info
    async getUserInfo(): Promise<any | null> {
        try {
            const userInfoJson = await AsyncStorage.getItem(TOKEN_KEYS.USER_INFO);
            return userInfoJson ? JSON.parse(userInfoJson) : null;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    },

    // Clear all tokens and user info
    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                TOKEN_KEYS.ACCESS_TOKEN,
                TOKEN_KEYS.REFRESH_TOKEN,
                TOKEN_KEYS.USER_INFO,
            ]);
        } catch (error) {
            console.error('Error clearing tokens:', error);
            throw error;
        }
    },

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        try {
            const accessToken = await this.getAccessToken();
            return !!accessToken;
        } catch (error) {
            return false;
        }
    },
};

export default tokenStorage;
