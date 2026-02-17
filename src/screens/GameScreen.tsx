import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, AppText, Button, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharadaCard } from '../data/categories';

// Mock words just in case
const MOCK_WORDS = ['Error', 'No Data'];

export const GameScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const { playSound, playHaptic, shuffleMusic, setVolumeModifier } = useSound();
    // Get params - prioritize param duration
    const { category, words: initialWords, duration = 60 } = route.params || {};

    const [score, setScore] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [wordsAnswered, setWordsAnswered] = useState(0);
    // Shuffle words on init
    const [words, setWords] = useState<(string | CharadaCard)[]>([]);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'>('READY');

    // Word Tracking for Video Overlay (From HEAD)
    const [wordHistory, setWordHistory] = useState<{ word: string, timestamp: number, result: 'correct' | 'pass' | 'pending' }[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);

    // Tilt handling mechanism
    const [readyForAction, setReadyForAction] = useState(true);

    // Video Recording
    const cameraRef = useRef<CameraManagerHandle>(null);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    useEffect(() => {
        // Init words
        const list = initialWords && initialWords.length > 0 ? [...initialWords] : MOCK_WORDS;
        // Simple shuffle
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        setWords(list);
    }, [initialWords]);

    useFocusEffect(
        React.useCallback(() => {
            const lockLandscape = async () => {
                try {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                } catch (e) {
                    console.error("Failed to lock landscape", e);
                }
            };
            lockLandscape();

            return () => {
                const lockPortrait = async () => {
                    try {
                        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                        setVolumeModifier(1.0);
                    } catch (e) {
                        console.error("Failed to lock portrait", e);
                    }
                };
                lockPortrait();
            };
        }, [])
    );

    const onTimeEnd = () => {
        finishGame(score, wordsAnswered);
    };

    const finishGame = (finalScore: number, finalTotal: number) => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0); // Restore full volume
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

        // Use a timeout as failsafe in case recording callback never fires
        const failsafeTimeout = setTimeout(() => {
            navigation.replace('Results', {
                score: finalScore,
                total: finalTotal,
                videoUri: null,
                category: category,
                wordHistory: wordHistory
            });
        }, 15000);

        // Stop recording if running
        if (cameraRef.current) {
            cameraRef.current.stopRecording().then(() => {
                // Recording stopped
            });
        } else {
            clearTimeout(failsafeTimeout);
            navigation.replace('Results', {
                score: finalScore,
                total: finalTotal,
                videoUri: null,
                category: category,
                wordHistory: wordHistory
            });
        }
    };

    const onRecordingFinished = (uri: string) => {
        setRecordedUri(uri);
        // Navigate when recording is done
        if (gameStatus === 'FINISHED' || wordsAnswered >= 10) {
            navigation.replace('Results', {
                score,
                total: wordsAnswered,
                videoUri: uri,
                category: category,
                wordHistory: wordHistory
            });
        }
    };

    // Use Dynamic Duration (Incoming)
    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(duration, onTimeEnd);
    const { tilt, data } = useAccelerometer(gameStatus === 'PLAYING');

    useEffect(() => {
        if (gameStatus === 'PLAYING') {
            startTimer();
        } else {
            stopTimer();
        }
    }, [gameStatus, startTimer, stopTimer]);

    useEffect(() => {
        if (gameStatus !== 'PLAYING') return;

        if (readyForAction) {
            if (tilt === 'UP') {
                // Pass (Now UP is pass)
                handleNextWord(false);
            } else if (tilt === 'DOWN') {
                // Correct (Now DOWN is correct)
                handleNextWord(true);
            }
        } else {
            // Wait for neutral to reset action availability
            if (tilt === 'NEUTRAL') {
                setReadyForAction(true);
            }
        }
    }, [tilt, readyForAction, gameStatus]);

    const getCurrentWordString = () => {
        const current = words[wordIndex];
        return typeof current === 'string' ? current : current.word;
    };

    const handleNextWord = (correct: boolean) => {
        const nextAnsweredCount = wordsAnswered + 1;
        setWordsAnswered(nextAnsweredCount);

        const newScore = correct ? score + 1 : score;

        // Update current word result in history
        const currentTime = Date.now() - gameStartTime;
        setWordHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > 0) {
                // Update the last word with result (the one we just finished)
                newHistory[newHistory.length - 1].result = correct ? 'correct' : 'pass';
            }
            return newHistory;
        });

        if (correct) {
            setScore(newScore);
            playHaptic('success');
            playSound('correct');
        } else {
            playHaptic('impact');
            playSound('wrong');
        }

        // Move to next word (Use logic from HEAD to support history)
        setReadyForAction(false);

        let nextIndex = (wordIndex + 1) % words.length;
        setWordIndex(nextIndex);

        // Record Next Word Start Time (HEAD feature)
        // Need to resolve the string for the history log as well
        const nextWordItem = words[nextIndex];
        const nextWordString = typeof nextWordItem === 'string' ? nextWordItem : nextWordItem.word;

        const nextTime = Date.now() - gameStartTime;
        setWordHistory(prev => [
            ...prev,
            { word: nextWordString, timestamp: nextTime, result: 'pending' }
        ]);
    };

    const startGame = () => {
        shuffleMusic();
        setVolumeModifier(0.2); // Soft background music
        setScore(0);
        setWordIndex(0);
        setWordsAnswered(0);
        resetTimer();
        setGameStatus('PLAYING');

        // Start Recording Logic
        const now = Date.now();
        setGameStartTime(now);

        const firstWordItem = words[0];
        const firstWordString = typeof firstWordItem === 'string' ? firstWordItem : firstWordItem.word;

        setWordHistory([{ word: firstWordString, timestamp: 0, result: 'pending' }]);

        // Start Recording
        cameraRef.current?.startRecording();
    };

    const exitGame = () => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0);
        stopTimer();
        cameraRef.current?.stopRecording();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        navigation.navigate('Home');
    }

    return (
        <Container centered style={styles.container}>
            <CameraManager
                ref={cameraRef}
                onRecordingFinished={onRecordingFinished}
            />
            {/* Overlay Tint */}
            <View style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: tilt === 'DOWN' ? 'rgba(46, 204, 113, 0.6)' : // Green
                    tilt === 'UP' ? 'rgba(231, 76, 60, 0.6)' :   // Red
                        'rgba(0,0,0,0.3)' // Default dark tint
            }} />

            <TouchableOpacity
                style={[styles.exitButton, { top: Math.max(insets.top, 20) + 20, left: Math.max(insets.left, 20) + 20 }]}
                onPress={exitGame}
            >
                <AppText style={styles.exitButtonText}>{t('exit')}</AppText>
            </TouchableOpacity>

            {gameStatus === 'FINISHED' && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText variant="header">{t('saving')}</AppText>
                    <AppText>{t('processing_video')}</AppText>
                    {/* Music Toggle for Post-Game Vibes */}
                    <TouchableOpacity
                        style={{ marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}
                        onPress={shuffleMusic}
                        activeOpacity={0.7}
                    >
                        <AppText style={{ fontSize: 16 }}>🎵 Cambiar Música</AppText>
                    </TouchableOpacity>
                </View>
            )}

            {gameStatus === 'READY' && (
                <>
                    <AppText variant="header">{t('prepare')}</AppText>
                    <AppText style={styles.instruction}>{t('instruction_forehead')}</AppText>
                    <Button title={t('lets_go')} onPress={startGame} style={{ marginTop: 20 }} />
                </>
            )}

            {gameStatus === 'PLAYING' && (
                <>
                    <AppText style={[styles.timer, { top: Math.max(insets.top, 20) + 20, right: Math.max(insets.right, 20) + 20 }]}>{timeLeft}s</AppText>
                    <AppText style={[styles.counter, { bottom: Math.max(insets.bottom, 20) + 20, left: Math.max(insets.left, 20) + 20 }]}>{wordsAnswered}</AppText>
                    <View style={styles.wordContainer}>
                        <View style={styles.wordCard}>
                            <AppText
                                variant="header"
                                style={styles.word}
                                adjustsFontSizeToFit
                                numberOfLines={3}
                            >
                                {getCurrentWordString()}
                            </AppText>
                            {/* Rich Content for Revelation Support (or other complex cards) */}
                            {typeof words[wordIndex] !== 'string' && (
                                <View style={styles.richContentContainer}>

                                    {/* Verse - Leading with reference for context */}
                                    {(words[wordIndex] as CharadaCard).verse && (
                                        <AppText style={styles.verseText}>
                                            {(words[wordIndex] as CharadaCard).verse}
                                        </AppText>
                                    )}

                                    {/* Description - The core meaning/Resumen */}
                                    {(words[wordIndex] as CharadaCard).description && (
                                        <AppText style={styles.descText} adjustsFontSizeToFit numberOfLines={5}>
                                            {(words[wordIndex] as CharadaCard).description}
                                        </AppText>
                                    )}

                                    {/* Mime - Practical advice (Fallback/Legacy) */}
                                    {(words[wordIndex] as CharadaCard).mime && (
                                        <AppText style={styles.mimeText} adjustsFontSizeToFit numberOfLines={2}>
                                            🎭 {(words[wordIndex] as CharadaCard).mime}
                                        </AppText>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                    <AppText style={styles.instruction}>
                        {readyForAction ? t('instruction_tilt') : t('instruction_neutral')}
                    </AppText>
                </>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        // dynamic bg
    },
    wordCard: {
        padding: 20,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    timer: {
        fontSize: 40,
        fontWeight: 'bold',
        position: 'absolute',
        top: 40,
        right: 60,
        // Fix for text clipping on some devices
        lineHeight: 50,
        padding: 5,
        textAlignVertical: 'center',
    },
    counter: {
        fontSize: 24,
        position: 'absolute',
        bottom: 80, // Moved up from 40
        left: 60,
        fontWeight: 'bold',
        color: '#eee'
    },
    wordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    word: {
        fontSize: 60,
        lineHeight: 70,
        textAlign: 'center',
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        marginBottom: 10,
    },
    richContentContainer: {
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 15,
        width: '90%'
    },
    verseText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700', // Gold
        marginBottom: 5,
        textAlign: 'center'
    },
    descText: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 5,
        fontStyle: 'italic'
    },
    mimeText: {
        fontSize: 16,
        color: '#CCC',
        textAlign: 'center'
    },
    instruction: {
        marginBottom: 20,
        opacity: 0.8,
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    exitButton: {
        position: 'absolute',
        top: 40,
        left: 60,
        zIndex: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    exitButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },

});
