import { BookingData } from '@/types/booking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKING_KEY = 'hotelBooking';

export const bookingStorage = {
    // Save booking data
    async saveBooking(bookingData: BookingData): Promise<void> {
        try {
            const jsonData = JSON.stringify(bookingData);
            await AsyncStorage.setItem(BOOKING_KEY, jsonData);
            console.log('Booking data saved successfully');
        } catch (error) {
            console.error('Error saving booking data:', error);
            throw error;
        }
    },

    // Get booking data
    async getBooking(): Promise<BookingData | null> {
        try {
            const jsonData = await AsyncStorage.getItem(BOOKING_KEY);
            if (jsonData) {
                return JSON.parse(jsonData);
            }
            return null;
        } catch (error) {
            console.error('Error getting booking data:', error);
            return null;
        }
    },

    // Clear booking data (after successful payment)
    async clearBooking(): Promise<void> {
        try {
            await AsyncStorage.removeItem(BOOKING_KEY);
            console.log('Booking data cleared');
        } catch (error) {
            console.error('Error clearing booking data:', error);
            throw error;
        }
    },

    // Check if booking exists
    async hasBooking(): Promise<boolean> {
        try {
            const booking = await this.getBooking();
            return booking !== null;
        } catch (error) {
            return false;
        }
    },
};

export default bookingStorage;
