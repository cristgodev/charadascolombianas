import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    variant = 'elevated'
}) => {
    const { colors, theme } = useTheme();

    const cardStyle = [
        styles.card,
        { backgroundColor: colors.surface },
        variant === 'elevated' && theme.shadows.small,
        variant === 'outlined' && { borderWidth: 1, borderColor: colors.lightGray },
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.8}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
    },
});
