import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, Platform, ImageBackground } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Container, AppText, Button } from '../components';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

export const VideoReviewScreen = ({ navigation, route }: any) => {
    // Merged params: include wordHistory just in case, though not used in UI yet
    const { videoUri, category, date, wordHistory } = route.params || {};
    const { t } = useLanguage();
    const {
        pauseMusic, resumeMusic, enableMusic, toggleMusic,
        availableTracks, setInternalTrack, setLocalTrack, currentTrack
    } = useSound();

    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<any>({});
    const [showMusicPicker, setShowMusicPicker] = useState(false);

    // Logic for word history (from HEAD) - kept purely for logic, not rendering yet to avoid style conflicts
    const [currentWord, setCurrentWord] = useState<string>("");
    const [currentResult, setCurrentResult] = useState<'correct' | 'pass' | 'pending' | null>(null);

    useEffect(() => {
        // Force Portrait (Incoming wins)
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

        pauseMusic();

        return () => {
            resumeMusic();
        };
    }, []);

    const onPlaybackStatusUpdate = (status: any) => {
        setStatus(() => status);
        if (status.isLoaded && status.positionMillis !== undefined && wordHistory) {
            const currentTime = status.positionMillis;
            // Find the word active at this time
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
            const { status } = await MediaLibrary.requestPermissionsAsync(true);
            if (status !== 'granted') {
                Alert.alert(t('error'), "Necesitamos permiso para guardar el video.");
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(videoUri);
            await MediaLibrary.createAlbumAsync("CharadesApp", asset, true);
            Alert.alert(t('success'), "Video original guardado en galería.");
        } catch (error: any) {
            Alert.alert(t('error'), "No se pudo guardar.");
        }
    };

    const handlePickLocal = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true
            });

            if (!res.canceled && res.assets && res.assets.length > 0) {
                const file = res.assets[0];
                setLocalTrack(file.uri, file.name);
                if (!enableMusic) toggleMusic();

                resumeMusic();
                setShowMusicPicker(false);
            }
        } catch (err) {
            console.log("Picker Error", err);
        }
    };

    const selectTrack = (index: number) => {
        setInternalTrack(index);
        if (!enableMusic) toggleMusic();
        resumeMusic();
        setShowMusicPicker(false);
    };

    const handleSilence = () => {
        pauseMusic();
        setShowMusicPicker(false);
    }

    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <Container centered style={styles.container}>
                {/* Header Area */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <AppText style={styles.headerTitle}>{category}</AppText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Video Card */}
                <View style={styles.videoWrapper}>
                    <View style={styles.videoCard}>
                        <Video
                            ref={videoRef}
                            style={styles.video}
                            source={{ uri: videoUri }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            shouldPlay
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />

                        {/* Overlay for Word History */}
                        {currentWord ? (
                            <View style={styles.overlayContainer}>
                                <AppText style={styles.overlayWord}>{currentWord}</AppText>
                                {currentResult === 'correct' && <AppText style={styles.overlayResult}>✅</AppText>}
                                {currentResult === 'pass' && <AppText style={styles.overlayResult}>⏭️</AppText>}
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Controls Area (Below Video) */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => setShowMusicPicker(true)}
                    >
                        <Ionicons name="musical-notes" size={24} color="#FFD700" />
                        <AppText style={styles.controlText}>{t('music_picker_title')}</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlButton, styles.saveButton]}
                        onPress={handleSave}
                    >
                        <Ionicons name="save-outline" size={24} color="#003893" />
                        <AppText style={[styles.controlText, styles.saveButtonText]}>Guardar</AppText>
                    </TouchableOpacity>
                </View>

                {/* Music Picker Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showMusicPicker}
                    onRequestClose={() => setShowMusicPicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <AppText variant="header" style={styles.modalTitle}>{t('music_picker_title')}</AppText>

                            <ScrollView style={{ maxHeight: 300, width: '100%' }}>
                                <TouchableOpacity style={styles.trackItem} onPress={handleSilence}>
                                    <AppText style={styles.trackName}>🔇 {t('no_music')}</AppText>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity style={styles.trackItem} onPress={handlePickLocal}>
                                    <AppText style={styles.trackName}>{t('pick_local_file')}</AppText>
                                </TouchableOpacity>

                                <View style={styles.divider} />
                                <AppText style={styles.sectionHeader}>{t('default_tracks')}</AppText>

                                {availableTracks.map((track, index) => (
                                    <TouchableOpacity
                                        key={track.id}
                                        style={[
                                            styles.trackItem,
                                            currentTrack?.id === track.id && styles.selectedTrack
                                        ]}
                                        onPress={() => selectTrack(index)}
                                    >
                                        <AppText style={styles.trackName}>
                                            {currentTrack?.id === track.id ? '▶️ ' : ''}{track.name}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Button
                                title={t('back')}
                                onPress={() => setShowMusicPicker(false)}
                                variant="outline"
                                style={{ marginTop: 20, width: '100%' }}
                            />
                        </View>
                    </View>
                </Modal>
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
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        width: '100%',
        height: 60,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700',
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    iconButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    videoWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    videoCard: {
        width: '100%',
        aspectRatio: 16 / 9, // Fit Landscape video perfectly
        backgroundColor: '#000',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FCD116', // Yellow Border
        elevation: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10
    },
    video: {
        width: '100%',
        height: '100%',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        gap: 30
    },
    controlButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#003893', // Colombian Blue default
        borderWidth: 2,
        borderColor: '#003893',
        shadowColor: "#003893",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
        minWidth: 140,
    },
    saveButton: {
        backgroundColor: '#FCD116', // Colombian Yellow
        borderColor: '#FCD116',
        shadowColor: "#FCD116",
    },
    controlText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white', // Text text on Blue
        letterSpacing: 0.5
    },
    saveButtonText: {
        color: '#003893', // Blue text on Yellow button for contrast
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)', // Darker overlay
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        padding: 25,
        width: '90%',
        alignItems: 'center',
        elevation: 10,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    modalTitle: {
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center'
    },
    trackItem: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectedTrack: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 10,
        borderBottomWidth: 0
    },
    trackName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        width: '100%',
        marginVertical: 8
    },
    sectionHeader: {
        color: '#888',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginTop: 15,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 1
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    overlayWord: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowRadius: 5
    },
    overlayResult: {
        fontSize: 20,
        marginTop: 5
    }
});
