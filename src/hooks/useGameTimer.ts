import { useState, useEffect, useCallback, useRef } from 'react';

export const useGameTimer = (initialTime: number = 60, onTimeEnd?: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const onTimeEndRef = useRef(onTimeEnd);

    useEffect(() => {
        onTimeEndRef.current = onTimeEnd;
    }, [onTimeEnd]);

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

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft <= 0 && isRunning) {
            // Time is up!
            setIsRunning(false);
            if (onTimeEndRef.current) onTimeEndRef.current();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, timeLeft]);

    return { timeLeft, isRunning, startTimer, stopTimer, resetTimer };
};
