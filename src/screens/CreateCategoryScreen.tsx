import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, AppText, Button } from '../components';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../data/categories';
import * as ImagePicker from 'expo-image-picker';

export const CreateCategoryScreen = ({ navigation }: any) => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [wordsText, setWordsText] = useState('');
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Updated to use string array or MediaTypeOptions if strictly typed
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !wordsText.trim()) {
            Alert.alert(t('missing_data'), t('missing_data_desc'));
            return;
        }

        const words = wordsText.split('\n').map(w => w.trim()).filter(w => w.length > 0);
        if (words.length < 5) {
            Alert.alert(t('few_words'), t('few_words_desc'));
            return;
        }

        setLoading(true);
        try {
            const newCategory: Category = {
                id: `custom_${Date.now()}`,
                title: title.trim(),
                description: description.trim(),
                icon: '✨', // Default icon since we only use image now
                image: imageUri, // Save the image URI
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

            Alert.alert(t('success'), t('success_desc'));
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert(t('error'), t('error_desc'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppText variant="header" style={styles.header}>{t('create_header')}</AppText>

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
                    <AppText style={styles.label}>Portada</AppText>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker} activeOpacity={0.8}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.placeholder}>
                                <AppText style={{ fontSize: 40 }}>📷</AppText>
                                <AppText style={styles.placeholderText}>Toca para elegir imagen</AppText>
                            </View>
                        )}
                    </TouchableOpacity>
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
    imagePicker: {
        height: 150,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        color: '#aaa',
        marginTop: 5,
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
