import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme';

interface AppTextProps extends TextProps {
    variant?: keyof typeof typography;
    color?: string;
    centered?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
    children,
    variant = 'body',
    style,
    color,
    centered,
    ...props
}) => {
    const { colors } = useTheme();

    const textStyle: TextStyle = {
        ...typography[variant],
        color: color || colors.text,
        textAlign: centered ? 'center' : 'auto',
    };

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};
