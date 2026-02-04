import { useState, useEffect, useCallback, useRef } from 'react';

export const useGameTimer = (initialTime: number = 60, onTimeEnd?: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = useCallback(() => {
        if (!isRunning && timeLeft > 0) {
            setIsRunning(true);
        }
    }, [isRunning, timeLeft]);

    const stopTimer = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setTimeLeft(initialTime);
    }, [initialTime, stopTimer]);

    const onTimeEndRef = useRef(onTimeEnd);

    useEffect(() => {
        onTimeEndRef.current = onTimeEnd;
    }, [onTimeEnd]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current as NodeJS.Timeout);
                        setIsRunning(false);
                        if (onTimeEndRef.current) onTimeEndRef.current();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]); // Removed onTimeEnd from dependencies


    return { timeLeft, isRunning, startTimer, stopTimer, resetTimer };
};
