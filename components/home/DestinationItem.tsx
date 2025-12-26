import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface DestinationItemProps {
    imageSource: any;
    name: string;
    style?: ViewStyle;
}

export default function DestinationItem({ imageSource, name, style }: DestinationItemProps) {
    return (
        <View style={[styles.container, style]}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <Text style={styles.name}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 120,
        borderRadius: 12,
        margin: 6,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    name: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});
