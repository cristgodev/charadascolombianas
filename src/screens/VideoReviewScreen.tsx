import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Container, AppText, Button } from '../components';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is available in Expo
import * as ScreenOrientation from 'expo-screen-orientation';


export const VideoReviewScreen = ({ navigation, route }: any) => {
    const { videoUri, category, date, wordHistory } = route.params || {};
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<any>({});
    const [currentWord, setCurrentWord] = useState<string>("");
    const [currentResult, setCurrentResult] = useState<'correct' | 'pass' | 'pending' | null>(null);

    useEffect(() => {
        // Lock to Landscape
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        // Auto-play when screen mounts
        if (videoRef.current) {
            videoRef.current.playAsync();
        }

        return () => {
            // Force back to Portrait on exit
            ScreenOrientation.unlockAsync(); // Unlock first
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
    }, []);



    const onPlaybackStatusUpdate = (status: any) => {
        setStatus(() => status);
        if (status.isLoaded && status.positionMillis !== undefined && wordHistory) {
            const currentTime = status.positionMillis;
            // Find the word active at this time
            // We want the last word that started BEFORE current time
            // wordHistory is sorted by timestamp (0, 3000, 5000...)
            let activeWord = wordHistory[0];
            for (let i = 0; i < wordHistory.length; i++) {
                if (wordHistory[i].timestamp <= currentTime) {
                    activeWord = wordHistory[i];
                } else {
                    break;
                }
            }
            if (activeWord) {
                setCurrentWord(activeWord.word);
                setCurrentResult(activeWord.result);
            }
        }
    };

    const handleSave = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permiso denegado", "Necesitamos permiso para guardar el video en tu galería.");
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(videoUri);
            await MediaLibrary.createAlbumAsync("CharadesApp", asset, false);
            Alert.alert(
                "¡Video Guardado!",
                "El video original se ha guardado en tu galería.\n\nNota: La plantilla (texto) solo es visible dentro de la app por ahora."
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar el video.");
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: videoUri }}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />

            {/* OVERLAY */}
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <AppText variant="header" style={styles.logoText}>Charadas 🎭</AppText>

                    {/* Dynamic Word Overlay */}
                    <View style={[
                        styles.wordOverlay,
                        currentResult === 'correct' ? styles.bgCorrect : {},
                        currentResult === 'pass' ? styles.bgPass : {}
                    ] as any}>
                        <AppText
                            style={styles.wordText}
                            adjustsFontSizeToFit
                            numberOfLines={3}
                        >
                            {currentWord || "..."}
                        </AppText>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.tag}>
                        <AppText style={styles.tagText}>{category || "Juego Épico"}</AppText>
                    </View>
                </View>
            </View>

            {/* UI CONTROLS (On top of overlay) */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
                    <AppText style={{ fontSize: 24 }}>❌</AppText>
                </TouchableOpacity>

                <Button
                    title="💾 Guardar en Galería"
                    onPress={handleSave}
                    variant="primary"
                    style={styles.saveButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    video: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 20, // Reduced padding
        pointerEvents: 'none',
    },
    header: {
        alignItems: 'center',
        marginTop: 10, // Drastically reduced top margin
    },
    logoText: {
        color: '#FFD700',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        fontSize: 30 // Reduced font size
    },
    dateText: {
        color: 'white',
        opacity: 0.8,
        marginTop: 2,
        textShadowColor: 'black',
        textShadowRadius: 5
    },
    footer: {
        marginBottom: 60, // Reduced bottom margin (enough for controls but tighter)
        alignItems: 'center',
    },
    tag: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)'
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14 // Reduced font size
    },
    controls: {
        position: 'absolute',
        bottom: 20, // Lower controls
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 20
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
        height: 40 // Smaller button
    },
    wordOverlay: {
        marginTop: 10, // Much closer to header
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        width: '80%', // Slightly narrower
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        minHeight: 80, // Reduced min height
    },
    wordText: {
        fontSize: 24, // Reduced font size
        lineHeight: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 10,
        width: '100%',
    },
    bgCorrect: {
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.4)'
    },
    bgPass: {
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.4)'
    }

});
