import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { AppText } from './AppText';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: object; // Allow custom text style
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled,
    loading,
    style,
    textStyle,
}) => {
    const { colors, theme } = useTheme();

    const handlePress = () => {
        if (disabled || loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const getBackgroundColor = () => {
        if (disabled) return colors.lightGray;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'danger': return colors.error;
            case 'outline': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textSecondary;
        if (variant === 'outline') return colors.primary;
        return '#FFFFFF';
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: variant === 'outline' ? colors.primary : 'transparent',
                    borderWidth: variant === 'outline' ? 2 : 0,
                },
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <AppText variant="button" style={[{ color: getTextColor() }, textStyle]}>
                    {title}
                </AppText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12, // User likes rounded modern look
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
});
