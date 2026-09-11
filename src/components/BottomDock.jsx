import React from 'react';

export default function BottomDock() {
    return (
        <div style={styles.dockWrapper}>
            <div style={styles.dockBar}>
                {/* 1. Launchpad / App Grid */}
                <button className="dock-btn" style={styles.dockItem} title="Applications">
                    <div style={{ ...styles.appIconBase, background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)' }}>
                        <div style={styles.grid2x2}>
                            <div style={styles.gridMiniDot} />
                            <div style={styles.gridMiniDot} />
                            <div style={styles.gridMiniDot} />
                            <div style={styles.gridMiniDot} />
                        </div>
                    </div>
                </button>

                {/* 2. Finder / Folder */}
                <button className="dock-btn" style={styles.dockItem} title="Finder">
                    <div style={{ ...styles.appIconBase, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" fill="#3b82f6" fillOpacity="0.4" />
                        </svg>
                    </div>
                </button>

                {/* 3. Calendar (Red top + 28) */}
                <button className="dock-btn" style={styles.dockItem} title="Calendar">
                    <div style={{ ...styles.appIconBase, background: '#ffffff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={styles.calendarRedTop} />
                        <div style={styles.calendarDateNum}>28</div>
                    </div>
                </button>

                {/* 4. Reminders / Checklist */}
                <button className="dock-btn" style={styles.dockItem} title="Reminders">
                    <div style={{ ...styles.appIconBase, background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '4px', padding: '6px' }}>
                        <div style={styles.reminderRow}>
                            <span style={{ ...styles.reminderDot, background: '#ef4444' }} />
                            <span style={styles.reminderLine} />
                        </div>
                        <div style={styles.reminderRow}>
                            <span style={{ ...styles.reminderDot, background: '#f59e0b' }} />
                            <span style={styles.reminderLine} />
                        </div>
                        <div style={styles.reminderRow}>
                            <span style={{ ...styles.reminderDot, background: '#3b82f6' }} />
                            <span style={styles.reminderLine} />
                        </div>
                    </div>
                </button>

                {/* 5. Clock */}
                <button className="dock-btn" style={styles.dockItem} title="Clock">
                    <div style={{ ...styles.appIconBase, background: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                </button>

                {/* 6. Notes */}
                <button className="dock-btn" style={styles.dockItem} title="Notes">
                    <div style={{ ...styles.appIconBase, background: '#f8fafc', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={styles.notesYellowTop} />
                        <div style={styles.notesLines}>
                            <div style={styles.notesLine} />
                            <div style={styles.notesLine} />
                            <div style={styles.notesLine} />
                        </div>
                    </div>
                </button>

                {/* 7. Trash */}
                <button className="dock-btn" style={styles.dockItem} title="Trash">
                    <div style={{ ...styles.appIconBase, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
}

const styles = {
    dockWrapper: {
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        pointerEvents: 'auto'
    },
    dockBar: {
        background: 'rgba(18, 19, 36, 0.72)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '26px',
        padding: '0.45rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    },
    dockItem: {
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    appIconBase: {
        width: '38px',
        height: '38px',
        borderRadius: '11px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    grid2x2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 6px)',
        gap: '4px'
    },
    gridMiniDot: {
        width: '6px',
        height: '6px',
        backgroundColor: '#ffffff',
        borderRadius: '1.5px'
    },
    calendarRedTop: {
        width: '100%',
        height: '11px',
        background: '#ef4444'
    },
    calendarDateNum: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1e293b',
        fontSize: '0.92rem',
        fontWeight: '700',
        lineHeight: 1
    },
    reminderRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        width: '100%'
    },
    reminderDot: {
        width: '5px',
        height: '5px',
        borderRadius: '50%'
    },
    reminderLine: {
        height: '2.5px',
        flex: 1,
        background: '#cbd5e1',
        borderRadius: '2px'
    },
    notesYellowTop: {
        width: '100%',
        height: '10px',
        background: '#fbbf24'
    },
    notesLines: {
        padding: '3px 4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        flex: 1
    },
    notesLine: {
        height: '2px',
        background: '#94a3b8',
        borderRadius: '1px',
        opacity: 0.6
    }
};