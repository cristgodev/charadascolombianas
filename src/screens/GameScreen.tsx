import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'; // Standard imports
import { Container, AppText, Button, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';

import * as ScreenOrientation from 'expo-screen-orientation';
import * as Haptics from 'expo-haptics';

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
            navigation.navigate('Results', { score: finalScore, total: finalTotal, videoUri: null, category: category });
        }, 3000);

        // Stop recording if running
        if (cameraRef.current) {
            cameraRef.current.stopRecording().then(() => {
                // We could cancel timeout here if we wanted to be strict, 
                // but the callback usually fires immediately after.
                // Actually, let's keep the timeout active until navigation happens.
            });
        } else {
            clearTimeout(failsafeTimeout);
            navigation.navigate('Results', { score: finalScore, total: finalTotal, videoUri: null, category: category });
        }
    };

    const onRecordingFinished = (uri: string) => {
        setRecordedUri(uri);
        // Navigate when recording is done
        // Check if game is finished to avoid premature navigation not triggered by game end
        if (gameStatus === 'FINISHED' || wordsAnswered >= 10) {
            navigation.navigate('Results', { score, total: wordsAnswered, videoUri: uri, category: category });
        }
    };

    const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(60, onTimeEnd);
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
        setWordIndex(prev => (prev + 1) % words.length); // Loop for now
    };

    const startGame = () => {
        setScore(0);
        setWordIndex(0);
        setWordsAnswered(0);
        resetTimer();
        setGameStatus('PLAYING');
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
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText variant="header">Guardando...</AppText>
                    <AppText>Procesando video de recuerdo 🎥</AppText>
                </View>
            )}

            {gameStatus === 'READY' && (
                <>
                    <AppText variant="header">¡Prepárate!</AppText>
                    <AppText style={styles.instruction}>Ponte el cel en la frente</AppText>
                    <Button title="¡Hágale!" onPress={startGame} style={{ marginTop: 20 }} />
                </>
            )}

            {gameStatus === 'PLAYING' && (
                <>
                    <AppText style={styles.timer}>{timeLeft}s</AppText>
                    <AppText style={styles.counter}>{wordsAnswered}/10</AppText>
                    <View style={styles.wordContainer}>
                        <AppText
                            variant="header"
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

                    {/* Debug Info */}
                    <AppText style={styles.debug}>Tilt: {tilt} (Z: {data.z.toFixed(2)})</AppText>
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
        backgroundColor: '#2ecc71', // Vivid Green
    },
    bgPass: {
        backgroundColor: '#e74c3c', // Passion Red
    },
    timer: {
        fontSize: 40,
        fontWeight: 'bold',
        position: 'absolute',
        top: 40, // Increased top margin
        right: 60, // Avoid right notch
    },
    counter: {
        fontSize: 24,
        position: 'absolute',
        bottom: 40, // Moved to bottom to avoid clutter at top
        left: 60,
        fontWeight: 'bold',
        color: '#eee' // Lighter color for visibility on dark background
    },
    wordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40, // Prevent touching edges
    },
    word: {
        fontSize: 60, // Smaller base size to prevent instant overflow
        lineHeight: 80, // Fixes clipping! Must be > fontSize
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    instruction: {
        marginBottom: 20,
        opacity: 0.7,
    },
    debug: {
        position: 'absolute',
        bottom: 10,
        fontSize: 10,
        color: '#aaa',
    },
    exitButton: {
        position: 'absolute',
        top: 40, // Increased top margin
        left: 60, // Avoid left notch
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
    },
    exitButtonText: {
        fontSize: 14,
        fontWeight: 'bold'
    }
});
