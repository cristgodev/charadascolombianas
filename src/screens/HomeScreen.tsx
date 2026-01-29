import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, AppText, Button } from '../components';

export const HomeScreen = ({ navigation }: any) => {
    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <AppText variant="display" color="#FFD700" centered>CHARADAS</AppText>
                <AppText variant="subheader" centered style={styles.subtitle}>La Fiesta en tu Bolsillo 🇨🇴</AppText>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={[styles.card, styles.playCard]}
                    onPress={() => navigation.navigate('CategorySelection')}
                    activeOpacity={0.9}
                >
                    <AppText variant="display" style={styles.cardIcon}>🎮</AppText>
                    <AppText variant="header" style={styles.cardTitle}>¡A JUGAR!</AppText>
                    <AppText variant="body" style={styles.cardDesc}>Modo Clásico y Fiesta</AppText>
                </TouchableOpacity>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.card, styles.secondaryCard]}
                        onPress={() => { /* TODO: Create */ }}
                    >
                        <AppText variant="header" style={styles.cardIconSmall}>✨</AppText>
                        <AppText variant="button">Crear</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.secondaryCard]}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <AppText variant="header" style={styles.cardIconSmall}>⚙️</AppText>
                        <AppText variant="button">Ajustes</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    subtitle: {
        opacity: 0.8,
        marginTop: 8,
    },
    menu: {
        flex: 1,
        gap: 20,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    playCard: {
        flex: 2,
        backgroundColor: '#6C63FF', // Primary
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        height: 140,
    },
    secondaryCard: {
        flex: 1,
        backgroundColor: '#1E1E1E', // Surface
        borderWidth: 1,
        borderColor: '#333',
    },
    cardIcon: {
        fontSize: 60,
        marginBottom: 10,
    },
    cardIconSmall: {
        fontSize: 32,
        marginBottom: 8,
    },
    cardTitle: {
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
        fontSize: 14,
    }
});
