import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, AppText, Button } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CharadaCard } from '../data/categories';

export const WordPreviewScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const { category, totalPool } = route.params || { category: 'Mock', totalPool: [] };

    useFocusEffect(
        React.useCallback(() => {
            // Enforce Portrait when this screen is focused
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }, [])
    );

    const [displayedWords, setDisplayedWords] = useState<(string | CharadaCard)[]>([]);
    const [timeLeft, setTimeLeft] = useState(15); // Kept for reference but countdown is used below

    const [countdown, setCountdown] = useState(20);
    const [isPaused, setIsPaused] = useState(false);

    // Default game duration: 60 seconds
    const [gameDuration, setGameDuration] = useState(60);

    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
        // Initial shuffle
        shuffleAndPick();

        // 15 seconds timer (Original) - replaced by countdown logic below effectively
    }, []);

    useEffect(() => {
        if (countdown > 0 && !isPaused) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            startGame();
        }
    }, [countdown, isPaused]);

    const shuffleAndPick = () => {
        if (!totalPool || totalPool.length === 0) return;

        // Shuffle full pool
        const pool = [...totalPool];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDisplayedWords(pool.slice(0, 30)); // Pick 30 words
    };

    const startGame = () => {
        navigation.navigate('Game', { category, words: displayedWords, duration: gameDuration });
    };

    const TimeOption = ({ seconds, label }: { seconds: number, label: string }) => (
        <TouchableOpacity
            style={[styles.timeOption, gameDuration === seconds && styles.timeOptionSelected]}
            onPress={() => setGameDuration(seconds)}
            activeOpacity={0.7}
        >
            <AppText style={[styles.timeText, gameDuration === seconds && styles.timeTextSelected]}>
                {label}
            </AppText>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <Container style={styles.container}>
                <View style={styles.header}>
                    <AppText variant="subheader" centered style={styles.title}>{category}</AppText>
                    <AppText variant="caption" centered style={{ color: '#eee' }}>{t('memorize', countdown)}</AppText>
                </View>

                <View style={styles.configContainer}>
                    <AppText style={styles.label}>{t('game_duration')}</AppText>
                    <View style={styles.timeSelector}>
                        <TimeOption seconds={60} label="60s" />
                        <TimeOption seconds={90} label="90s" />
                        <TimeOption seconds={120} label="120s" />
                        <TimeOption seconds={180} label="180s" />
                    </View>
                </View>

                <View style={[styles.previewContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <AppText style={styles.previewLabel}>{t('words_round')}</AppText>
                    <ScrollView contentContainerStyle={styles.wordsGrid} showsVerticalScrollIndicator={false}>
                        {displayedWords.length === 0 ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                <AppText style={{ color: '#ccc', textAlign: 'center' }}>{t('no_words')}</AppText>
                            </View>
                        ) : (
                            displayedWords.map((item, index) => {
                                const wordText = typeof item === 'string' ? item : item.word;
                                return (
                                    <View key={index} style={styles.wordTag}>
                                        <AppText style={styles.wordText}>{wordText}</AppText>
                                    </View>
                                )
                            })
                        )}
                    </ScrollView>
                </View>

                <View style={styles.actions}>
                    <Button
                        title={t('shuffle')}
                        onPress={shuffleAndPick}
                        variant="secondary"
                        style={{ marginBottom: 16, backgroundColor: '#003893', borderColor: '#003893' }}
                    />
                    <Button
                        title={t('start', gameDuration)}
                        onPress={startGame}
                        style={{ backgroundColor: '#CE1126', borderColor: '#CE1126' }}
                    />
                </View>
            </Container>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'transparent',
    },
    header: {
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        color: '#FFD700',
        marginBottom: 4,
    },
    configContainer: {
        marginBottom: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        borderRadius: 12,
    },
    label: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 8,
        textAlign: 'center'
    },
    timeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    timeOption: {
        flex: 1,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#555',
    },
    timeOptionSelected: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    timeText: {
        fontSize: 14,
        color: '#eee',
        fontWeight: 'bold',
    },
    timeTextSelected: {
        color: '#000',
    },
    previewContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    previewLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    wordTag: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    wordText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
    },
    actions: {
        justifyContent: 'flex-end',
    }
});
