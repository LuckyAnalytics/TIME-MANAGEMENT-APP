import React, { useState, useEffect, useRef } from 'react';
import { 
    ChevronDown, 
    GraduationCap, 
    Flame, 
    Sparkles, 
    BookMarked,
    Calendar,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { logDashboardActivity } from '../utils/activityLogger';

const THIS_WEEK_STORAGE_KEY = 'weather_dashboard_habits_this_week';
const LAST_WEEK_STORAGE_KEY = 'weather_dashboard_habits_last_week';
const TIMEFRAME_STORAGE_KEY = 'weather_dashboard_habits_timeframe';

const ICON_MAP = {
    study: GraduationCap,
    exercise: Flame,
    meditate: Sparkles,
    read: BookMarked
};

// Default initial data for "This Week"
const DEFAULT_THIS_WEEK = [
    {
        id: 1,
        name: 'Study',
        iconKey: 'study',
        iconBg: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        days: [true, true, true, true, true, false, false]
    },
    {
        id: 2,
        name: 'Exercise',
        iconKey: 'exercise',
        iconBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        days: [true, true, true, false, false, false, false]
    },
    {
        id: 3,
        name: 'Meditate',
        iconKey: 'meditate',
        iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        days: [false, false, true, true, false, false, false]
    },
    {
        id: 4,
        name: 'Read',
        iconKey: 'read',
        iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        days: [false, false, false, false, false, false, false]
    }
];

// Default initial historical data for "Last Week"
const DEFAULT_LAST_WEEK = [
    {
        id: 1,
        name: 'Study',
        iconKey: 'study',
        iconBg: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        days: [true, true, true, true, true, true, false] // 6/7 days
    },
    {
        id: 2,
        name: 'Exercise',
        iconKey: 'exercise',
        iconBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        days: [true, false, true, true, true, false, false] // 4/7 days
    },
    {
        id: 3,
        name: 'Meditate',
        iconKey: 'meditate',
        iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        days: [true, true, true, true, false, false, false] // 4/7 days
    },
    {
        id: 4,
        name: 'Read',
        iconKey: 'read',
        iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        days: [false, true, true, false, true, false, false] // 3/7 days
    }
];

// Monthly Stats Data
const MONTHLY_STATS = [
    {
        id: 1,
        name: 'Study',
        iconKey: 'study',
        iconBg: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        completedDays: 24,
        totalDays: 30,
        streak: 5,
        weeks: ['5/7', '6/7', '6/7', '7/7']
    },
    {
        id: 2,
        name: 'Exercise',
        iconKey: 'exercise',
        iconBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        completedDays: 18,
        totalDays: 30,
        streak: 3,
        weeks: ['4/7', '5/7', '4/7', '5/7']
    },
    {
        id: 3,
        name: 'Meditate',
        iconKey: 'meditate',
        iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        completedDays: 20,
        totalDays: 30,
        streak: 4,
        weeks: ['5/7', '4/7', '5/7', '6/7']
    },
    {
        id: 4,
        name: 'Read',
        iconKey: 'read',
        iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        completedDays: 14,
        totalDays: 30,
        streak: 2,
        weeks: ['3/7', '4/7', '3/7', '4/7']
    }
];

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const daysOfWeekFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function HabitTracker() {
    const dropdownRef = useRef(null);

    // Selected timeframe (This Week / Last Week / Monthly Overview)
    const [timeframe, setTimeframe] = useState(() => {
        try {
            return localStorage.getItem(TIMEFRAME_STORAGE_KEY) || 'This Week';
        } catch {
            return 'This Week';
        }
    });

    const [showDropdown, setShowDropdown] = useState(false);

    // Separate persistent states for This Week and Last Week
    const [thisWeekHabits, setThisWeekHabits] = useState(() => {
        try {
            const saved = localStorage.getItem(THIS_WEEK_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error(e);
        }
        return DEFAULT_THIS_WEEK;
    });

    const [lastWeekHabits, setLastWeekHabits] = useState(() => {
        try {
            const saved = localStorage.getItem(LAST_WEEK_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error(e);
        }
        return DEFAULT_LAST_WEEK;
    });

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Save This Week habits
    useEffect(() => {
        try {
            localStorage.setItem(THIS_WEEK_STORAGE_KEY, JSON.stringify(thisWeekHabits));
        } catch (e) {
            console.error(e);
        }
    }, [thisWeekHabits]);

    // Save Last Week habits
    useEffect(() => {
        try {
            localStorage.setItem(LAST_WEEK_STORAGE_KEY, JSON.stringify(lastWeekHabits));
        } catch (e) {
            console.error(e);
        }
    }, [lastWeekHabits]);

    const handleTimeframeChange = (tf) => {
        setTimeframe(tf);
        setShowDropdown(false);
        try {
            localStorage.setItem(TIMEFRAME_STORAGE_KEY, tf);
        } catch (e) {
            console.error(e);
        }
    };

    // Toggle day for the currently active timeframe
    const toggleDay = (habitIdx, dayIdx) => {
        if (timeframe === 'This Week') {
            setThisWeekHabits(prevHabits => {
                return prevHabits.map((h, idx) => {
                    if (idx === habitIdx) {
                        const newDays = [...h.days];
                        newDays[dayIdx] = !newDays[dayIdx];
                        const newStatus = newDays[dayIdx];

                        logDashboardActivity({
                            type: 'habit',
                            title: `${newStatus ? 'Completed Habit' : 'Unchecked Habit'}: ${h.name} (${daysOfWeekFull[dayIdx]})`,
                            tag: 'Habit',
                            detail: `This Week • ${daysOfWeekFull[dayIdx]} marked ${newStatus ? 'Done' : 'Incomplete'}`
                        });

                        return { ...h, days: newDays };
                    }
                    return h;
                });
            });
        } else if (timeframe === 'Last Week') {
            setLastWeekHabits(prevHabits => {
                return prevHabits.map((h, idx) => {
                    if (idx === habitIdx) {
                        const newDays = [...h.days];
                        newDays[dayIdx] = !newDays[dayIdx];
                        const newStatus = newDays[dayIdx];

                        logDashboardActivity({
                            type: 'habit',
                            title: `Updated Last Week Habit: ${h.name} (${daysOfWeekFull[dayIdx]})`,
                            tag: 'Habit',
                            detail: `Last Week • ${daysOfWeekFull[dayIdx]} marked ${newStatus ? 'Done' : 'Incomplete'}`
                        });

                        return { ...h, days: newDays };
                    }
                    return h;
                });
            });
        }
    };

    // Active dataset based on selected dropdown
    const activeHabits = timeframe === 'Last Week' ? lastWeekHabits : thisWeekHabits;

    return (
        <div className="glass-card" style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.titleWithBadge}>
                    <h2 style={styles.cardTitle}>Habit Tracker</h2>
                    <span style={styles.timeframeIndicator}>
                        {timeframe === 'This Week' && 'Current Week'}
                        {timeframe === 'Last Week' && 'Previous Week'}
                        {timeframe === 'Monthly Overview' && 'Sep 2026 Overview'}
                    </span>
                </div>

                {/* Dropdown Menu */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button 
                        onClick={() => setShowDropdown(prev => !prev)} 
                        style={styles.dropdownBtn}
                        type="button"
                    >
                        <span>{timeframe}</span>
                        <ChevronDown size={14} color="#94a3b8" />
                    </button>

                    {showDropdown && (
                        <div style={styles.dropdownMenu}>
                            {['This Week', 'Last Week', 'Monthly Overview'].map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => handleTimeframeChange(tf)}
                                    style={{
                                        ...styles.dropdownItem,
                                        color: timeframe === tf ? '#c084fc' : '#94a3b8',
                                        background: timeframe === tf ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
                                        fontWeight: timeframe === tf ? '600' : '400'
                                    }}
                                    type="button"
                                >
                                    <span>{tf}</span>
                                    {timeframe === tf && <span style={styles.checkDot}>✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* View 1: Weekly Grid for "This Week" and "Last Week" */}
            {timeframe !== 'Monthly Overview' ? (
                <div style={styles.tableContainer}>
                    {/* Header Days Row */}
                    <div style={styles.tableHeaderRow}>
                        <div style={styles.habitColHeader}>
                            <span style={styles.subtextLabel}>
                                {timeframe === 'This Week' ? 'Current Goals' : 'Past Records'}
                            </span>
                        </div>
                        <div style={styles.daysHeaderGrid}>
                            {daysOfWeek.map((d, i) => (
                                <span key={i} style={styles.dayColLabel}>{d}</span>
                            ))}
                        </div>
                    </div>

                    {/* Habit Rows */}
                    <div style={styles.rowsList}>
                        {activeHabits.map((habit, hIdx) => {
                            const Icon = ICON_MAP[habit.iconKey] || GraduationCap;
                            const completedInWeek = habit.days.filter(Boolean).length;

                            return (
                                <div key={habit.id} style={styles.habitRow}>
                                    {/* Icon + Name + Completed count */}
                                    <div style={styles.habitInfo}>
                                        <div style={{ ...styles.habitIconWrap, background: habit.iconBg }}>
                                            <Icon size={14} color="#ffffff" strokeWidth={2.2} />
                                        </div>
                                        <div style={styles.habitTextCol}>
                                            <span style={styles.habitName}>{habit.name}</span>
                                            <span style={styles.habitScoreText}>{completedInWeek}/7 days</span>
                                        </div>
                                    </div>

                                    {/* 7 Day Check Bubbles */}
                                    <div style={styles.bubblesGrid}>
                                        {habit.days.map((isDone, dIdx) => (
                                            <button
                                                key={dIdx}
                                                onClick={() => toggleDay(hIdx, dIdx)}
                                                style={{
                                                    ...styles.bubbleBtn,
                                                    background: isDone ? '#8b5cf6' : 'transparent',
                                                    borderColor: isDone ? '#8b5cf6' : 'rgba(255, 255, 255, 0.22)',
                                                    boxShadow: isDone ? '0 0 10px rgba(139, 92, 246, 0.65)' : 'none'
                                                }}
                                                aria-label={`${habit.name} on ${daysOfWeekFull[dIdx]}: ${isDone ? 'completed' : 'incomplete'}`}
                                                type="button"
                                                title={`${daysOfWeekFull[dIdx]}: Click to toggle`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* View 2: Monthly Overview View */
                <div style={styles.monthlyContainer}>
                    <div style={styles.monthlySummaryHeader}>
                        <div style={styles.monthlyMetric}>
                            <span style={styles.metricTitle}>Overall Consistency</span>
                            <span style={styles.metricVal}>76%</span>
                        </div>
                        <div style={styles.monthlyMetric}>
                            <span style={styles.metricTitle}>Total Completed</span>
                            <span style={styles.metricVal}>76 / 120 Days</span>
                        </div>
                        <div style={styles.monthlyMetric}>
                            <span style={styles.metricTitle}>Active Habits</span>
                            <span style={styles.metricVal}>4 / 4 Tracked</span>
                        </div>
                    </div>

                    <div style={styles.monthlyList}>
                        {MONTHLY_STATS.map((item) => {
                            const Icon = ICON_MAP[item.iconKey] || GraduationCap;
                            const pct = Math.round((item.completedDays / item.totalDays) * 100);

                            return (
                                <div key={item.id} style={styles.monthlyRow}>
                                    <div style={styles.monthlyHabitInfo}>
                                        <div style={{ ...styles.habitIconWrap, background: item.iconBg }}>
                                            <Icon size={14} color="#ffffff" strokeWidth={2.2} />
                                        </div>
                                        <span style={styles.habitName}>{item.name}</span>
                                    </div>

                                    {/* Monthly Progress Bar */}
                                    <div style={styles.monthlyProgressCol}>
                                        <div style={styles.progressBarTrack}>
                                            <div 
                                                style={{
                                                    ...styles.progressBarFill,
                                                    width: `${pct}%`,
                                                    background: item.iconBg
                                                }}
                                            />
                                        </div>
                                        <div style={styles.progressMeta}>
                                            <span>{item.completedDays} / {item.totalDays} days</span>
                                            <span style={styles.pctBadge}>{pct}%</span>
                                        </div>
                                    </div>

                                    {/* Week by week badges */}
                                    <div style={styles.weeksBadgesCol}>
                                        {item.weeks.map((w, wIdx) => (
                                            <span key={wIdx} style={styles.weekPill} title={`Week ${wIdx + 1}`}>
                                                W{wIdx + 1}: {w}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Streak Badge */}
                                    <div style={styles.streakBadge}>
                                        <Flame size={12} color="#f97316" />
                                        <span>{item.streak}d streak</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    card: {
        height: '100%',
        justifyContent: 'space-between',
        padding: '1.2rem 1.4rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.8rem'
    },
    titleWithBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
    },
    cardTitle: {
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#ffffff'
    },
    timeframeIndicator: {
        fontSize: '0.68rem',
        fontWeight: '600',
        color: '#c084fc',
        background: 'rgba(168, 85, 247, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        padding: '2px 8px',
        borderRadius: '9999px'
    },
    dropdownBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '0.3rem 0.75rem',
        fontSize: '0.75rem',
        color: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    dropdownMenu: {
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 6px)',
        background: 'rgba(18, 19, 38, 0.96)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        zIndex: 100,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(16px)',
        minWidth: '155px'
    },
    dropdownItem: {
        border: 'none',
        borderRadius: '8px',
        padding: '7px 12px',
        fontSize: '0.75rem',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    checkDot: {
        fontSize: '0.75rem',
        color: '#c084fc',
        fontWeight: 'bold'
    },
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
    },
    tableHeaderRow: {
        display: 'flex',
        alignItems: 'center'
    },
    habitColHeader: {
        width: '130px'
    },
    subtextLabel: {
        fontSize: '0.7rem',
        color: '#64748b',
        fontWeight: '500'
    },
    daysHeaderGrid: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        paddingRight: '0.5rem'
    },
    dayColLabel: {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#64748b',
        width: '20px',
        textAlign: 'center'
    },
    rowsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
    },
    habitRow: {
        display: 'flex',
        alignItems: 'center'
    },
    habitInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        width: '130px'
    },
    habitTextCol: {
        display: 'flex',
        flexDirection: 'column'
    },
    habitIconWrap: {
        width: '26px',
        height: '26px',
        borderRadius: '7px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    habitName: {
        fontSize: '0.82rem',
        fontWeight: '500',
        color: '#f8fafc'
    },
    habitScoreText: {
        fontSize: '0.68rem',
        color: '#64748b'
    },
    bubblesGrid: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        paddingRight: '0.5rem'
    },
    bubbleBtn: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: 0
    },
    // Monthly View Styles
    monthlyContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
    },
    monthlySummaryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '0.5rem 0.9rem'
    },
    monthlyMetric: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    metricTitle: {
        fontSize: '0.68rem',
        color: '#64748b'
    },
    metricVal: {
        fontSize: '0.82rem',
        fontWeight: '600',
        color: '#c084fc'
    },
    monthlyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem'
    },
    monthlyRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '0.5rem 0.8rem',
        gap: '0.75rem'
    },
    monthlyHabitInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '110px'
    },
    monthlyProgressCol: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxWidth: '180px'
    },
    progressBarTrack: {
        width: '100%',
        height: '5px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        borderRadius: '9999px',
        transition: 'width 0.4s ease'
    },
    progressMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.68rem',
        color: '#94a3b8'
    },
    pctBadge: {
        fontWeight: '600',
        color: '#f8fafc'
    },
    weeksBadgesCol: {
        display: 'flex',
        gap: '4px'
    },
    weekPill: {
        fontSize: '0.64rem',
        color: '#94a3b8',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '4px',
        padding: '2px 5px'
    },
    streakBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        fontSize: '0.7rem',
        fontWeight: '600',
        color: '#fdba74',
        background: 'rgba(249, 115, 22, 0.15)',
        border: '1px solid rgba(249, 115, 22, 0.3)',
        borderRadius: '6px',
        padding: '3px 7px'
    }
};