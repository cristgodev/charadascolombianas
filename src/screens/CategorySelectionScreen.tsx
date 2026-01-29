import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Container, AppText } from '../components';
import { CATEGORIES, Category } from '../data/categories';

export const CategorySelectionScreen = ({ navigation }: any) => {

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate('WordPreview', { category: item.title, totalPool: item.words })}
            activeOpacity={0.8}
        >
            <AppText style={styles.icon}>{item.icon}</AppText>
            <View style={styles.textContainer}>
                <AppText variant="subheader" style={styles.title}>{item.title}</AppText>
                <AppText variant="caption" style={styles.desc} numberOfLines={2}>{item.description}</AppText>
            </View>
            <View style={styles.arrow}>
                <AppText variant="header" style={{ color: '#555' }}>›</AppText>
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
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 20,
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 6,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        fontSize: 32,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: 'white',
        marginBottom: 4,
    },
    desc: {
        color: '#aaa',
    },
    arrow: {
        paddingLeft: 10,
    }
});
