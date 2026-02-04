import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, AppText, Button } from '../components';
import { theme, spacing } from '../theme';


export const HomeScreen = ({ navigation }: any) => {
    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <AppText variant="display" color={theme.colors.accent} centered>CHARADAS</AppText>
                <AppText variant="subheader" centered style={styles.subtitle}>La Fiesta en tu Bolsillo 🇨🇴</AppText>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={[styles.card, styles.playCard]}
                    onPress={() => navigation.navigate('CategorySelection')}
                    activeOpacity={0.9}
                >
                    <View style={styles.playContent}>
                        <AppText variant="display" style={styles.cardIcon}>🎮</AppText>
                        <View>
                            <AppText variant="header" style={styles.cardTitle}>¡A JUGAR!</AppText>
                            <AppText variant="body" style={styles.cardDesc}>Modo Clásico y Fiesta</AppText>
                        </View>
                    </View>
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
        paddingTop: spacing.xxl,
        paddingHorizontal: spacing.l,
    },
    header: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    subtitle: {
        opacity: 0.8,
        marginTop: spacing.s,
        color: theme.colors.textSecondary,
    },
    menu: {
        flex: 1,
        gap: spacing.l,
        justifyContent: 'center', // Center vertically for balance
        paddingBottom: spacing.xxl,
    },
    card: {
        borderRadius: theme.borderRadius.l,
        padding: spacing.l,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.default,
    },
    playCard: {
        flex: 1.5, // Give slightly less dominance than 2 to balance space
        backgroundColor: theme.colors.primary,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        ...theme.shadows.glow, // Add glow for main action
    },
    playContent: {
        alignItems: 'center',
        gap: spacing.m,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.m,
        height: 160, // Fixed reasonable height for bottom cards
    },
    secondaryCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardIcon: {
        fontSize: 70, // Larger icon
        marginBottom: spacing.s,
    },
    cardIconSmall: {
        fontSize: 32,
        marginBottom: spacing.s,
    },
    cardTitle: {
        color: theme.colors.text,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '800',
        textAlign: 'center',
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: spacing.xs,
        fontSize: 14,
        textAlign: 'center',
    }
});

