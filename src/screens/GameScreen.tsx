import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'; // Standard imports
import { Container, AppText, Button, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';

import * as ScreenOrientation from 'expo-screen-orientation';
import * as Haptics from 'expo-haptics';

import { theme, spacing } from '../theme';

const MOCK_WORDS = ['Error', 'No Data'];

export const GameScreen = ({ navigation, route }: any) => {
    // Get params
    const { category, words: initialWords } = route.params || {};

    const [score, setScore] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [wordsAnswered, setWordsAnswered] = useState(0);
    // Shuffle words on init
    const [words, setWords] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'>('READY');

    // Word Tracking for Video Overlay
    const [wordHistory, setWordHistory] = useState<{ word: string, timestamp: number, result: 'correct' | 'pass' | 'pending' }[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);

    // Tilt handling mechanism
    // We need to wait for Neutral before accepting a new tilt action.
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

    useEffect(() => {
        // Lock to Landscape
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => {
            // Force back to Portrait on exit
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
    }, []);

    const onTimeEnd = () => {
        finishGame(score, wordsAnswered);
    };

    const finishGame = (finalScore: number, finalTotal: number) => {
        setGameStatus('FINISHED');
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

        // Use a timeout as failsafe in case recording callback never fires
        const failsafeTimeout = setTimeout(() => {
            navigation.navigate('Results', {
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
                // We could cancel timeout here if we wanted to be strict, 
                // but the callback usually fires immediately after.
                // Actually, let's keep the timeout active until navigation happens.
            });
        } else {
            clearTimeout(failsafeTimeout);
            navigation.navigate('Results', {
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
        // Check if game is finished to avoid premature navigation not triggered by game end
        if (gameStatus === 'FINISHED' || wordsAnswered >= 10) {
            navigation.navigate('Results', {
                score,
                total: wordsAnswered,
                videoUri: uri,
                category: category,
                wordHistory: wordHistory
            });
        }
    };

    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(120, onTimeEnd);

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
                // Note: The timestamp stored is when it started.
                newHistory[newHistory.length - 1].result = correct ? 'correct' : 'pass';
            }
            return newHistory;
        });

        if (correct) {
            setScore(newScore);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }

        // Check condition: 10 words
        if (nextAnsweredCount >= 10) {
            finishGame(newScore, nextAnsweredCount);
            return;
        }

        // Move to next word
        setReadyForAction(false); // require returning to neutral
        setReadyForAction(false); // require returning to neutral

        let nextIndex = (wordIndex + 1) % words.length;
        setWordIndex(nextIndex);

        // Record Next Word Start Time
        const nextTime = Date.now() - gameStartTime;
        setWordHistory(prev => [
            ...prev,
            { word: words[nextIndex], timestamp: nextTime, result: 'pending' }
        ]);
    };

    const startGame = () => {
        setScore(0);
        setWordIndex(0);
        setWordsAnswered(0);
        resetTimer();
        setGameStatus('PLAYING');

        // Start Recording Logic
        const now = Date.now();
        setGameStartTime(now);
        // Record first word (timestamp 0 relative to game start)
        // Note: Camera starts async, so there might be a slight offset, but close enough.
        setWordHistory([{ word: words[0], timestamp: 0, result: 'pending' }]);

        // Start Recording
        cameraRef.current?.startRecording();
    };

    const exitGame = () => {
        setGameStatus('FINISHED');
        stopTimer();
        cameraRef.current?.stopRecording();
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        navigation.navigate('Home');
    }

    return (
        <Container centered style={[
            styles.container,
            tilt === 'DOWN' ? styles.bgCorrect : {}, // Visual feedback reversed
            tilt === 'UP' ? styles.bgPass : {}
        ] as any}>
            <CameraManager
                ref={cameraRef}
                onRecordingFinished={onRecordingFinished}
            />
            <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
                <AppText style={styles.exitButtonText}>Salir</AppText>
            </TouchableOpacity>

            {gameStatus === 'FINISHED' && (
                <View style={styles.centerContent}>
                    <AppText variant="header" style={styles.statusText}>Guardando...</AppText>
                    <AppText style={styles.statusSubtext}>Procesando video de recuerdo 🎥</AppText>
                    <AppText style={styles.loadingText}>Puede tardar unos segundos...</AppText>
                </View>
            )}

            {gameStatus === 'READY' && (
                <View style={styles.centerContent}>
                    <AppText variant="display" style={styles.readyTitle}>¡Prepárate!</AppText>
                    <AppText style={styles.instruction}>Ponte el cel en la frente 📱</AppText>
                    <Button title="¡Hágale!" onPress={startGame} style={styles.startButton} />
                </View>
            )}

            {gameStatus === 'PLAYING' && (
                <>
                    <AppText style={styles.timer}>{timeLeft}s</AppText>
                    <AppText style={styles.counter}>{wordsAnswered}/10</AppText>
                    <View style={styles.wordContainer}>
                        <AppText
                            variant="display" // Use display for bigger impact
                            style={styles.word}
                            adjustsFontSizeToFit
                            numberOfLines={3}
                        >
                            {words[wordIndex]}
                        </AppText>
                    </View>
                    <AppText style={styles.instruction}>
                        {readyForAction ? "Abajo: ¡Eso! / Arriba: Paso" : "Vuelve al centro"}
                    </AppText>

                    {/* Debug Info: Optional, can comment out for prod */}
                    {/* <AppText style={styles.debug}>Tilt: {tilt} (Z: {data.z.toFixed(2)})</AppText> */}
                </>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        // dynamic bg colors will be applied via style props
    },
    bgCorrect: {
        backgroundColor: theme.colors.success,
    },
    bgPass: {
        backgroundColor: theme.colors.error,
    },
    timer: {
        fontSize: 40,
        fontWeight: 'bold',
        position: 'absolute',
        top: 50, // Hardcoded safe margin for landscape header
        right: 80, // Moved significantly inward
        zIndex: 20,
        color: theme.colors.text,
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    counter: {
        fontSize: 24,
        position: 'absolute',
        bottom: 50, // Safe bottom margin
        left: 60,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)'
    },
    wordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xxl,
        width: '80%', // Limit width to prevent reading edge-to-edge
    },
    word: {
        fontSize: 56, // Large but legible
        lineHeight: 64,
        textAlign: 'center',
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    instruction: {
        marginBottom: spacing.m,
        opacity: 0.8,
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    debug: {
        position: 'absolute',
        bottom: 10,
        fontSize: 10,
        color: '#aaa',
    },
    exitButton: {
        position: 'absolute',
        top: 50, // Match timer top margin
        left: 60,
        zIndex: 10,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    exitButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.m,
    },
    statusText: {
        fontSize: 32,
        color: theme.colors.accent,
    },
    statusSubtext: {
        fontSize: 18,
        color: theme.colors.text,
    },
    loadingText: {
        marginTop: spacing.s,
        fontSize: 14,
        opacity: 0.7,
        color: theme.colors.textSecondary,
    },
    readyTitle: {
        fontSize: 48,
        color: theme.colors.accent,
        marginBottom: spacing.m,
    },
    startButton: {
        marginTop: spacing.l,
        minWidth: 200,
    }
});

