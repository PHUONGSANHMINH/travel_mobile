import { AuthColors } from '@/constants/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface PaymentQRModalProps {
    visible: boolean;
    onClose: () => void;
    qrData: string;
    amount: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PaymentQRModal({
    visible,
    onClose,
    qrData,
    amount,
}: PaymentQRModalProps) {
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        if (!visible) {
            setTimeRemaining(300); // Reset timer when modal closes
            return;
        }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onClose(); // Auto close when time expires
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [visible, onClose]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* MOMO Logo Header */}
                    <View style={styles.header}>
                        <View style={styles.momoLogo}>
                            <Text style={styles.momoLogoText}>momo</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Thanh toán với MOMO</Text>
                    <Text style={styles.subtitle}>
                        Mở ứng dụng Momo và quét mã để thanh toán
                    </Text>

                    {/* QR Code */}
                    <View style={styles.qrContainer}>
                        <QRCode value={qrData} size={220} />
                    </View>

                    {/* Amount */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Số tiền cần thanh toán</Text>
                        <Text style={styles.amountValue}>
                            {amount.toLocaleString('vi-VN')}đ
                        </Text>
                    </View>

                    {/* Timer */}
                    <View style={styles.timerContainer}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.timerText}>
                            Mã QR sẽ hết hạn trong {formatTime(timeRemaining)}
                        </Text>
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Ionicons name="arrow-back" size={20} color={AuthColors.primary} />
                        <Text style={styles.backButtonText}>Quay lại</Text>
                    </TouchableOpacity>

                    {/* Note */}
                    <Text style={styles.note}>
                        Đừng tắt cửa sổ này cho đến khi thanh toán hoàn tất
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: SCREEN_WIDTH - 40,
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        marginBottom: 16,
    },
    momoLogo: {
        backgroundColor: '#A50064',
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    momoLogoText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    qrContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    amountContainer: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    amountLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: AuthColors.primary,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    timerText: {
        fontSize: 12,
        color: '#666',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: AuthColors.primary,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    backButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: AuthColors.primary,
    },
    note: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
