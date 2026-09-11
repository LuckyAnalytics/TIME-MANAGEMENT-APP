import React, { useState, useEffect } from 'react';
import { 
    X, 
    CheckCircle2, 
    Clock, 
    Flame, 
    BookOpen, 
    Plus, 
    Trash2, 
    Calendar, 
    Sparkles, 
    Award,
    Edit3,
    Check,
    Activity,
    Zap,
    Send
} from 'lucide-react';
import { 
    getStoredYesterdayData, 
    logDashboardActivity, 
    ACTIVITY_STORAGE_KEY 
} from '../utils/activityLogger';

export default function YesterdayModal({ isOpen, onClose }) {
    const [data, setData] = useState(() => getStoredYesterdayData());

    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'live-feed' | 'tasks' | 'notes'
    const [newNote, setNewNote] = useState('');
    const [isEditingNote, setIsEditingNote] = useState(false);
    
    // Quick Add Custom Activity
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [customActivityTitle, setCustomActivityTitle] = useState('');
    const [customActivityType, setCustomActivityType] = useState('task');
    const [customActivityTag, setCustomActivityTag] = useState('Study');

    // Add Past Task
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskTag, setNewTaskTag] = useState('Study');
    const [showAddTask, setShowAddTask] = useState(false);

    // Reload latest data whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setData(getStoredYesterdayData());
        }
    }, [isOpen]);

    // Live listener for activities happening in real-time across the dashboard
    useEffect(() => {
        const handleActivityLogged = () => {
            setData(getStoredYesterdayData());
        };

        window.addEventListener('dashboard-activity-logged', handleActivityLogged);
        return () => window.removeEventListener('dashboard-activity-logged', handleActivityLogged);
    }, []);

    // Persist changes to localStorage
    useEffect(() => {
        if (data) {
            try {
                localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('Failed to save yesterday data:', e);
            }
        }
    }, [data]);

    useEffect(() => {
        if (data && data.notes !== undefined) {
            setNewNote(data.notes || '');
        }
    }, [data]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Handlers
    const toggleTask = (taskId) => {
        setData(prev => {
            const updatedTasks = prev.tasks.map(t => {
                if (t.id === taskId) {
                    const nextStatus = !t.completed;
                    logDashboardActivity({
                        type: 'task',
                        title: `${nextStatus ? 'Completed' : 'Reopened'}: ${t.title}`,
                        tag: t.tag || 'Task'
                    });
                    return { ...t, completed: nextStatus };
                }
                return t;
            });
            const completedCount = updatedTasks.filter(t => t.completed).length;
            const newScore = Math.round((completedCount / updatedTasks.length) * 100);
            return {
                ...prev,
                tasks: updatedTasks,
                productivityScore: newScore
            };
        });
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const newTask = {
            id: Date.now(),
            title: newTaskText.trim(),
            tag: newTaskTag,
            completed: true,
            time: 'Yesterday'
        };

        setData(prev => {
            const updatedTasks = [...prev.tasks, newTask];
            const completedCount = updatedTasks.filter(t => t.completed).length;
            const newScore = Math.round((completedCount / updatedTasks.length) * 100);
            return {
                ...prev,
                tasks: updatedTasks,
                productivityScore: newScore
            };
        });

        logDashboardActivity({
            type: 'task',
            title: `Logged Past Task: ${newTask.title}`,
            tag: newTask.tag
        });

        setNewTaskText('');
        setShowAddTask(false);
    };

    const deleteTask = (taskId) => {
        setData(prev => {
            const updatedTasks = prev.tasks.filter(t => t.id !== taskId);
            const completedCount = updatedTasks.filter(t => t.completed).length;
            const newScore = updatedTasks.length ? Math.round((completedCount / updatedTasks.length) * 100) : 0;
            return {
                ...prev,
                tasks: updatedTasks,
                productivityScore: newScore
            };
        });
    };

    const toggleHabit = (habitId) => {
        setData(prev => ({
            ...prev,
            habits: prev.habits.map(h => {
                if (h.id === habitId) {
                    const nextCompleted = !h.completed;
                    logDashboardActivity({
                        type: 'habit',
                        title: `${nextCompleted ? 'Kept Habit' : 'Missed Habit'}: ${h.name}`,
                        tag: 'Habit'
                    });
                    return { ...h, completed: nextCompleted };
                }
                return h;
            })
        }));
    };

    const handleSaveNote = () => {
        setData(prev => ({ ...prev, notes: newNote }));
        setIsEditingNote(false);
        logDashboardActivity({
            type: 'note',
            title: 'Updated Daily Reflection Notes',
            tag: 'Notes'
        });
    };

    // Quick Manual Activity Logger
    const handleAddCustomActivity = (e) => {
        e.preventDefault();
        if (!customActivityTitle.trim()) return;

        logDashboardActivity({
            type: customActivityType,
            title: customActivityTitle.trim(),
            tag: customActivityTag
        });

        setCustomActivityTitle('');
        setShowAddActivity(false);
    };

    const deleteActivityItem = (actId) => {
        setData(prev => ({
            ...prev,
            recentActivities: (prev.recentActivities || []).filter(a => a.id !== actId)
        }));
    };

    const completedTasksCount = data.tasks.filter(t => t.completed).length;
    const completedHabitsCount = data.habits.filter(h => h.completed).length;

    const hours = Math.floor(data.focusMinutes / 60);
    const mins = data.focusMinutes % 60;

    const recentActivities = data.recentActivities || [];

    return (
        <div className="yesterday-modal-overlay" onClick={onClose}>
            <div 
                className="yesterday-modal-card" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Modal Header */}
                <div className="yesterday-modal-header">
                    <div className="yesterday-title-area">
                        <div className="yesterday-badge-icon">
                            <Activity size={22} color="#ffffff" strokeWidth={2.4} />
                        </div>
                        <div>
                            <div className="yesterday-top-row">
                                <h2 className="yesterday-modal-title">Activity & Yesterday's Log</h2>
                                <span className="yesterday-date-tag">{data.dateString}</span>
                                <span className="live-sync-indicator">
                                    <span className="live-pulse-dot" />
                                    Live Auto-Sync
                                </span>
                            </div>
                            <p className="yesterday-modal-subtitle">
                                All your tasks, habits, and timer sessions are automatically saved and tracked in real-time.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="yesterday-close-btn"
                        aria-label="Close modal"
                    >
                        <X size={20} color="#94a3b8" />
                    </button>
                </div>

                {/* 4 Stat Metric Cards */}
                <div className="yesterday-stats-grid">
                    <div className="yesterday-stat-card stat-purple">
                        <div className="stat-label">
                            <CheckCircle2 size={16} color="#c084fc" />
                            <span>Tasks Completed</span>
                        </div>
                        <div className="stat-value">
                            {completedTasksCount} <span className="stat-total">/ {data.tasks.length}</span>
                        </div>
                        <div className="stat-progress-bar">
                            <div 
                                className="stat-progress-fill purple-fill" 
                                style={{ width: `${(completedTasksCount / data.tasks.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="yesterday-stat-card stat-cyan">
                        <div className="stat-label">
                            <Clock size={16} color="#38bdf8" />
                            <span>Focus Time</span>
                        </div>
                        <div className="stat-value">
                            {hours}h {mins}m <span className="stat-total">({data.focusSessions} sessions)</span>
                        </div>
                        <div className="stat-progress-bar">
                            <div className="stat-progress-fill cyan-fill" style={{ width: '85%' }} />
                        </div>
                    </div>

                    <div className="yesterday-stat-card stat-emerald">
                        <div className="stat-label">
                            <Flame size={16} color="#34d399" />
                            <span>Habits Kept</span>
                        </div>
                        <div className="stat-value">
                            {completedHabitsCount} <span className="stat-total">/ {data.habits.length}</span>
                        </div>
                        <div className="stat-progress-bar">
                            <div 
                                className="stat-progress-fill emerald-fill" 
                                style={{ width: `${(completedHabitsCount / data.habits.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="yesterday-stat-card stat-amber">
                        <div className="stat-label">
                            <Award size={16} color="#fbbf24" />
                            <span>Productivity Score</span>
                        </div>
                        <div className="stat-value">
                            {data.productivityScore}% <span className="stat-badge">Great Day! 🔥</span>
                        </div>
                        <div className="stat-progress-bar">
                            <div 
                                className="stat-progress-fill amber-fill" 
                                style={{ width: `${data.productivityScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Sections: 2 Column Layout */}
                <div className="yesterday-content-grid">
                    {/* Left Column: Tasks & Habits */}
                    <div className="yesterday-column">
                        {/* Tasks Section */}
                        <div className="yesterday-section-card">
                            <div className="section-header-row">
                                <div className="section-heading">
                                    <CheckCircle2 size={18} color="#a855f7" />
                                    <h3>Completed Tasks</h3>
                                    <span className="count-pill">{completedTasksCount} done</span>
                                </div>
                                <button 
                                    className="add-inline-btn" 
                                    onClick={() => setShowAddTask(prev => !prev)}
                                >
                                    <Plus size={14} /> Add Past Task
                                </button>
                            </div>

                            {showAddTask && (
                                <form onSubmit={handleAddTask} className="add-task-form">
                                    <input 
                                        type="text" 
                                        placeholder="Enter task you completed..." 
                                        value={newTaskText} 
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        className="add-task-input"
                                        autoFocus
                                    />
                                    <div className="add-task-actions">
                                        <select 
                                            value={newTaskTag} 
                                            onChange={(e) => setNewTaskTag(e.target.value)}
                                            className="add-task-select"
                                        >
                                            <option value="Academic">Academic</option>
                                            <option value="Study">Study</option>
                                            <option value="Project">Project</option>
                                            <option value="Work">Work</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                        <button type="submit" className="confirm-btn">Save</button>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowAddTask(false)} 
                                            className="cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="tasks-scroll-list">
                                {data.tasks.map(task => (
                                    <div 
                                        key={task.id} 
                                        className={`task-row-item ${task.completed ? 'completed' : ''}`}
                                    >
                                        <button 
                                            className={`checkbox-circle ${task.completed ? 'checked' : ''}`}
                                            onClick={() => toggleTask(task.id)}
                                            title="Toggle completion status"
                                        >
                                            {task.completed && <Check size={13} strokeWidth={3} color="#ffffff" />}
                                        </button>
                                        <div className="task-info" onClick={() => toggleTask(task.id)}>
                                            <span className="task-title-text">{task.title}</span>
                                            <div className="task-meta">
                                                <span className="task-tag-badge">{task.tag}</span>
                                                <span className="task-time">{task.time}</span>
                                            </div>
                                        </div>
                                        <button 
                                            className="delete-task-btn" 
                                            onClick={() => deleteTask(task.id)}
                                            title="Remove item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Habits Done Section */}
                        <div className="yesterday-section-card">
                            <div className="section-heading">
                                <Flame size={18} color="#f97316" />
                                <h3>Habits Kept</h3>
                                <span className="count-pill">{completedHabitsCount}/{data.habits.length} kept</span>
                            </div>
                            <div className="habits-chips-wrap">
                                {data.habits.map(habit => (
                                    <button 
                                        key={habit.id}
                                        onClick={() => toggleHabit(habit.id)}
                                        className={`habit-chip ${habit.completed ? 'habit-kept' : 'habit-missed'}`}
                                    >
                                        <span className="habit-emoji">{habit.icon}</span>
                                        <span className="habit-name">{habit.name}</span>
                                        <span className="habit-status-icon">
                                            {habit.completed ? '✓' : '—'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Yesterday's Notes & Reflection */}
                        <div className="yesterday-section-card">
                            <div className="section-header-row">
                                <div className="section-heading">
                                    <BookOpen size={18} color="#ec4899" />
                                    <h3>Daily Notes & Thoughts</h3>
                                </div>
                                {!isEditingNote ? (
                                    <button 
                                        className="edit-note-btn" 
                                        onClick={() => setIsEditingNote(true)}
                                    >
                                        <Edit3 size={14} /> Edit
                                    </button>
                                ) : (
                                    <button 
                                        className="save-note-btn" 
                                        onClick={handleSaveNote}
                                    >
                                        <Check size={14} /> Save
                                    </button>
                                )}
                            </div>

                            {isEditingNote ? (
                                <div className="note-edit-box">
                                    <textarea 
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        rows={3}
                                        className="note-textarea"
                                        placeholder="Add your reflections or notes..."
                                    />
                                    <div className="note-actions">
                                        <button className="confirm-btn" onClick={handleSaveNote}>Save Notes</button>
                                        <button 
                                            className="cancel-btn" 
                                            onClick={() => {
                                                setNewNote(data.notes || '');
                                                setIsEditingNote(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="note-display-box">
                                    <p className="note-text-content">
                                        {data.notes || 'No reflections logged yet. Click Edit to add your notes!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Real-Time Live Activity Stream */}
                    <div className="yesterday-column">
                        {/* Live Activity Feed */}
                        <div className="yesterday-section-card activity-feed-card">
                            <div className="section-header-row">
                                <div className="section-heading">
                                    <Zap size={18} color="#f59e0b" />
                                    <h3>Real-Time Activity Stream</h3>
                                    <span className="count-pill live-pill">{recentActivities.length} events</span>
                                </div>
                                <button 
                                    className="add-inline-btn"
                                    onClick={() => setShowAddActivity(prev => !prev)}
                                >
                                    <Plus size={14} /> + Log Activity
                                </button>
                            </div>

                            {/* Quick Add Custom Activity Form */}
                            {showAddActivity && (
                                <form onSubmit={handleAddCustomActivity} className="add-task-form">
                                    <input 
                                        type="text" 
                                        placeholder="Enter activity description..." 
                                        value={customActivityTitle} 
                                        onChange={(e) => setCustomActivityTitle(e.target.value)}
                                        className="add-task-input"
                                        autoFocus
                                    />
                                    <div className="add-task-actions">
                                        <select 
                                            value={customActivityType} 
                                            onChange={(e) => setCustomActivityType(e.target.value)}
                                            className="add-task-select"
                                        >
                                            <option value="task">Task</option>
                                            <option value="habit">Habit</option>
                                            <option value="timer">Focus Timer</option>
                                            <option value="note">Note</option>
                                        </select>
                                        <select 
                                            value={customActivityTag} 
                                            onChange={(e) => setCustomActivityTag(e.target.value)}
                                            className="add-task-select"
                                        >
                                            <option value="Study">Study</option>
                                            <option value="Fitness">Fitness</option>
                                            <option value="Project">Project</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                        <button type="submit" className="confirm-btn">Log</button>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowAddActivity(false)} 
                                            className="cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Stream of Activities */}
                            <div className="activities-stream-list">
                                {recentActivities.length === 0 ? (
                                    <div className="empty-activities-state">
                                        <Activity size={24} color="#64748b" />
                                        <p>No activities recorded yet. Complete a task, toggle a habit, or start the timer to see live updates!</p>
                                    </div>
                                ) : (
                                    recentActivities.map((act) => {
                                        const typeColors = {
                                            task: { color: '#c084fc', bg: 'rgba(168, 85, 247, 0.15)', icon: '✓' },
                                            habit: { color: '#fb923c', bg: 'rgba(249, 115, 22, 0.15)', icon: '🔥' },
                                            timer: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: '⏱' },
                                            note: { color: '#f472b6', bg: 'rgba(236, 72, 153, 0.15)', icon: '📝' }
                                        };
                                        const cfg = typeColors[act.type] || typeColors.task;

                                        return (
                                            <div key={act.id} className="activity-stream-item">
                                                <div 
                                                    className="activity-type-badge"
                                                    style={{ background: cfg.bg, color: cfg.color }}
                                                >
                                                    <span>{cfg.icon}</span>
                                                </div>
                                                <div className="activity-content-col">
                                                    <span className="activity-title-text">{act.title}</span>
                                                    <div className="activity-sub-row">
                                                        <span className="activity-tag">{act.tag}</span>
                                                        <span className="activity-time-stamp">{act.time}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => deleteActivityItem(act.id)}
                                                    className="delete-activity-btn"
                                                    title="Delete this record"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Focus Sessions Card */}
                        <div className="yesterday-section-card">
                            <div className="section-heading">
                                <Clock size={18} color="#38bdf8" />
                                <h3>Focus Sessions Log</h3>
                                <span className="count-pill">{data.focusSessionsList.length} sessions</span>
                            </div>
                            <div className="focus-sessions-list">
                                {data.focusSessionsList.map(session => (
                                    <div key={session.id} className="focus-session-row">
                                        <div className="session-dot" />
                                        <div className="session-details">
                                            <span className="session-title">{session.title}</span>
                                            <span className="session-time">{session.time}</span>
                                        </div>
                                        <span className="session-duration">{session.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="yesterday-modal-footer">
                    <span className="yesterday-footer-hint">
                        ⚡ Real-time synchronization active: Tasks, habits, and timer changes are saved automatically.
                    </span>
                    <button onClick={onClose} className="yesterday-done-btn">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
