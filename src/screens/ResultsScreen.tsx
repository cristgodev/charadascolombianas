import React from 'react';
import { View, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Container, AppText, Button } from '../components';

export const ResultsScreen = ({ navigation, route }: any) => {
    // Safely access params
    const { score, total, videoUri, category, wordHistory } = route.params || { score: 0, total: 0 };

    useFocusEffect(
        React.useCallback(() => {
            // Enforce Portrait when this screen is focused
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

            const onBackPress = () => {
                navigation.popToTop();
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <Container centered style={styles.container}>
                <AppText variant="display" style={styles.header}>¡Se Acabó!</AppText>

                <View style={styles.scoreContainer}>
                    <AppText style={styles.scoreLabel}>Puntaje</AppText>
                    <AppText style={styles.scoreValue} adjustsFontSizeToFit numberOfLines={1}>
                        {score}/{total}
                    </AppText>
                </View>

                {videoUri && (
                    <Button
                        title="🎬 Ver Video del Juego"
                        onPress={() => navigation.navigate('VideoReview', { videoUri, category, score, total, wordHistory })}
                        variant="secondary"
                        style={{ width: '80%', marginBottom: 16, backgroundColor: '#003893', borderColor: '#003893' }}
                    />
                )}

                <Button
                    title="🔄 Jugar Otra Vez"
                    onPress={() => navigation.reset({
                        index: 1,
                        routes: [{ name: 'Home' }, { name: 'CategorySelection' }],
                    })}
                    style={{ width: '80%', marginBottom: 16, backgroundColor: '#CE1126', borderColor: '#CE1126' }}
                    variant="primary"
                />

                <Button
                    title="🏠 Inicio"
                    variant="outline"
                    onPress={() => navigation.popToTop()}
                    style={{ width: '80%' }}
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
    container: {
        backgroundColor: 'transparent',
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    header: {
        marginBottom: 30,
        color: '#FFD700',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 5
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        padding: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 30,
        width: '100%',
        borderWidth: 2,
        borderColor: '#FCD116',
    },
    scoreLabel: {
        fontSize: 24,
        color: '#EEE',
        textTransform: 'uppercase',
        letterSpacing: 4,
        marginBottom: 10,
    },
    scoreValue: {
        fontSize: 80,
        lineHeight: 90,
        fontWeight: '800',
        color: '#FFF',
        textShadowColor: 'purple',
        textShadowRadius: 10
    }
});
