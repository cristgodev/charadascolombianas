import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Container, AppText, Button } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../data/categories';

export const CreateCategoryScreen = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('🎲'); // Default emoji
    const [wordsText, setWordsText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !wordsText.trim()) {
            Alert.alert("Faltan datos", "Por favor completa todos los campos.");
            return;
        }

        const words = wordsText.split('\n').map(w => w.trim()).filter(w => w.length > 0);
        if (words.length < 5) {
            Alert.alert("Muy pocas palabras", "Agrega al menos 5 palabras para que el juego sea divertido.");
            return;
        }

        setLoading(true);
        try {
            const newCategory: Category = {
                id: `custom_${Date.now()}`,
                title: title.trim(),
                description: description.trim(),
                icon,
                color: '#FF4081', // Pink for custom
                difficulty: 'Medio',
                words,
                isCustom: true
            };

            // Load existing
            const existingjson = await AsyncStorage.getItem('custom_categories');
            const existing: Category[] = existingjson ? JSON.parse(existingjson) : [];

            // Save new
            const updated = [...existing, newCategory];
            await AsyncStorage.setItem('custom_categories', JSON.stringify(updated));

            Alert.alert("¡Éxito!", "Categoría creada correctamente.");
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo guardar la categoría.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppText variant="header" style={styles.header}>Crear Categoría</AppText>

                <View style={styles.formGroup}>
                    <AppText style={styles.label}>Título</AppText>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Mis Amigos"
                        placeholderTextColor="#666"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={30}
                    />
                </View>

                <View style={styles.formGroup}>
                    <AppText style={styles.label}>Emoji (Icono)</AppText>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 🍕"
                        placeholderTextColor="#666"
                        value={icon}
                        onChangeText={setIcon}
                        maxLength={2}
                    />
                </View>

                <View style={styles.formGroup}>
                    <AppText style={styles.label}>Descripción</AppText>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Solo para entendidos..."
                        placeholderTextColor="#666"
                        value={description}
                        onChangeText={setDescription}
                        maxLength={50}
                    />
                </View>

                <View style={styles.formGroup}>
                    <AppText style={styles.label}>Palabras (una por línea)</AppText>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Palabra 1&#10;Palabra 2&#10;Palabra 3"
                        placeholderTextColor="#666"
                        value={wordsText}
                        onChangeText={setWordsText}
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                    />
                    <AppText style={styles.hint}>{wordsText.split('\n').filter(w => w.trim()).length} palabras</AppText>
                </View>

                <Button
                    title={loading ? "Guardando..." : "Crear Categoría"}
                    onPress={handleSave}
                    disabled={loading}
                    variant="primary"
                    style={styles.button}
                />
                {/* Spacer for bottom */}
                <View style={{ height: 50 }} />
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#ccc',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    textArea: {
        minHeight: 150,
    },
    hint: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
        marginTop: 5,
    },
    button: {
        marginTop: 10,
    }
});
