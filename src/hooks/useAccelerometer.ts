import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';

// Thresholds for tilt detection
// These might need tuning.
// Y axis is usually relevant for "tilting phone on forehead".
// If phone is on forehead:
// Neutral: Z is ~ -1 or 1 (depending on if screen faces out or in), Y is ~0, X is ~0
// Tilt Down (Look at floor): Y changes
// Tilt Up (Look at sky): Y changes

// Let's assume user holds phone on forehead, screen facing OUT (so others can see).
// Vertical phone: Y is -1 (gravity pulls down). Wait, accelerometer measures acceleration including gravity.
// If phone is portrait, upright: Y is -1 (approx).
// If phone is landscape (on forehead): X is -1 or 1.
// Let's assume Landscape Left or Right.

// Actually, let's just make it simple first and debug.
// But for Charades, usually phone is Landscape.
// Gravity is mostly on X axis if landscape.

export const useAccelerometer = (enabled: boolean = true) => {
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [tilt, setTilt] = useState<'NEUTRAL' | 'UP' | 'DOWN'>('NEUTRAL');
    const [subscription, setSubscription] = useState<any>(null);

    const _subscribe = () => {
        setSubscription(
            Accelerometer.addListener(processingData)
        );
        Accelerometer.setUpdateInterval(100); // Faster checks
    };

    const processingData = (data: { x: number, y: number, z: number }) => {
        setData(data);
        // Let's rely on Z for "Facing".
        // If screen faces Horizontal (out to audience): Z is ~0.
        // If screen faces Up (Ceiling): Z is -1 (or 1).
        // If screen faces Down (Floor): Z is 1 (or -1).

        const { z } = data;

        // Adjusted Sensitivity (User Request):
        // Previous was 0.7 (>45 degrees).
        // New is 0.45 (~26 degrees) to make it easier to trigger.
        // Neutral window is smaller (-0.45 to 0.45)

        if (z < -0.60) {
            setTilt('UP');
        } else if (z > 0.60) {
            setTilt('DOWN');
        } else {
            setTilt('NEUTRAL');
        }
    }

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        if (enabled) {
            _subscribe();
        } else {
            _unsubscribe();
        }

        return () => _unsubscribe();
    }, [enabled]);

    return { data, tilt };
};
