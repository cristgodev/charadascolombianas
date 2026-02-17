import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container, Button } from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeScreen = ({ navigation }: any) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground
            source={require('../../assets/portada_inicio.png')}
            style={[styles.background, { width, height }]}
            resizeMode="cover" // Changed to cover to avoid distortion
        >
            <Container noPadding style={styles.overlayContainer}>
                {/* Settings Top Right */}
                <TouchableOpacity
                    style={[styles.settingsButtonTop, { top: insets.top + 20, right: 20 }]}
                    onPress={() => navigation.navigate('Settings')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="settings-sharp" size={24} color="white" />
                </TouchableOpacity>

                {/* Play Button Bottom Center */}
                <View style={[styles.bottomContainer, { bottom: insets.bottom + 40 }]}>
                    <Button
                        title="JUGAR"
                        onPress={() => navigation.navigate('CategorySelection')}
                        style={styles.playButton}
                    />
                </View>
            </Container>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    settingsButtonTop: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    bottomContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    playButton: {
        width: '100%',
        minHeight: 60,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
