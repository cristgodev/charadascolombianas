import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import { Container, AppText, Button } from '../components';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

export const SettingsScreen = ({ navigation }: any) => {
    const { language, setLanguage, t } = useLanguage();
    const {
        enableMusic, toggleMusic,
        enableSFX, toggleSFX,
        enableVibration, toggleVibration,
        enableMusicInVideo, toggleMusicInVideo,
        musicVolume, setMusicVolume,
        sfxVolume, setSFXVolume
    } = useSound();

    const ToggleRow = ({ label, value, onToggle }: { label: string, value: boolean, onToggle: () => void }) => (
        <View style={styles.toggleRow}>
            <AppText style={styles.toggleLabel}>{label}</AppText>
            <TouchableOpacity
                style={[styles.toggleBtn, value ? styles.toggleOn : styles.toggleOff]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <AppText style={styles.toggleText}>{value ? t('on') : t('off')}</AppText>
            </TouchableOpacity>
        </View>
    );

    const VolumeSlider = ({ value, onValueChange }: { value: number, onValueChange: (val: number) => void }) => (
        <View style={{ marginBottom: 15, paddingHorizontal: 10 }}>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                minimumTrackTintColor="#FFD700"
                maximumTrackTintColor="#FFFFFF"
                thumbTintColor="#FFD700"
                value={value}
                onValueChange={onValueChange}
            />
        </View>
    );

    return (
        <ImageBackground
            source={require('../../assets/background_colombia.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}
            resizeMode="cover"
        >
            <Container centered style={[styles.container, { backgroundColor: 'transparent' }]}>
                <AppText variant="header" style={styles.header}>{t('settings')}</AppText>

                <View style={styles.section}>
                    <ToggleRow label={`🎶 ${t('music')}`} value={enableMusic} onToggle={toggleMusic} />
                    {enableMusic && (
                        <>
                            <AppText style={styles.subLabel}>{t('volume_music')} ({(musicVolume * 100).toFixed(0)}%)</AppText>
                            <VolumeSlider value={musicVolume} onValueChange={setMusicVolume} />
                        </>
                    )}

                    <View style={styles.divider} />
                    <ToggleRow label={`📹 ${t('music_in_video')}`} value={enableMusicInVideo} onToggle={toggleMusicInVideo} />
                    <View style={styles.divider} />

                    <ToggleRow label={`🔊 ${t('sound_effects')}`} value={enableSFX} onToggle={toggleSFX} />
                    {enableSFX && (
                        <>
                            <AppText style={styles.subLabel}>{t('volume_sfx')} ({(sfxVolume * 100).toFixed(0)}%)</AppText>
                            <VolumeSlider value={sfxVolume} onValueChange={setSFXVolume} />
                        </>
                    )}

                    <View style={styles.divider} />
                    <ToggleRow label={`📳 ${t('vibration')}`} value={enableVibration} onToggle={toggleVibration} />
                </View>

                <View style={styles.section}>
                    <AppText style={styles.label}>{t('language')}</AppText>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.option, language === 'es' && styles.selected]}
                            onPress={() => setLanguage('es')}
                            activeOpacity={0.7}
                        >
                            <AppText style={[styles.optionText, language === 'es' && styles.selectedText]}>Espanol 🇨🇴</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.option, language === 'en' && styles.selected]}
                            onPress={() => setLanguage('en')}
                            activeOpacity={0.7}
                        >
                            <AppText style={[styles.optionText, language === 'en' && styles.selectedText]}>English 🇺🇸</AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <Button
                    title={t('back')}
                    onPress={() => navigation.goBack()}
                    variant="outline"
                    style={styles.backButton}
                />
            </Container>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        marginBottom: 40,
    },
    section: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 16,
    },
    label: {
        fontSize: 18,
        color: '#aaa',
        marginBottom: 15,
        textAlign: 'center'
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    toggleLabel: {
        fontSize: 16,
        color: 'white',
    },
    toggleBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    toggleOn: {
        backgroundColor: '#4CAF50', // Green
    },
    toggleOff: {
        backgroundColor: '#F44336', // Red
    },
    toggleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#555',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    selected: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    optionText: {
        color: '#eee',
        fontWeight: 'bold',
    },
    selectedText: {
        color: '#000',
    },
    backButton: {
        marginTop: 20,
        width: '100%',
    },
    subLabel: {
        fontSize: 12,
        color: '#ccc',
        marginLeft: 10,
        marginBottom: 5
    }
});
