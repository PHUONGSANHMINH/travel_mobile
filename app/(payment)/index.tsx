import PaymentQRModal from '@/components/PaymentQRModal';
import { AuthColors } from '@/constants/AuthStyles';
import bookingStorage from '@/services/bookingStorage';
import { BookingData } from '@/types/booking';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function PaymentScreen() {
    const [promoCode, setPromoCode] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // Passenger information
    const [title, setTitle] = useState('Ông');
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(2000, 0, 1));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    // Booking data from AsyncStorage
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isLoadingBooking, setIsLoadingBooking] = useState(true);

    // QR Modal
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrData, setQrData] = useState('');

    // Load booking data
    useEffect(() => {
        loadBookingData();
    }, []);

    const loadBookingData = async () => {
        try {
            setIsLoadingBooking(true);
            const data = await bookingStorage.getBooking();
            if (data) {
                setBookingData(data);
            } else {
                Alert.alert(
                    'Không có thông tin đặt phòng',
                    'Vui lòng chọn phòng từ trang chi tiết khách sạn.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }
        } catch (error) {
            console.error('Error loading booking:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin đặt phòng');
        } finally {
            setIsLoadingBooking(false);
        }
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day} /${month}/${year} `;
    };

    const availableVouchers = ['TMHF10', 'TEFAWH', 'TMH0620'];

    const handlePayment = () => {
        if (!agreeToTerms) {
            Alert.alert('Thông báo', 'Vui lòng đồng ý với điều khoản và chính sách');
            return;
        }

        // Validate contact info
        if (!fullName || !phoneNumber || !email || !dateOfBirth) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (selectedPaymentMethod === 'card') {
            if (!cardNumber || !expiryDate || !cvv) {
                Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin thẻ');
                return;
            }
        }

        // Mock QR data - in real app this would come from payment API
        const mockQRData = `MOMO | ${bookingData?.hotel.name}| ${bookingData?.totalPrice}| ${Date.now()} `;
        setQrData(mockQRData);
        setShowQRModal(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={AuthColors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
                <View style={{ width: 24 }} />
            </View>

            {isLoadingBooking ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={AuthColors.primary} />
                    <Text style={styles.loadingText}>Đang tải thông tin...</Text>
                </View>
            ) : !bookingData ? (
                <View style={styles.loadingContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#999" />
                    <Text style={styles.loadingText}>Không tìm thấy thông tin đặt phòng</Text>
                    <TouchableOpacity
                        style={styles.paymentButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.paymentButtonText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Booking Summary Card */}
                    <View style={styles.bookingCard}>
                        <Image
                            source={{ uri: bookingData.hotel.thumbnail }}
                            style={styles.hotelImage}
                            resizeMode="cover"
                        />
                        <View style={styles.bookingInfo}>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.ratingText}>{bookingData.hotel.starRating}</Text>
                            </View>
                            <Text style={styles.hotelName}>{bookingData.hotel.name}</Text>
                            <Text style={styles.roomType}>{bookingData.room.name}</Text>

                            <View style={styles.bookingDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Check-in</Text>
                                    <Text style={styles.detailValue}>{formatDate(bookingData.checkInDate)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Check-out</Text>
                                    <Text style={styles.detailValue}>{formatDate(bookingData.checkOutDate)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Số lượng</Text>
                                    <Text style={styles.detailValue}>{bookingData.guests} người</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Passenger Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin hành khách lưu trú</Text>

                        {/* Title (Danh xưng) */}
                        <Text style={styles.label}>
                            Danh xưng <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={title}
                                onValueChange={(itemValue) => setTitle(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Ông" value="Ông" />
                                <Picker.Item label="Bà" value="Bà" />
                                <Picker.Item label="Cô" value="Cô" />
                            </Picker>
                        </View>

                        {/* Name and DOB Row */}
                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>
                                    Họ và tên <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Họ và tên"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholderTextColor={AuthColors.textLight}
                                />
                            </View>

                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>
                                    Ngày sinh <Text style={styles.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.datePickerText}>
                                        {dateOfBirth.toLocaleDateString('vi-VN')}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color={AuthColors.primary} />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={dateOfBirth}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={(event: any, selectedDate?: Date) => {
                                            setShowDatePicker(Platform.OS === 'ios');
                                            if (selectedDate) {
                                                setDateOfBirth(selectedDate);
                                            }
                                        }}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>
                        </View>

                        {/* Phone and Email Row */}
                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>
                                    Số điện thoại <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Số điện thoại"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    placeholderTextColor={AuthColors.textLight}
                                />
                            </View>

                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>
                                    Email <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor={AuthColors.textLight}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Payment Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thanh toán</Text>

                        {/* Promo Code */}
                        <Text style={styles.label}>Mã khuyến mãi/Voucher</Text>
                        <View style={styles.promoCodeRow}>
                            <TextInput
                                style={styles.promoInput}
                                placeholder="Nhập mã khuyến mãi"
                                value={promoCode}
                                onChangeText={setPromoCode}
                                placeholderTextColor={AuthColors.textLight}
                            />
                            <TouchableOpacity style={styles.applyButton}>
                                <Text style={styles.applyButtonText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Available Vouchers */}
                        <View style={styles.voucherChips}>
                            {availableVouchers.map((voucher) => (
                                <View key={voucher} style={styles.voucherChip}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                    <Text style={styles.voucherText}>{voucher}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Payment Method Selection */}
                        <View style={styles.paymentMethods}>
                            <TouchableOpacity
                                style={[
                                    styles.paymentMethodButton,
                                    selectedPaymentMethod === 'momo' && styles.paymentMethodActive
                                ]}
                                onPress={() => setSelectedPaymentMethod('momo')}
                            >
                                <Text style={[
                                    styles.paymentMethodText,
                                    selectedPaymentMethod === 'momo' && styles.paymentMethodTextActive
                                ]}>
                                    MOMO
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.paymentMethodButton,
                                    selectedPaymentMethod === 'card' && styles.paymentMethodActive
                                ]}
                                onPress={() => setSelectedPaymentMethod('card')}
                            >
                                <Text style={[
                                    styles.paymentMethodText,
                                    selectedPaymentMethod === 'card' && styles.paymentMethodTextActive
                                ]}>
                                    Thẻ quốc tế
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.paymentMethodButton,
                                    selectedPaymentMethod === 'bank' && styles.paymentMethodActive
                                ]}
                                onPress={() => setSelectedPaymentMethod('bank')}
                            >
                                <Text style={[
                                    styles.paymentMethodText,
                                    selectedPaymentMethod === 'bank' && styles.paymentMethodTextActive
                                ]}>
                                    Ngân hàng
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Card Details Form */}
                        {selectedPaymentMethod === 'card' && (
                            <>
                                <Text style={styles.label}>Số thẻ</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    keyboardType="numeric"
                                    maxLength={19}
                                    placeholderTextColor={AuthColors.textLight}
                                />

                                <Text style={styles.label}>Ngày hết hạng</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChangeText={setExpiryDate}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    placeholderTextColor={AuthColors.textLight}
                                />

                                <Text style={styles.label}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1234"
                                    value={cvv}
                                    onChangeText={setCvv}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                    placeholderTextColor={AuthColors.textLight}
                                />
                            </>
                        )}

                        {/* Terms and Conditions */}
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                        >
                            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                                {agreeToTerms && (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                )}
                            </View>
                            <Text style={styles.checkboxText}>
                                Tôi đồng ý với{' '}
                                <Text style={styles.linkText}>điều khoản và chính sách</Text>
                                {' '}hoàn vé
                            </Text>
                        </TouchableOpacity>

                        {/* Payment Button */}
                        <TouchableOpacity
                            style={styles.paymentButton}
                            onPress={handlePayment}
                        >
                            <Text style={styles.paymentButtonText}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* QR Payment Modal */}
            <PaymentQRModal
                visible={showQRModal}
                onClose={() => setShowQRModal(false)}
                qrData={qrData}
                amount={bookingData?.totalPrice || 0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AuthColors.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    bookingCard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    hotelImage: {
        width: 120,
        height: 100,
        margin: 12,
        borderRadius: 8,
    },
    bookingInfo: {
        padding: 12,
        paddingTop: 0,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: AuthColors.text,
    },
    hotelName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AuthColors.primary,
        marginBottom: 4,
    },
    roomType: {
        fontSize: 13,
        color: AuthColors.text,
        marginBottom: 12,
    },
    bookingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: AuthColors.textLight,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: AuthColors.text,
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AuthColors.primary,
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: AuthColors.text,
        marginBottom: 8,
        marginTop: 12,
    },
    promoCodeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    promoInput: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: AuthColors.text,
        backgroundColor: '#F9F9F9',
    },
    applyButton: {
        backgroundColor: AuthColors.primary,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    voucherChips: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        flexWrap: 'wrap',
    },
    voucherChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    voucherText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },
    paymentMethodButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AuthColors.primary,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    paymentMethodActive: {
        backgroundColor: AuthColors.primary,
    },
    paymentMethodText: {
        fontSize: 12,
        fontWeight: '600',
        color: AuthColors.primary,
    },
    paymentMethodTextActive: {
        color: '#fff',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: AuthColors.text,
        backgroundColor: '#F9F9F9',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: AuthColors.primary,
        borderColor: AuthColors.primary,
    },
    checkboxText: {
        flex: 1,
        fontSize: 12,
        color: AuthColors.text,
    },
    linkText: {
        color: AuthColors.primary,
        textDecorationLine: 'underline',
    },
    paymentButton: {
        backgroundColor: AuthColors.primary,
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    required: {
        color: '#FF0000',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        overflow: 'hidden',
    },
    picker: {
        height: 48,
        color: AuthColors.text,
    },
    datePickerButton: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F9F9F9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    datePickerText: {
        fontSize: 14,
        color: AuthColors.text,
    },
});
