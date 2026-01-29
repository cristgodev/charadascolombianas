import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Container, AppText, Button } from '../components';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is available in Expo

export const VideoReviewScreen = ({ navigation, route }: any) => {
    const { videoUri, category, date } = route.params || {};
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<any>({});

    useEffect(() => {
        // Auto-play when screen mounts
        if (videoRef.current) {
            videoRef.current.playAsync();
        }
    }, []);

    const handleSave = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permiso denegado", "Necesitamos permiso para guardar el video en tu galería.");
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(videoUri);
            await MediaLibrary.createAlbumAsync("CharadesApp", asset, false);
            Alert.alert("¡Guardado!", "El video se ha guardado en tu galería.");
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
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

            {/* OVERLAY */}
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <AppText variant="header" style={styles.logoText}>Charadas 🎭</AppText>
                    <AppText variant="caption" style={styles.dateText}>{date || new Date().toLocaleDateString()}</AppText>
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
        padding: 40,
        pointerEvents: 'none', // Allow touches to pass through to video controls if needed, but we have our own controls
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoText: {
        color: '#FFD700',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        fontSize: 40
    },
    dateText: {
        color: 'white',
        opacity: 0.8,
        marginTop: 5,
        textShadowColor: 'black',
        textShadowRadius: 5
    },
    footer: {
        marginBottom: 100, // Make room for save button
        alignItems: 'center',
    },
    tag: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)'
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 20
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
    }
});
