import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, AppState, AppStateStatus } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export interface CameraManagerHandle {
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<string | null>;
}

interface CameraManagerProps {
    onRecordingStart?: () => void;
    onRecordingFinished?: (uri: string) => void;
}

export const CameraManager = forwardRef<CameraManagerHandle, CameraManagerProps>((props, ref) => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const [mediaLibPermission, requestMediaLibPermission] = MediaLibrary.usePermissions({ writeOnly: true });

    const cameraRef = useRef<CameraView>(null);
    const [isRecording, setIsRecording] = useState(false);

    const onRecordingFinishedRef = useRef(props.onRecordingFinished);
    const onRecordingStartRef = useRef(props.onRecordingStart);

    // AppState handling to stop recording if backgrounded
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState.match(/inactive|background/) && isRecording) {
                console.log("App going background, stopping recording...");
                if (cameraRef.current) {
                    cameraRef.current.stopRecording();
                    setIsRecording(false);
                    // Also clear any pending flag
                    if (pendingRecordingRef.current) {
                        pendingRecordingRef.current = false;
                    }
                }
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isRecording]);

    useEffect(() => {
        onRecordingFinishedRef.current = props.onRecordingFinished;
        onRecordingStartRef.current = props.onRecordingStart;
    });

    useEffect(() => {
        (async () => {
            if (!cameraPermission?.granted) await requestCameraPermission();
            if (!microphonePermission?.granted) await requestMicrophonePermission();
            if (!mediaLibPermission?.granted) await requestMediaLibPermission();
        })();
    }, []);

    const [isCameraReady, setIsCameraReady] = useState(false);
    const pendingRecordingRef = useRef(false);

    useImperativeHandle(ref, () => ({
        startRecording: async () => {
            // If camera is ready, start immediately
            if (isCameraReady && cameraRef.current && !isRecording) {
                await startRecordingInternal();
            } else {
                // Otherwise queue it
                pendingRecordingRef.current = true;
                console.log("Camera not ready, queuing startRecording...");
            }
        },
        stopRecording: async () => {
            pendingRecordingRef.current = false; // Cancel pending
            if (cameraRef.current && isRecording) {
                cameraRef.current.stopRecording();
            }
            return null;
        }
    }));

    const startRecordingInternal = async () => {
        try {
            if (!cameraRef.current) return;

            setIsRecording(true);
            onRecordingStartRef.current?.();

            const data = await cameraRef.current.recordAsync({
                maxDuration: 300,
            });

            if (data?.uri) {
                onRecordingFinishedRef.current?.(data.uri);
            }
            setIsRecording(false);
        } catch (error) {
            console.error("Recording failed", error);
            setIsRecording(false);
        }
    };

    const handleCameraReady = () => {
        console.log("Camera is ready!");
        setIsCameraReady(true);
        if (pendingRecordingRef.current) {
            pendingRecordingRef.current = false;
            startRecordingInternal();
        }
    };

    if (!cameraPermission?.granted || !microphonePermission?.granted) {
        return null;
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
                mode="video"
                mute={false}
                onCameraReady={handleCameraReady}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black', // fallback
    },
    camera: {
        flex: 1,
    }
});
