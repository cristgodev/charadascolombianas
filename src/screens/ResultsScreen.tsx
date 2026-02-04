import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Container, AppText, Button } from '../components';
import { theme, spacing } from '../theme';



export const ResultsScreen = ({ navigation, route }: any) => {
    // Safely access params
    const { score, total, videoUri, category, wordHistory } = route.params || { score: 0, total: 0 };

    useFocusEffect(
        React.useCallback(() => {
            // Enforce Portrait when this screen is focused
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );


    return (
        <Container centered style={styles.container}>
            <AppText variant="display" style={styles.header}>¡Se Acabó!</AppText>

            <View style={styles.scoreContainer}>
                <AppText style={styles.scoreLabel}>Puntaje</AppText>
                <AppText style={styles.scoreValue} adjustsFontSizeToFit numberOfLines={1}>
                    {score}/{total}
                </AppText>
            </View>

            <View style={styles.buttonGroup}>
                {videoUri ? (
                    <Button
                        title="📹 Guardar / Ver Video"
                        onPress={() => navigation.navigate('VideoReview', { videoUri, category, score, total, wordHistory })}
                        variant="primary"
                        style={styles.mainButton}
                    />
                ) : (
                    <AppText style={styles.noVideoText}>Video no disponible</AppText>
                )}

                <Button
                    title="🔄 Jugar Otra Vez"
                    onPress={() => navigation.navigate('CategorySelection')}
                    style={styles.actionButton}
                    variant="secondary"
                />

                <Button
                    title="🏠 Inicio"
                    variant="outline"
                    onPress={() => navigation.navigate('Home')}
                    style={styles.actionButton}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.l,
    },
    header: {
        marginBottom: spacing.l,
        color: theme.colors.accent,
        textAlign: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.xl,
        padding: spacing.xl,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
        // Glow effect
        ...theme.shadows.glow,
    },
    scoreLabel: {
        fontSize: 20,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginBottom: spacing.s,
    },
    scoreValue: {
        fontSize: 80,
        lineHeight: 90,
        fontWeight: '800',
        color: theme.colors.text,
    },
    buttonGroup: {
        width: '100%',
        gap: spacing.m,
        marginTop: spacing.m,
    },
    mainButton: {
        height: 56,
    },
    actionButton: {
        width: '100%',
    },
    noVideoText: {
        opacity: 0.5,
        marginBottom: spacing.l,
        textAlign: 'center',
    }
});
