import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, Image, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { Container, AppText, Button } from '../components';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../data/categories';
import { Ionicons } from '@expo/vector-icons';

export const CreateCategoryScreen = ({ navigation }: any) => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [wordsText, setWordsText] = useState('');
    const [loading, setLoading] = useState(false);

    // Fixed asset for custom categories
    const defaultImage = require('../../assets/cat_custom.png');

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !wordsText.trim()) {
            Alert.alert(t('missing_data'), t('missing_data_desc'));
            return;
        }

        const words = wordsText.split('\n').map(w => w.trim()).filter(w => w.length > 0);

        // Validation: Minimum 10 words
        if (words.length < 10) {
            Alert.alert('¡Mínimo 10 palabras!', 'Para que el juego sea divertido, por favor agrega al menos 10 charadas.');
            return;
        }

        setLoading(true);
        try {
            const newCategory: Category = {
                id: `custom_${Date.now()}`,
                title: title.trim(),
                description: description.trim(),
                icon: '✨',
                image: defaultImage, // Use fixed image
                color: '#FF4081',
                difficulty: 'Medio',
                words,
                isCustom: true
            };

            const existingjson = await AsyncStorage.getItem('custom_categories');
            const existing: Category[] = existingjson ? JSON.parse(existingjson) : [];

            const updated = [...existing, newCategory];
            await AsyncStorage.setItem('custom_categories', JSON.stringify(updated));

            Alert.alert('¡Éxito!', 'Tu categoría ha sido creada.');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert(t('error'), t('error_desc'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={styles.mainContainer}
            resizeMode="cover"
        >
            <Container style={{ backgroundColor: 'transparent' }} noPadding>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        {/* Header Image */}
                        <View style={styles.imageContainer}>
                            <Image source={defaultImage} style={styles.headerImage} resizeMode="contain" />
                        </View>

                        <AppText variant="header" style={styles.headerTitle}>Crea tu Mazo</AppText>
                        <AppText style={styles.subHeader}>¡Personaliza tus propias charadas!</AppText>

                        <View style={styles.card}>
                            <View style={styles.formGroup}>
                                <AppText style={styles.label}>Título del Mazo</AppText>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Mi Cumpleaños"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={title}
                                    onChangeText={setTitle}
                                    maxLength={30}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <AppText style={styles.label}>Descripción Corta</AppText>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Solo para los de la oficina..."
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={description}
                                    onChangeText={setDescription}
                                    maxLength={50}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <View style={styles.labelRow}>
                                    <AppText style={styles.label}>Tus Charadas <AppText style={styles.required}>(Min. 10)</AppText></AppText>
                                    <AppText style={styles.counter}>{wordsText.split('\n').filter(w => w.trim()).length} / 10</AppText>
                                </View>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Escribe una palabra o frase por línea..."
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={wordsText}
                                    onChangeText={setWordsText}
                                    multiline
                                    numberOfLines={10}
                                    textAlignVertical="top"
                                />
                                <AppText style={styles.hint}>
                                    <Ionicons name="information-circle-outline" size={14} color="#ccc" /> Escribe cada charada en una nueva línea.
                                </AppText>
                            </View>

                            <Button
                                title={loading ? "Guardando..." : "Crear Categoría"}
                                onPress={handleSave}
                                disabled={loading}
                                variant="primary"
                                style={styles.button}
                                textStyle={styles.buttonText}
                            />
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </Container>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        padding: 0,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        height: 180,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subHeader: {
        textAlign: 'center',
        color: '#E0E0E0',
        marginBottom: 20,
        fontSize: 16,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#FFD700', // Gold color for labels
        fontSize: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    required: {
        fontSize: 12,
        color: '#FF4081',
    },
    counter: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: 15,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    textArea: {
        minHeight: 180,
    },
    hint: {
        fontSize: 13,
        color: '#ccc',
        marginTop: 8,
        fontStyle: 'italic',
    },
    button: {
        marginTop: 10,
        height: 55,
        borderRadius: 25,
        shadowColor: "#FF4081",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
