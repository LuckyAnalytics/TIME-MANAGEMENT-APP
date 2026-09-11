import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarCard() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // First day index (0=Sun, 1=Mon, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Days in previous month
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous month trailing days
    const trailingDays = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        trailingDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    // Current month days
    const currentMonthDays = [];
    for (let d = 1; d <= totalDays; d++) {
        currentMonthDays.push({ day: d, isCurrentMonth: true });
    }

    // Next month leading days to complete the 35 or 42 grid
    const totalCells = trailingDays.length + currentMonthDays.length;
    const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
    const leadingDays = [];
    for (let n = 1; n <= (remainingCells === 0 ? 0 : remainingCells); n++) {
        leadingDays.push({ day: n, isCurrentMonth: false });
    }

    const allDays = [...trailingDays, ...currentMonthDays, ...leadingDays];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="glass-card" style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.cardTitle}>Calendar</h2>
                <div style={styles.navRow}>
                    <button 
                        onClick={handlePrevMonth} 
                        style={styles.navArrowBtn} 
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={16} color="#94a3b8" />
                    </button>
                    <span style={styles.monthYearText}>
                        {months[month]} {year}
                    </span>
                    <button 
                        onClick={handleNextMonth} 
                        style={styles.navArrowBtn} 
                        aria-label="Next Month"
                    >
                        <ChevronRight size={16} color="#94a3b8" />
                    </button>
                </div>
            </div>

            {/* Days of week header */}
            <div style={styles.weekdaysGrid}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={idx} style={styles.weekdayLabel}>{day}</div>
                ))}
            </div>

            {/* Dates Grid */}
            <div style={styles.datesGrid}>
                {allDays.map((item, idx) => {
                    const isToday = item.isCurrentMonth &&
                        item.day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();
                    const isSelected = item.isCurrentMonth && item.day === selectedDay;
                    const hasDot = isToday;

                    return (
                        <div
                            key={idx}
                            onClick={() => item.isCurrentMonth && setSelectedDay(item.day)}
                            style={{
                                ...styles.dateCell,
                                color: !item.isCurrentMonth
                                    ? '#475569'
                                    : isSelected
                                    ? '#ffffff'
                                    : '#e2e8f0',
                                background: isSelected ? '#8b5cf6' : 'transparent',
                                boxShadow: isSelected ? '0 0 16px rgba(139, 92, 246, 0.65)' : 'none',
                                cursor: item.isCurrentMonth ? 'pointer' : 'default',
                                fontWeight: isSelected ? '700' : '400'
                            }}
                        >
                            <span>{item.day}</span>
                            {hasDot && !isSelected && (
                                <span style={styles.eventDot} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    card: {
        height: '100%',
        justifyContent: 'space-between'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.85rem'
    },
    cardTitle: {
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#ffffff'
    },
    navRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem'
    },
    navArrowBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        opacity: 0.8
    },
    monthYearText: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#94a3b8',
        minWidth: '78px',
        textAlign: 'center'
    },
    weekdaysGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        textAlign: 'center',
        marginBottom: '0.4rem'
    },
    weekdayLabel: {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#64748b',
        padding: '2px 0'
    },
    datesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '3px',
        textAlign: 'center'
    },
    dateCell: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.82rem',
        position: 'relative',
        transition: 'all 0.15s ease'
    },
    eventDot: {
        width: '3.5px',
        height: '3.5px',
        borderRadius: '50%',
        backgroundColor: '#a855f7',
        position: 'absolute',
        bottom: '2px'
    }
};