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
        const { z } = data;

        // HYSTERESIS IMPLEMENTATION
        // Trigger Action Threshold: 0.70 (Requires distinct tilt)
        // Return to Neutral Threshold: 0.35 (Must basically return to center)

        const TRIGGER_THRESHOLD = 0.70;
        const RESET_THRESHOLD = 0.35;

        setTilt((currentTilt) => {
            if (currentTilt === 'NEUTRAL') {
                // Harder to leave neutral
                if (z < -TRIGGER_THRESHOLD) return 'UP';
                if (z > TRIGGER_THRESHOLD) return 'DOWN';
                return 'NEUTRAL';
            } else {
                // Must come ALL the way back to near-center to reset
                if (Math.abs(z) < RESET_THRESHOLD) return 'NEUTRAL';
                return currentTilt; // Stick to current state if in "dead zone"
            }
        });
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
