import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { logDashboardActivity } from '../utils/activityLogger';

const NOTES_STORAGE_KEY = 'weather_dashboard_quick_notes';

const DEFAULT_NOTES = [
    'Study differential equations',
    'Revise thermodynamics',
    'Work on project prototype',
    'Call library for book renewal'
];

export default function QuickNotes() {
    const [notes, setNotes] = useState(() => {
        try {
            const saved = localStorage.getItem(NOTES_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error('Failed to load notes from localStorage:', e);
        }
        return DEFAULT_NOTES;
    });

    const [showInput, setShowInput] = useState(false);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        } catch (e) {
            console.error('Failed to save notes to localStorage:', e);
        }
    }, [notes]);

    const handleAddNote = (e) => {
        e.preventDefault();
        if (!noteText.trim()) return;
        const newNote = noteText.trim();
        setNotes(prev => [...prev, newNote]);

        // Immediately log activity
        logDashboardActivity({
            type: 'note',
            title: `Added Quick Note: "${newNote}"`,
            tag: 'Notes'
        });

        setNoteText('');
        setShowInput(false);
    };

    const handleDeleteNote = (idxToDelete) => {
        const noteToDelete = notes[idxToDelete];
        setNotes(notes.filter((_, idx) => idx !== idxToDelete));
        if (noteToDelete) {
            logDashboardActivity({
                type: 'note',
                title: `Deleted Quick Note: "${noteToDelete}"`,
                tag: 'Notes'
            });
        }
    };

    return (
        <div className="glass-card" style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.cardTitle}>Quick Notes</h2>
                <button 
                    onClick={() => setShowInput(!showInput)}
                    style={styles.addNoteBtn}
                    aria-label="Add note"
                >
                    <Plus size={14} color="#94a3b8" />
                </button>
            </div>

            {/* Optional Input Box */}
            {showInput && (
                <form onSubmit={handleAddNote} style={styles.inputForm}>
                    <input
                        type="text"
                        placeholder="Write a quick note..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        autoFocus
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                    />
                    <button type="submit" style={styles.saveBtn}>Save</button>
                </form>
            )}

            {/* Bullets List */}
            <div style={styles.bulletList}>
                {notes.map((note, idx) => (
                    <div key={idx} style={styles.noteItem}>
                        <div style={styles.noteLeft}>
                            <span style={styles.bulletDot}>•</span>
                            <span style={styles.noteText}>{note}</span>
                        </div>
                        <button 
                            onClick={() => handleDeleteNote(idx)} 
                            style={styles.deleteBtn}
                            title="Delete note"
                        >
                            <X size={12} color="#64748b" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Inspiring Footer */}
            <div style={styles.footerQuote}>
                <span>Keep going! You're doing great. 💜</span>
            </div>
        </div>
    );
}

const styles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.2rem 1.4rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.8rem'
    },
    cardTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ffffff'
    },
    addNoteBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        width: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    inputForm: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '0.8rem'
    },
    saveBtn: {
        background: '#8b5cf6',
        color: '#fff',
        fontSize: '0.75rem',
        padding: '0 0.8rem',
        borderRadius: '6px'
    },
    bulletList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem',
        flex: 1
    },
    noteItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: '#cbd5e1'
    },
    noteLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    bulletDot: {
        color: '#a855f7',
        fontSize: '1.2rem',
        lineHeight: '1'
    },
    noteText: {
        color: '#cbd5e1'
    },
    deleteBtn: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px'
    },
    footerQuote: {
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '0.8rem',
        marginTop: '0.8rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#a855f7',
        fontStyle: 'italic'
    }
};