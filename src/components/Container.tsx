import React from 'react';
import { View, ViewStyle, StyleSheet, StatusBar, StyleProp } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface ContainerProps extends SafeAreaViewProps {
    children: React.ReactNode;
    centered?: boolean;
    noPadding?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    centered,
    noPadding,
    style,
    ...props
}) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: colors.background },
                !noPadding && styles.padding,
                centered && styles.centered,
                style
            ]}
            {...props}
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    padding: {
        padding: 16,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
