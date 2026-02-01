import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Container, AppText } from '../components';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
    return (
        <ImageBackground
            source={require('../../assets/home-bg.png')}
            style={styles.background}
            resizeMode="stretch"
        >
            <Container noPadding style={styles.overlayContainer}>
                {/* 
                    Invisible touch area for "Play".
                    Takes up the majority of the bottom width (Left/Center).
                */}
                <TouchableOpacity
                    style={styles.invisiblePlayArea}
                    onPress={() => navigation.navigate('CategorySelection')}
                    activeOpacity={0.5}
                />

                {/* 
                    Invisible touch area for "Settings".
                    Placed to the right of the Play button.
                */}
                <TouchableOpacity
                    style={styles.invisibleSettingsArea}
                    onPress={() => navigation.navigate('Settings')}
                    activeOpacity={0.5}
                />
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
    invisiblePlayArea: {
        position: 'absolute',
        bottom: '3%',
        left: '5%',
        width: '70%', // Play takes 70% of width
        height: 100,
        // backgroundColor: 'rgba(0,255,0,0.3)', // Debug
    },
    invisibleSettingsArea: {
        position: 'absolute',
        bottom: '3%',
        right: '5%',
        width: '20%', // Settings takes remaining 20% (with gap)
        height: 100,
        // backgroundColor: 'rgba(0,0,255,0.3)', // Debug
    }
});
