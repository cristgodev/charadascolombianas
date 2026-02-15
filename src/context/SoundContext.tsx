import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { AppState, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface Track {
    id: string;
    name: string;
    source: any;
    isLocal?: boolean;
}

const BACKGROUND_TRACKS: Track[] = [
    { id: 'cali_coins', name: 'Cali Coins', source: require('../../assets/sounds/Cali Coins.mp3') },
    { id: 'caribe_loop', name: 'Caribe Loop Fiesta', source: require('../../assets/sounds/Caribe Loop Fiesta.mp3') },
    { id: 'fiesta_tap', name: 'Fiesta Tap Loop', source: require('../../assets/sounds/Fiesta Tap Loop.mp3') },
    { id: 'fiesta_bolsillo', name: 'Fiesta en el Bolsillo', source: require('../../assets/sounds/Fiesta en el Bolsillo.mp3') },
    { id: 'llanero', name: 'Llanero Party Loop', source: require('../../assets/sounds/Llanero Party Loop.mp3') },
    { id: 'llanos', name: 'Llanos Party Loop', source: require('../../assets/sounds/Llanos Party Loop.mp3') },
    { id: 'palmeras', name: 'Palmeras En Juego', source: require('../../assets/sounds/Palmeras En Juego.mp3') },
    { id: 'rolos', name: 'Rolos Rooftop Loop', source: require('../../assets/sounds/Rolos Rooftop Loop.mp3') },
    { id: 'santander', name: 'Santander Sprint', source: require('../../assets/sounds/Santander Sprint.mp3') },
];

interface SoundContextType {
    playSound: (type: 'correct' | 'wrong' | 'tick' | 'end') => Promise<void>;
    playHaptic: (type: 'success' | 'impact' | 'selection') => void;
    enableMusic: boolean;
    toggleMusic: () => void;
    pauseMusic: () => void;
    resumeMusic: () => void;

    enableSFX: boolean;
    toggleSFX: () => void;
    enableVibration: boolean;
    toggleVibration: () => void;

    currentTrack: Track | null;
    availableTracks: Track[];
    setInternalTrack: (index: number) => void;
    setLocalTrack: (uri: string, name: string) => void;
    shuffleMusic: () => void;

    enableMusicInVideo: boolean;
    toggleMusicInVideo: () => void;

    musicVolume: number;
    setMusicVolume: (val: number) => void;
    sfxVolume: number;
    setSFXVolume: (val: number) => void;
    setVolumeModifier: (val: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    const [enableMusic, setEnableMusic] = useState(false);
    const [enableSFX, setEnableSFX] = useState(true);
    const [enableVibration, setEnableVibration] = useState(true);
    const [enableMusicInVideo, setEnableMusicInVideo] = useState(true);

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [localTrack, setLocalTrackState] = useState<Track | null>(null);
    const [isTemporarilyPaused, setIsTemporarilyPaused] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    const [musicVolume, setMusicVolume] = useState(0.5);
    const [sfxVolume, setSFXVolume] = useState(1.0);
    const [volumeModifier, setVolumeModifier] = useState(1.0);

    const musicSound = useRef<Audio.Sound | null>(null);
    const correctSound = useRef<Audio.Sound | null>(null);
    const wrongSound = useRef<Audio.Sound | null>(null);

    const enableMusicRef = useRef(enableMusic);
    const isPausedRef = useRef(isTemporarilyPaused);

    useEffect(() => { enableMusicRef.current = enableMusic; }, [enableMusic]);
    useEffect(() => { isPausedRef.current = isTemporarilyPaused; }, [isTemporarilyPaused]);

    useEffect(() => {
        setCurrentTrackIndex(Math.floor(Math.random() * BACKGROUND_TRACKS.length));

        const init = async () => {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
                allowsRecordingIOS: false
            });

            await loadSettings();
            setSettingsLoaded(true);
        };
        init();

        const timeout = setTimeout(() => {
            if (!settingsLoaded) {
                console.warn("Settings load timeout, forcing defaults");
                setSettingsLoaded(true);
            }
        }, 1500);

        return () => { clearTimeout(timeout); unloadAll(); };
    }, []);

    const unloadAll = async () => {
        if (musicSound.current) await musicSound.current.unloadAsync();
        if (correctSound.current) await correctSound.current.unloadAsync();
        if (wrongSound.current) await wrongSound.current.unloadAsync();
    };

    useEffect(() => {
        if (!settingsLoaded) return;
        loadBackgroundMusic();
    }, [currentTrackIndex, localTrack, settingsLoaded]);

    useEffect(() => {
        if (!musicSound.current) return;
        if (enableMusic && !isTemporarilyPaused) {
            musicSound.current.playAsync();
        } else {
            musicSound.current.pauseAsync();
        }
    }, [enableMusic, isTemporarilyPaused]);

    useEffect(() => {
        if (musicSound.current) musicSound.current.setVolumeAsync(musicVolume * volumeModifier);
    }, [musicVolume, volumeModifier]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active' && enableMusic && !isTemporarilyPaused) {
                musicSound.current?.playAsync();
            } else if (nextAppState.match(/inactive|background/)) {
                musicSound.current?.pauseAsync();
            }
        });
        return () => subscription.remove();
    }, [enableMusic, isTemporarilyPaused]);

    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_music', String(enableMusic)); }, [enableMusic, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_sfx', String(enableSFX)); }, [enableSFX, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_vibration', String(enableVibration)); }, [enableVibration, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_music_rec', String(enableMusicInVideo)); }, [enableMusicInVideo, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_music_vol', String(musicVolume)); }, [musicVolume, settingsLoaded]);
    useEffect(() => { if (settingsLoaded) AsyncStorage.setItem('setting_sfx_vol', String(sfxVolume)); }, [sfxVolume, settingsLoaded]);

    const loadSettings = async () => {
        try {
            const music = await AsyncStorage.getItem('setting_music');
            const sfx = await AsyncStorage.getItem('setting_sfx');
            const vib = await AsyncStorage.getItem('setting_vibration');
            const rec = await AsyncStorage.getItem('setting_music_rec');
            const musVol = await AsyncStorage.getItem('setting_music_vol');
            const sfxVol = await AsyncStorage.getItem('setting_sfx_vol');

            setEnableMusic(music !== null ? music === 'true' : true);
            if (sfx !== null) setEnableSFX(sfx === 'true');
            if (vib !== null) setEnableVibration(vib === 'true');
            if (rec !== null) setEnableMusicInVideo(rec === 'true');
            if (musVol !== null) setMusicVolume(parseFloat(musVol));
            if (sfxVol !== null) setSFXVolume(parseFloat(sfxVol));

            loadSFX();
        } catch (e) { console.error("Error loading settings", e); }
    };

    const loadBackgroundMusic = async () => {
        if (musicSound.current) {
            await musicSound.current.unloadAsync();
            musicSound.current = null;
        }

        let source;
        if (localTrack) {
            source = { uri: localTrack.source };
        } else {
            source = BACKGROUND_TRACKS[currentTrackIndex].source;
        }

        try {
            const shouldPlay = enableMusicRef.current && !isPausedRef.current;
            const { sound } = await Audio.Sound.createAsync(
                source,
                { isLooping: true, volume: musicVolume * volumeModifier, shouldPlay: shouldPlay }
            );
            musicSound.current = sound;
        } catch (e) {
            console.warn("Error loading bg music", e);
        }
    };

    const loadSFX = async () => {
        try {
            if (correctSound.current) await correctSound.current.unloadAsync();
            if (wrongSound.current) await wrongSound.current.unloadAsync();

            try {
                const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/correct.mp3'));
                correctSound.current = sound;
            } catch (e) { }

            try {
                const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/wrong.mp3'));
                wrongSound.current = sound;
            } catch (e) { }
        } catch (e) { }
    };

    const playSound = async (type: 'correct' | 'wrong' | 'tick' | 'end') => {
        if (!enableSFX) return;
        try {
            let soundObject: Audio.Sound | null = null;
            if (type === 'correct') soundObject = correctSound.current;
            if (type === 'wrong') soundObject = wrongSound.current;

            if (soundObject) {
                await soundObject.setVolumeAsync(sfxVolume * 0.6);
                await soundObject.replayAsync();
            }
        } catch (e) { }
    };

    const playHaptic = (type: 'success' | 'impact' | 'selection') => {
        if (!enableVibration) return;
        switch (type) {
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
            case 'impact': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
            case 'selection': Haptics.selectionAsync(); break;
        }
    };

    const toggleMusic = () => setEnableMusic(prev => !prev);
    const pauseMusic = () => setIsTemporarilyPaused(true);
    const resumeMusic = () => setIsTemporarilyPaused(false);

    const toggleSFX = () => setEnableSFX(prev => !prev);
    const toggleVibration = () => setEnableVibration(prev => !prev);
    const toggleMusicInVideo = () => setEnableMusicInVideo(prev => !prev);

    const shuffleMusic = () => {
        setLocalTrackState(null);
        let newIndex = Math.floor(Math.random() * BACKGROUND_TRACKS.length);
        if (newIndex === currentTrackIndex && BACKGROUND_TRACKS.length > 1) {
            newIndex = (newIndex + 1) % BACKGROUND_TRACKS.length;
        }
        setCurrentTrackIndex(newIndex);
    };

    const setInternalTrack = (index: number) => {
        setLocalTrackState(null);
        setCurrentTrackIndex(index);
    };

    const setLocalTrack = (uri: string, name: string) => {
        setLocalTrackState({ id: 'local', name, source: uri, isLocal: true });
    };

    const currentTrack = localTrack || BACKGROUND_TRACKS[currentTrackIndex];

    return (
        <SoundContext.Provider value={{
            playSound, playHaptic,
            enableMusic, toggleMusic, pauseMusic, resumeMusic,
            enableSFX, toggleSFX,
            enableVibration, toggleVibration,
            currentTrack, availableTracks: BACKGROUND_TRACKS,
            setInternalTrack, setLocalTrack, shuffleMusic,
            enableMusicInVideo, toggleMusicInVideo,
            musicVolume, setMusicVolume,
            sfxVolume, setSFXVolume,
            setVolumeModifier
        }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error("useSound must be used within a SoundProvider");
    return context;
};
