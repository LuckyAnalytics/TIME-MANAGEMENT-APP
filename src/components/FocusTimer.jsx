import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { logDashboardActivity } from '../utils/activityLogger';

export default function FocusTimer() {
    const TOTAL_SECONDS = 25 * 60;
    const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setIsRunning(false);
            logDashboardActivity({
                type: 'timer',
                title: 'Completed 25-minute Pomodoro Focus Session! 🎯',
                tag: 'Study'
            });
        }
        return () => clearInterval(interval);
    }, [isRunning, secondsLeft]);

    const handleToggle = () => {
        const nextRunning = !isRunning;
        setIsRunning(nextRunning);
        if (nextRunning) {
            logDashboardActivity({
                type: 'timer',
                title: 'Started Focus Session (25 mins)',
                tag: 'Study'
            });
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setSecondsLeft(TOTAL_SECONDS);
    };

    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const secs = String(secondsLeft % 60).padStart(2, '0');

    // Circular SVG math
    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    const progressRatio = secondsLeft / TOTAL_SECONDS;
    const strokeDashoffset = circumference - (1 - progressRatio * 0.75) * circumference;

    return (
        <div className="glass-card" style={styles.card}>
            <h2 style={styles.cardTitle}>Focus Timer</h2>

            <div style={styles.timerContainer}>
                <svg width="170" height="170" viewBox="0 0 170 170" style={styles.svgRing}>
                    <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.6" />
                        </filter>
                    </defs>

                    {/* Background Track Ring */}
                    <circle
                        cx="85"
                        cy="85"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="7"
                        fill="transparent"
                    />

                    {/* Animated Progress Ring */}
                    <circle
                        cx="85"
                        cy="85"
                        r={radius}
                        stroke="url(#timerGradient)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 85 85)"
                        filter="url(#purpleGlow)"
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                </svg>

                {/* Center Content */}
                <div style={styles.timerCenter}>
                    <div style={styles.timeDisplay}>{mins}:{secs}</div>
                    <div style={styles.timerLabel}>Focus</div>
                </div>

                {/* Play and Reset Controls */}
                <div style={styles.controlsRow}>
                    <button
                        onClick={handleToggle}
                        style={styles.playBtn}
                        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
                    >
                        {isRunning ? (
                            <Pause size={17} color="#ffffff" fill="#ffffff" />
                        ) : (
                            <Play size={17} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        style={styles.resetBtn}
                        title="Reset timer"
                        aria-label="Reset timer"
                    >
                        <RotateCcw size={15} color="#94a3b8" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    cardTitle: {
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '0.5rem'
    },
    timerContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.4rem 0'
    },
    svgRing: {
        transform: 'rotate(-45deg)'
    },
    timerCenter: {
        position: 'absolute',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none'
    },
    timeDisplay: {
        fontSize: '2.1rem',
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: '-0.02em',
        fontFamily: "'Inter', sans-serif"
    },
    timerLabel: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: '400',
        marginTop: '0.1rem'
    },
    controlsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: '-1.5rem',
        zIndex: 2
    },
    playBtn: {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        boxShadow: '0 0 16px rgba(168, 85, 247, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    resetBtn: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8
    }
};