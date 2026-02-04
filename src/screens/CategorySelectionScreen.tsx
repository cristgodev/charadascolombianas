import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Container, AppText } from '../components';
import { CATEGORIES, Category } from '../data/categories';
import { theme, spacing } from '../theme';


export const CategorySelectionScreen = ({ navigation }: any) => {

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate('WordPreview', { category: item.title, totalPool: item.words })}
            activeOpacity={0.8}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <AppText style={styles.icon}>{item.icon}</AppText>
            </View>
            <View style={styles.textContainer}>
                <AppText variant="subheader" style={styles.title}>{item.title}</AppText>
                <AppText variant="caption" style={styles.desc} numberOfLines={2}>{item.description}</AppText>
            </View>
            <View style={styles.arrow}>
                <AppText variant="header" style={{ color: theme.colors.textMuted }}>›</AppText>
            </View>
        </TouchableOpacity>
    );

    return (
        <Container style={styles.container}>
            <AppText variant="header" style={styles.header}>Elige tu Tema</AppText>

            <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: spacing.l,
        paddingHorizontal: spacing.l,
    },
    header: {
        marginBottom: spacing.l,
        textAlign: 'center', // Center title for balance
    },
    list: {
        paddingBottom: spacing.xxl,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 6,
        // Using theme shadow
        ...theme.shadows.soft,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.s,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    icon: {
        fontSize: 32,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        marginBottom: spacing.xs,
    },
    desc: {
        color: theme.colors.textSecondary,
    },
    arrow: {
        paddingLeft: spacing.s,
    }
});

