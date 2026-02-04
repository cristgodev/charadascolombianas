import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Container, AppText, Button } from '../components';
import { theme, spacing } from '../theme';


export const WordPreviewScreen = ({ navigation, route }: any) => {
    const { category, totalPool } = route.params || { category: 'Mock', totalPool: [] };

    useFocusEffect(
        React.useCallback(() => {
            // Enforce Portrait when this screen is focused
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const [displayedWords, setDisplayedWords] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
        // Initial shuffle
        shuffleAndPick();

        // 15 seconds timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []); // Empty dependency array ensures it only runs once on mount

    useEffect(() => {
        if (timeLeft === 0) {
            startGame();
        }
    }, [timeLeft]);

    const shuffleAndPick = () => {
        if (!totalPool || totalPool.length === 0) return;

        // Pick 20 distinct random words
        // Simple shuffle algorithm
        const pool = [...totalPool];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDisplayedWords(pool.slice(0, 20));
    };

    const startGame = () => {
        navigation.navigate('Game', { category, words: displayedWords });
    };

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <AppText variant="subheader" centered style={styles.title}>{category}</AppText>
                <AppText variant="caption" centered style={styles.subtitle}>Memoriza las palabras</AppText>
                <AppText variant="display" centered style={{
                    ...styles.timer,
                    color: timeLeft <= 5 ? theme.colors.error : theme.colors.text
                }}>
                    {timeLeft}
                </AppText>
            </View>


            <View style={styles.previewContainer}>
                <ScrollView contentContainerStyle={styles.wordsGrid} showsVerticalScrollIndicator={false}>
                    {displayedWords.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <AppText style={styles.emptyText}>No hay palabras disponibles para esta categoría.</AppText>
                        </View>
                    ) : (
                        displayedWords.map((word, index) => (
                            <View key={index} style={styles.wordTag}>
                                <AppText style={styles.wordText}>{word}</AppText>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>

            <View style={styles.actions}>
                <Button
                    title="🔄 Barajar"
                    onPress={shuffleAndPick}
                    variant="secondary"
                    style={{ marginBottom: spacing.m }}
                />
                <Button
                    title="▶️ ¡Hágale!"
                    onPress={startGame}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.l,
        paddingTop: spacing.xxl,
    },
    header: {
        marginBottom: spacing.l,
        alignItems: 'center',
    },
    title: {
        color: theme.colors.accent,
        marginBottom: spacing.xs,
    },
    subtitle: {
        color: theme.colors.textSecondary,
    },
    timer: {
        marginTop: spacing.s,
        fontSize: 48, // Big timer
        fontWeight: '800',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: theme.colors.surfaceHighlight, // Slightly lighter than background
        borderRadius: theme.borderRadius.l,
        padding: spacing.m,
        marginBottom: spacing.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.s,
    },
    wordTag: {
        backgroundColor: theme.colors.surface,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: theme.borderRadius.s,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    wordText: {
        fontSize: 14,
        color: theme.colors.text,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    emptyText: {
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
    actions: {
        justifyContent: 'flex-end',
    }
});

