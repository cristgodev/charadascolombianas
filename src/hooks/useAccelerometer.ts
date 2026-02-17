import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';

export interface AccelerometerConfig {
    updateInterval?: number;
    triggerThreshold?: number;
    resetThreshold?: number;
}

export const useAccelerometer = (enabled: boolean = true, config: AccelerometerConfig = {}) => {
    const {
        updateInterval = 100,
        triggerThreshold = 0.65, // Slightly more sensitive than 0.7
        resetThreshold = 0.35
    } = config;

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
        Accelerometer.setUpdateInterval(updateInterval);
    };

    const processingData = (data: { x: number, y: number, z: number }) => {
        setData(data);
        const { z } = data;

        setTilt((currentTilt) => {
            if (currentTilt === 'NEUTRAL') {
                // Harder to leave neutral
                if (z < -triggerThreshold) return 'UP';
                if (z > triggerThreshold) return 'DOWN';
                return 'NEUTRAL';
            } else {
                // Must come ALL the way back to near-center to reset
                if (Math.abs(z) < resetThreshold) return 'NEUTRAL';
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
