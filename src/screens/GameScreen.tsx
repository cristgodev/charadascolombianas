import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, AppText, Button, CameraManager, CameraManagerHandle } from '../components';
import { useGameTimer, useAccelerometer } from '../hooks';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

import * as ScreenOrientation from 'expo-screen-orientation';

const MOCK_WORDS = ['Error', 'No Data'];

export const GameScreen = ({ navigation, route }: any) => {
    const { t } = useLanguage();
    const { playSound, playHaptic, shuffleMusic, setVolumeModifier } = useSound();
    // Get params
    const { category, words: initialWords, duration = 90 } = route.params || {};

    const [score, setScore] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [wordsAnswered, setWordsAnswered] = useState(0);
    // Shuffle words on init
    const [words, setWords] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'>('READY');

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

    useEffect(() => {
        // Lock to Landscape
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => {
            // Force back to Portrait on exit
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            // Ensure volume is reset incase of unexpected unmount
            setVolumeModifier(1.0);
        };
    }, []);

    const onTimeEnd = () => {
        finishGame(score, wordsAnswered);
    };

    const finishGame = (finalScore: number, finalTotal: number) => {
        setGameStatus('FINISHED');
        setVolumeModifier(1.0); // Restore full volume
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

        // Use a timeout as failsafe in case recording callback never fires
        const failsafeTimeout = setTimeout(() => {
            navigation.navigate('Results', { score: finalScore, total: finalTotal, videoUri: null, category: category });
        }, 3000);

        // Stop recording if running
        if (cameraRef.current) {
            cameraRef.current.stopRecording().then(() => {
                // Recording stopped
            });
        } else {
            clearTimeout(failsafeTimeout);
            navigation.navigate('Results', { score: finalScore, total: finalTotal, videoUri: null, category: category });
        }
    };

    const onRecordingFinished = (uri: string) => {
        setRecordedUri(uri);
        // Navigate when recording is done
        if (gameStatus === 'FINISHED' || wordsAnswered >= 10) {
            navigation.navigate('Results', { score, total: wordsAnswered, videoUri: uri, category: category });
        }
    };

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

    const handleNextWord = (correct: boolean) => {
        const nextAnsweredCount = wordsAnswered + 1;
        setWordsAnswered(nextAnsweredCount);

        const newScore = correct ? score + 1 : score;
        if (correct) {
            setScore(newScore);
            playHaptic('success');
            playSound('correct');
        } else {
            playHaptic('impact');
            playSound('wrong');
        }

        // Move to next word
        setReadyForAction(false);
        setWordIndex(prev => (prev + 1) % words.length);
    };

    const startGame = () => {
        shuffleMusic();
        setVolumeModifier(0.2); // Soft background music
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

            <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
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
                    <AppText style={styles.timer}>{timeLeft}s</AppText>
                    <AppText style={styles.counter}>{wordsAnswered}</AppText>
                    <View style={styles.wordContainer}>
                        <View style={styles.wordCard}>
                            <AppText
                                variant="header"
                                style={styles.word}
                                adjustsFontSizeToFit
                                numberOfLines={3}
                            >
                                {words[wordIndex]}
                            </AppText>
                        </View>
                    </View>
                    <AppText style={styles.instruction}>
                        {readyForAction ? t('instruction_tilt') : t('instruction_neutral')}
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
    },
    counter: {
        fontSize: 24,
        position: 'absolute',
        bottom: 40,
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
        lineHeight: 80,
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
        top: 40,
        left: 60,
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
