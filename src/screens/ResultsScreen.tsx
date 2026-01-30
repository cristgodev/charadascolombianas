import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, AppText, Button } from '../components';

export const ResultsScreen = ({ navigation, route }: any) => {
    // Safely access params
    const { score, total, videoUri, category } = route.params || { score: 0, total: 0 };

    return (
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
                    onPress={() => navigation.navigate('VideoReview', { videoUri, category, score, total })}
                    variant="secondary"
                    style={{ width: '80%', marginBottom: 16 }}
                />
            )}

            <Button
                title="🔄 Jugar Otra Vez"
                onPress={() => navigation.navigate('CategorySelection')}
                style={{ width: '80%', marginTop: 24, marginBottom: 16 }}
            />

            <Button
                title="🏠 Inicio"
                variant="outline"
                onPress={() => navigation.navigate('Home')}
                style={{ width: '80%' }}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
    },
    header: {
        marginBottom: 20,
        color: '#FFD700', // Gold
        textAlign: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        padding: 40,
        backgroundColor: '#1E1E1E', // Dark Surface
        borderRadius: 30, // More rounded
        width: '85%',
        borderWidth: 1,
        borderColor: '#333',
        // Glow effect
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    scoreLabel: {
        fontSize: 24,
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 4, // More breathing room
        marginBottom: 10,
    },
    scoreValue: {
        fontSize: 90,
        lineHeight: 100, // Explicit line height to prevent clipping
        fontWeight: '800',
        color: '#fff',
    }
});
