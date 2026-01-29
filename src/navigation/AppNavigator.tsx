import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { GameConfigScreen } from '../screens/GameConfigScreen';
import { CategorySelectionScreen } from '../screens/CategorySelectionScreen';
import { GameScreen } from '../screens/GameScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WordPreviewScreen } from '../screens/WordPreviewScreen';
import { VideoReviewScreen } from '../screens/VideoReviewScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    const { colors, isDark } = useTheme();

    const navigationTheme = {
        ...DefaultTheme,
        dark: isDark,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.error,
        }
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="GameConfig" component={GameConfigScreen} />
                <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
                <Stack.Screen name="WordPreview" component={WordPreviewScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="Results" component={ResultsScreen} />
                <Stack.Screen name="VideoReview" component={VideoReviewScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
