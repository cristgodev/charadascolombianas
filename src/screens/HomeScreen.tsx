import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container, AppText, Button } from '../components';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
    return (
        <ImageBackground
            source={require('../../assets/portada_inicio.png')}
            style={styles.background}
            resizeMode="stretch"
        >
            <Container noPadding style={styles.overlayContainer}>
                {/* Settings Top Right */}
                <TouchableOpacity
                    style={styles.settingsButtonTop}
                    onPress={() => navigation.navigate('Settings')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="settings-sharp" size={24} color="white" />
                </TouchableOpacity>

                {/* Play Button Bottom Center */}
                <View style={styles.bottomContainer}>
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
        width: '100%',
        height: '100%',
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    settingsButtonTop: {
        position: 'absolute',
        top: 50,
        right: 20,
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
        bottom: 50,
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
