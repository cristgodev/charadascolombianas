import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Dimensions, ImageBackground } from 'react-native';
import { Container, AppText } from '../components';
import { getCategories, deleteCategory, Category } from '../data/categories';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');
const SPACING = 20; // Padding horizontal del container
const GAP = 16; // Espacio entre columnas
const NUM_COLUMNS = 2;
// Ancho total disponible = width - (SPACING * 2) - GAP
const CARD_SIZE = (width - (SPACING * 2) - GAP) / NUM_COLUMNS;

export const CategorySelectionScreen = ({ navigation }: any) => {
    const { t } = useLanguage();
    const [categories, setCategories] = React.useState<Category[]>([]);

    const loadCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCategories();
        }, [])
    );

    const handleDelete = (category: Category) => {
        Alert.alert(
            t('delete_category'),
            t('delete_confirm', category.title),
            [
                { text: t('cancel'), style: "cancel" },
                {
                    text: t('delete'),
                    style: "destructive",
                    onPress: async () => {
                        await deleteCategory(category.id);
                        loadCategories();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[styles.card, styles.gridCard]}
            onPress={() => navigation.navigate('WordPreview', { category: item.title, totalPool: item.words })}
            activeOpacity={0.8}
        >
            {item.image ? (
                <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={{ width: CARD_SIZE, height: CARD_SIZE }}
                    resizeMode="contain"
                />
            ) : (
                <AppText style={styles.icon}>{item.icon}</AppText>
            )}

            <View style={styles.textOverlay}>
                <AppText variant="subheader" style={styles.gridTitle} numberOfLines={2}>
                    {item.title}
                </AppText>
            </View>

            {item.isCustom && (
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                    <AppText style={{ fontSize: 16 }}>🗑️</AppText>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <TouchableOpacity
            style={[styles.card, styles.createCard]}
            onPress={() => navigation.navigate('CreateCategory')}
            activeOpacity={0.8}
        >
            <AppText style={styles.icon}>✨</AppText>
            <View style={styles.textContainer}>
                <AppText variant="subheader" style={styles.title}>{t('create_new')}</AppText>
                <AppText variant="caption" style={styles.desc}>{t('create_desc')}</AppText>
            </View>
            <View style={styles.arrow}>
                <AppText variant="header" style={{ color: '#555' }}>+</AppText>
            </View>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <Container style={styles.container} noPadding>
                <View style={[styles.headerRow, { paddingHorizontal: 20, paddingTop: 20 }]}>
                    <AppText variant="header">{t('choose_theme')}</AppText>
                </View>

                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    key={2} // Force re-render if we were switching dynamically
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
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
        // paddingTop: 20, // Now handled by inner views
        // paddingHorizontal: 20, // Now handled by list and header
        backgroundColor: 'transparent',
    },
    headerRow: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingBottom: 80, // Space for bottom
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 0,
        marginBottom: 16,
        alignItems: 'center',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden'
    },
    gridCard: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        flexDirection: 'column',
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    // categoryImage is unused now, removed
    icon: {
        fontSize: 32,
        marginRight: 0,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    title: {
        color: '#FFFFFF',
        marginBottom: 4,
    },
    desc: {
        color: '#aaa',
        marginBottom: 0,
    },
    arrow: {
        paddingLeft: 10,
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridTitle: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    createCard: {
        flexDirection: 'row',
        padding: 20,
        borderLeftColor: '#FFF',
        borderLeftWidth: 2,
        borderStyle: 'dashed',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    }
});

