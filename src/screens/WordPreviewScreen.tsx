import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Container, AppText, Button } from '../components';

export const WordPreviewScreen = ({ navigation, route }: any) => {
    const { category, totalPool } = route.params || { category: 'Mock', totalPool: [] };

    const [displayedWords, setDisplayedWords] = useState<string[]>([]);

    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
        // Initial shuffle
        shuffleAndPick();
    }, []);

    const shuffleAndPick = () => {
        if (!totalPool || totalPool.length === 0) return;

        // Pick 20 distinct random words
        // Simple shuffle algorithm
        const pool = [...totalPool];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDisplayedWords(pool.slice(0, 20));
    };

    const startGame = () => {
        navigation.navigate('Game', { category, words: displayedWords });
    };

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <AppText variant="subheader" centered style={styles.title}>{category}</AppText>
                <AppText variant="caption" centered>Estas son tus palabras posibles</AppText>
            </View>

            <View style={styles.previewContainer}>
                <ScrollView contentContainerStyle={styles.wordsGrid} showsVerticalScrollIndicator={false}>
                    {displayedWords.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
                            <AppText style={{ color: '#888', textAlign: 'center' }}>No hay palabras disponibles para esta categoría.</AppText>
                        </View>
                    ) : (
                        displayedWords.map((word, index) => (
                            <View key={index} style={styles.wordTag}>
                                <AppText style={styles.wordText}>{word}</AppText>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>

            <View style={styles.actions}>
                <Button
                    title="🔄 Barajar"
                    onPress={shuffleAndPick}
                    variant="secondary"
                    style={{ marginBottom: 16 }}
                />
                <Button
                    title="▶️ ¡Hágale!"
                    onPress={startGame}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFD700',
        marginBottom: 8,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    wordTag: {
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#555',
    },
    wordText: {
        fontSize: 14,
        color: '#eee',
    },
    actions: {
        justifyContent: 'flex-end',
    }
});
