import React from 'react';

// Exact SVG icons matching reference screenshot
function HomeIcon({ size = 23, strokeWidth = 2.2, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3.5 10.8L12 3.8l8.5 7V19.2a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2v-8.4z" />
            <path d="M9.5 21.2v-6.2a2.5 2.5 0 0 1 5 0v6.2" />
        </svg>
    );
}

function CalendarIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="3" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}

function TasksIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="3.2" />
            <path d="m8.5 12.2 2.5 2.5 4.8-4.8" />
        </svg>
    );
}

function FolderIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
    );
}

function TrendingIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}

function ClockIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="9.5" />
            <polyline points="12 6.5 12 12 8 12" />
        </svg>
    );
}

function SettingsIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function HistoryIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5" />
            <path d="M3.5 3.5v5h5" />
            <polyline points="12 7 12 12 15.5 14" />
        </svg>
    );
}

function UserIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="4.2" />
            <path d="M4.5 20.2c0-3.8 3.3-6.8 7.5-6.8s7.5 3 7.5 6.8" />
        </svg>
    );
}

function MoonIcon({ size = 23, strokeWidth = 2.1, color = 'currentColor', fill = 'none' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    );
}

export default function Sidebar({ activeSection, onNav, moonOn, onMoonToggle }) {
    const navItems = [
        { id: 'home',      icon: HomeIcon,     label: 'Home' },
        { id: 'calendar',  icon: CalendarIcon, label: 'Calendar' },
        { id: 'tasks',     icon: TasksIcon,    label: 'Tasks & Habits' },
        { id: 'notes',     icon: FolderIcon,   label: 'Quick Notes' },
        { id: 'weather',   icon: TrendingIcon, label: 'Weather Trends' },
        { id: 'timer',     icon: ClockIcon,    label: 'Focus Timer' },
        { id: 'settings',  icon: SettingsIcon, label: 'Settings' },
        { id: 'history',   icon: HistoryIcon,  label: "Yesterday's Log" },
        { id: 'user',      icon: UserIcon,     label: 'Login & Profile' },
    ];

    return (
        <div className="capsule-dock-wrapper">
            <aside className="capsule-dock" aria-label="Main Navigation">
                {/* Top Nav Items Group */}
                <div className="capsule-nav-group">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNav(item.id)}
                                className={`capsule-nav-btn ${isActive ? 'active' : ''}`}
                                aria-label={item.label}
                                type="button"
                            >
                                <Icon
                                    size={item.id === 'home' && isActive ? 24 : 22}
                                    strokeWidth={isActive ? 2.3 : 2.1}
                                    color={isActive ? '#ffffff' : '#7b849e'}
                                />
                                <span className="capsule-tooltip">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Moon Group */}
                <div className="capsule-bottom-group">
                    <button
                        onClick={onMoonToggle}
                        className={`capsule-nav-btn ${moonOn ? 'moon-active' : ''}`}
                        aria-label="Toggle Night Mode"
                        type="button"
                    >
                        <MoonIcon
                            size={22}
                            strokeWidth={2.1}
                            color={moonOn ? '#ffffff' : '#7b849e'}
                            fill={moonOn ? '#ffffff' : 'none'}
                        />
                        <span className="capsule-tooltip">
                            {moonOn ? 'Day Mode' : 'Night Mode'}
                        </span>
                    </button>
                </div>
            </aside>
        </div>
    );
}