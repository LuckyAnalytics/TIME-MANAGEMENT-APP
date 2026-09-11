import React from 'react';
import { FileText, FlaskConical, BookOpen } from 'lucide-react';

export default function Deadlines() {
    const deadlines = [
        {
            id: 1,
            title: 'Data Structures Assignment',
            due: 'Due in 2 days • May 30, 2024',
            priority: 'High',
            badgeBg: 'rgba(168, 85, 247, 0.12)',
            badgeBorder: 'rgba(168, 85, 247, 0.35)',
            badgeColor: '#c084fc',
            icon: FileText,
            iconBg: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
        },
        {
            id: 2,
            title: 'Chemistry Lab Report',
            due: 'Due in 4 days • June 1, 2024',
            priority: 'Medium',
            badgeBg: 'rgba(56, 189, 248, 0.12)',
            badgeBorder: 'rgba(56, 189, 248, 0.35)',
            badgeColor: '#38bdf8',
            icon: FlaskConical,
            iconBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
        },
        {
            id: 3,
            title: 'Physics Quiz',
            due: 'Due in 7 days • June 4, 2024',
            priority: 'Medium',
            badgeBg: 'rgba(245, 158, 11, 0.12)',
            badgeBorder: 'rgba(245, 158, 11, 0.35)',
            badgeColor: '#fbbf24',
            icon: BookOpen,
            iconBg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
        }
    ];

    return (
        <div className="glass-card" style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.cardTitle}>Upcoming Deadlines</h2>
                <button style={styles.viewAllBtn}>View All</button>
            </div>

            {/* List */}
            <div style={styles.list}>
                {deadlines.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.id} style={styles.deadlineRow}>
                            {/* Colored Icon Squircle */}
                            <div style={{ ...styles.iconSquircle, background: item.iconBg }}>
                                <Icon size={18} color="#ffffff" strokeWidth={2.2} />
                            </div>

                            {/* Info */}
                            <div style={styles.infoCol}>
                                <div style={styles.itemTitle}>{item.title}</div>
                                <div style={styles.itemDue}>{item.due}</div>
                            </div>

                            {/* Priority Badge */}
                            <span 
                                style={{
                                    ...styles.priorityBadge,
                                    backgroundColor: item.badgeBg,
                                    borderColor: item.badgeBorder,
                                    color: item.badgeColor
                                }}
                            >
                                {item.priority}
                            </span>
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
    viewAllBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '0.25rem 0.65rem',
        fontSize: '0.75rem',
        color: '#94a3b8',
        fontWeight: '500'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
    },
    deadlineRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.45rem 0.2rem'
    },
    iconSquircle: {
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
    },
    infoCol: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem'
    },
    itemTitle: {
        fontSize: '0.88rem',
        fontWeight: '500',
        color: '#ffffff'
    },
    itemDue: {
        fontSize: '0.74rem',
        color: '#94a3b8'
    },
    priorityBadge: {
        fontSize: '0.72rem',
        fontWeight: '500',
        padding: '0.25rem 0.65rem',
        borderRadius: '10px',
        border: '1px solid'
    }
};