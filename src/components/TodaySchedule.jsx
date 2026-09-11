import React from 'react';

export default function TodaySchedule() {
    const scheduleItems = [
        {
            startTime: '09:00',
            endTime: '10:30',
            dotColor: '#a855f7',
            title: 'Physics Lecture',
            subtitle: 'Quantum Mechanics'
        },
        {
            startTime: '11:00',
            endTime: '12:00',
            dotColor: '#38bdf8',
            title: 'Project Meeting',
            subtitle: 'Team Sync'
        },
        {
            startTime: '13:00',
            endTime: '14:00',
            dotColor: '#f59e0b',
            title: 'Lunch Break',
            subtitle: 'Take a short break'
        },
        {
            startTime: '15:00',
            endTime: '17:00',
            dotColor: '#10b981',
            title: 'Study Session',
            subtitle: 'Data Structures'
        }
    ];

    return (
        <div className="glass-card" style={styles.card}>
            <h2 style={styles.cardTitle}>Today's Schedule</h2>
            <div style={styles.scheduleList}>
                {scheduleItems.map((item, idx) => (
                    <div key={idx} style={styles.scheduleRow}>
                        <div style={styles.timeColumn}>
                            <span style={styles.timeText}>{item.startTime}</span>
                            <span style={styles.timeSubtext}>{item.endTime}</span>
                        </div>
                        <div style={styles.contentColumn}>
                            <div style={styles.titleRow}>
                                <span 
                                    style={{
                                        ...styles.bulletDot,
                                        backgroundColor: item.dotColor,
                                        boxShadow: `0 0 8px ${item.dotColor}88`
                                    }} 
                                />
                                <span style={styles.itemTitle}>{item.title}</span>
                            </div>
                            <span style={styles.itemSubtitle}>{item.subtitle}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    card: {
        height: '100%',
        justifyContent: 'space-between'
    },
    cardTitle: {
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '0.85rem'
    },
    scheduleList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        flex: 1,
        justifyContent: 'space-between'
    },
    scheduleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.55rem 0.75rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        transition: 'background 0.2s ease'
    },
    timeColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: '42px'
    },
    timeText: {
        fontSize: '0.78rem',
        color: '#e2e8f0',
        fontWeight: '500',
        lineHeight: 1.2
    },
    timeSubtext: {
        fontSize: '0.72rem',
        color: '#64748b',
        fontWeight: '400',
        lineHeight: 1.2
    },
    contentColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem'
    },
    titleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem'
    },
    bulletDot: {
        width: '6.5px',
        height: '6.5px',
        borderRadius: '50%'
    },
    itemTitle: {
        fontSize: '0.88rem',
        fontWeight: '500',
        color: '#ffffff'
    },
    itemSubtitle: {
        fontSize: '0.74rem',
        color: '#94a3b8',
        marginLeft: '0.9rem'
    }
};