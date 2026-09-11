import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';

export default function Header({ weather, loading, error, onSearch, currentUser }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = currentTime.getHours();
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() && onSearch) {
            onSearch(searchTerm.trim());
        }
    };

    const displayName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Eris';

    return (
        <header style={styles.header}>
            {/* Left: Greeting */}
            <div style={styles.greetingSection}>
                <h1 style={styles.title}>Good Morning,</h1>
                <div style={styles.nameRow}>
                    <span style={styles.nameHighlight}>{displayName}</span>
                    <span style={styles.waveEmoji} role="img" aria-label="wave">👋</span>
                </div>
                <p style={styles.subtitle}>Focus • Plan • Execute • Succeed</p>
                {/* API Key Status Pill */}
                <div
                    className={`apikey-status-pill ${currentUser?.apiKey ? 'active' : 'inactive'}`}
                    style={{ marginTop: '4px' }}
                    title={currentUser?.apiKey ? 'Custom API key is active' : 'Using demo API key'}
                >
                    <span className="apikey-status-dot" />
                    <span>{currentUser?.apiKey ? 'Key: Active ✓' : 'Demo Key'}</span>
                </div>
            </div>

            {/* Center: Search Box */}
            <div style={styles.searchSection}>
                <form onSubmit={handleSubmit} style={styles.searchForm}>
                    <Search size={16} color="#c084fc" style={{ marginLeft: '4px', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search city or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            style={styles.clearBtn}
                            title="Clear input"
                        >
                            <X size={13} color="#94a3b8" />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.searchBtn}
                        title="Search weather"
                    >
                        {loading ? (
                            <Loader2 size={15} color="#ffffff" className="spin" />
                        ) : (
                            <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>Search</span>
                        )}
                    </button>
                </form>

                {/* Error message pill */}
                {error && (
                    <div style={styles.errorBadge}>
                        <span>⚠️ {error}. Please try another city or country.</span>
                    </div>
                )}
            </div>

            {/* Right: Large Clock & Date */}
            <div style={styles.timeSection}>
                <div style={styles.clockRow}>
                    <span style={styles.clockDigits}>{formattedHours}:{minutes}</span>
                    <span style={styles.clockPeriod}>{ampm}</span>
                </div>
                <div style={styles.dateLabel}>{formattedDate}</div>
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0.25rem 0.75rem 0.25rem',
        flexWrap: 'wrap',
        gap: '1.25rem'
    },
    greetingSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
        minWidth: '220px'
    },
    title: {
        fontSize: '1.9rem',
        fontWeight: '600',
        color: '#ffffff',
        letterSpacing: '-0.02em',
        lineHeight: 1.15
    },
    nameRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        lineHeight: 1.15
    },
    nameHighlight: {
        fontSize: '1.9rem',
        fontWeight: '700',
        color: '#c084fc',
        letterSpacing: '-0.02em'
    },
    waveEmoji: {
        fontSize: '1.7rem',
        display: 'inline-block'
    },
    subtitle: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        fontWeight: '400',
        marginTop: '0.35rem',
        letterSpacing: '0.02em'
    },
    searchSection: {
        flex: 1,
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        margin: '0 0.5rem'
    },
    searchForm: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '30px',
        padding: '0.35rem 0.45rem 0.35rem 0.85rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    },
    searchInput: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        color: '#ffffff',
        fontSize: '0.82rem',
        padding: '0.3rem 0.2rem',
        outline: 'none'
    },
    clearBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        opacity: 0.6
    },
    searchBtn: {
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '0.4rem 0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(168, 85, 247, 0.4)'
    },
    errorBadge: {
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        color: '#fca5a5',
        borderRadius: '14px',
        padding: '0.25rem 0.75rem',
        fontSize: '0.75rem'
    },
    timeSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        minWidth: '200px'
    },
    clockRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.35rem',
        lineHeight: 1
    },
    clockDigits: {
        fontSize: '3rem',
        fontWeight: '700',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.03em'
    },
    clockPeriod: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#818cf8',
        letterSpacing: '0.05em'
    },
    dateLabel: {
        fontSize: '0.88rem',
        color: '#94a3b8',
        fontWeight: '400',
        marginTop: '0.4rem'
    }
};