import React, { useState, useEffect } from 'react';
import { Plus, Check, Star, X } from 'lucide-react';
import { logDashboardActivity } from '../utils/activityLogger';

const TASKS_STORAGE_KEY = 'weather_dashboard_my_tasks';
const TAB_STORAGE_KEY = 'weather_dashboard_tasks_tab';

const DEFAULT_TASKS = [
    {
        id: 1,
        title: 'Finish Math Assignment',
        date: 'Today',
        completed: true,
        starred: true,
        tabCategory: 'Today'
    },
    {
        id: 2,
        title: 'Review Physics Notes',
        date: 'Today',
        completed: false,
        starred: false,
        tabCategory: 'Today'
    },
    {
        id: 3,
        title: 'Prepare for Chemistry Lab',
        date: 'Tomorrow',
        completed: false,
        starred: false,
        tabCategory: 'Upcoming'
    },
    {
        id: 4,
        title: 'Read 30 pages of Book',
        date: 'May 30',
        completed: false,
        starred: false,
        tabCategory: 'Upcoming'
    },
    {
        id: 5,
        title: 'Workout',
        date: 'May 30',
        completed: false,
        starred: false,
        tabCategory: 'Upcoming'
    }
];

export default function MyTasks() {
    // Persistent Tab selection - stays on chosen tab until changed
    const [activeTab, setActiveTab] = useState(() => {
        try {
            return localStorage.getItem(TAB_STORAGE_KEY) || 'All';
        } catch {
            return 'All';
        }
    });

    const [showAddInput, setShowAddInput] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('Today');

    // Persistent Tasks - stays saved permanently across reloads & changes
    const [tasks, setTasks] = useState(() => {
        try {
            const saved = localStorage.getItem(TASKS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error('Failed to load tasks from localStorage:', e);
        }
        return DEFAULT_TASKS;
    });

    // Save tasks whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks to localStorage:', e);
        }
    }, [tasks]);

    // Save activeTab whenever user switches tabs
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        try {
            localStorage.setItem(TAB_STORAGE_KEY, tab);
        } catch (e) {
            console.error('Failed to save active tab to localStorage:', e);
        }
    };

    const toggleComplete = (id) => {
        setTasks(prevTasks => {
            const updated = prevTasks.map(task => {
                if (task.id === id) {
                    const newStatus = !task.completed;
                    // Immediately log this activity in real-time
                    logDashboardActivity({
                        type: 'task',
                        title: `${newStatus ? 'Completed Task' : 'Reopened Task'}: ${task.title}`,
                        tag: 'Task',
                        detail: `Status changed to ${newStatus ? 'Completed' : 'Pending'}`
                    });
                    return { ...task, completed: newStatus };
                }
                return task;
            });
            return updated;
        });
    };

    const toggleStar = (id) => {
        setTasks(prevTasks => {
            const updated = prevTasks.map(task => {
                if (task.id === id) {
                    const newStar = !task.starred;
                    logDashboardActivity({
                        type: 'task',
                        title: `${newStar ? 'Starred Task' : 'Unstarred Task'}: ${task.title}`,
                        tag: 'Task'
                    });
                    return { ...task, starred: newStar };
                }
                return task;
            });
            return updated;
        });
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const newTask = {
            id: Date.now(),
            title: newTaskText.trim(),
            date: newTaskDate || 'Today',
            completed: false,
            starred: false,
            tabCategory: newTaskDate === 'Today' ? 'Today' : 'Upcoming'
        };

        setTasks(prev => [...prev, newTask]);

        // Immediately log this activity in real-time
        logDashboardActivity({
            type: 'task',
            title: `Added New Task: ${newTask.title}`,
            tag: 'Task',
            detail: `Due: ${newTask.date}`
        });

        setNewTaskText('');
        setShowAddInput(false);
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Today') return task.date === 'Today';
        if (activeTab === 'Upcoming') return task.date !== 'Today' && !task.completed;
        if (activeTab === 'Completed') return task.completed;
        return true;
    });

    const tabs = ['All', 'Today', 'Upcoming', 'Completed'];

    return (
        <div className="glass-card" style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.cardTitle}>My Tasks</h2>
                <button 
                    onClick={() => setShowAddInput(!showAddInput)}
                    style={styles.addTaskBtn}
                >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>Add Task</span>
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={styles.tabsRow}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => handleTabClick(tab)}
                            style={{
                                ...styles.tabBtn,
                                ...(isActive ? styles.activeTabBtn : styles.inactiveTabBtn)
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Add Task Input */}
            {showAddInput && (
                <form onSubmit={handleAddTask} style={styles.addForm}>
                    <input
                        type="text"
                        placeholder="Task description..."
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        autoFocus
                        style={{ flex: 1, fontSize: '0.82rem' }}
                    />
                    <select
                        value={newTaskDate}
                        onChange={(e) => setNewTaskDate(e.target.value)}
                        style={styles.dateSelect}
                    >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="May 30">May 30</option>
                    </select>
                    <button type="submit" style={styles.submitTaskBtn}>Add</button>
                    <button type="button" onClick={() => setShowAddInput(false)} style={styles.cancelTaskBtn}>
                        <X size={14} />
                    </button>
                </form>
            )}

            {/* Tasks List */}
            <div style={styles.taskList}>
                {filteredTasks.map((task) => (
                    <div key={task.id} style={styles.taskItem}>
                        <div style={styles.taskLeft}>
                            {/* Circular Checkbox */}
                            <button
                                onClick={() => toggleComplete(task.id)}
                                style={{
                                    ...styles.checkCircle,
                                    background: task.completed ? '#8b5cf6' : 'transparent',
                                    borderColor: task.completed ? '#8b5cf6' : '#64748b'
                                }}
                                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                            >
                                {task.completed && <Check size={11} strokeWidth={3} color="#ffffff" />}
                            </button>

                            {/* Task Title */}
                            <span 
                                style={{
                                    ...styles.taskTitle,
                                    color: task.completed ? '#64748b' : '#f1f5f9',
                                    textDecoration: task.completed ? 'line-through' : 'none'
                                }}
                            >
                                {task.title}
                            </span>
                        </div>

                        <div style={styles.taskRight}>
                            <span style={styles.taskDate}>{task.date}</span>
                            <button 
                                onClick={() => toggleStar(task.id)}
                                style={styles.starBtn}
                                aria-label="Star task"
                            >
                                <Star 
                                    size={14} 
                                    color={task.starred ? '#c084fc' : '#475569'} 
                                    fill={task.starred ? '#c084fc' : 'none'} 
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    card: {
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#f8fafc'
    },
    addTaskBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        color: '#ffffff',
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '6px 14px',
        borderRadius: '20px',
        boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)'
    },
    tabsRow: {
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '0.6rem'
    },
    tabBtn: {
        fontSize: '0.78rem',
        fontWeight: 500,
        padding: '4px 12px',
        borderRadius: '12px',
        transition: 'all 0.2s ease'
    },
    activeTabBtn: {
        background: '#8b5cf6',
        color: '#ffffff',
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
    },
    inactiveTabBtn: {
        background: 'transparent',
        color: '#94a3b8'
    },
    addForm: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '0.5rem',
        borderRadius: '8px'
    },
    dateSelect: {
        background: '#1a1836',
        color: '#cbd5e1',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        fontSize: '0.75rem',
        padding: '4px 8px'
    },
    submitTaskBtn: {
        background: '#8b5cf6',
        color: '#fff',
        fontSize: '0.75rem',
        padding: '4px 10px',
        borderRadius: '6px'
    },
    cancelTaskBtn: {
        color: '#94a3b8',
        padding: '4px'
    },
    taskList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginTop: '0.2rem'
    },
    taskItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.3rem 0'
    },
    taskLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    checkCircle: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0
    },
    taskTitle: {
        fontSize: '0.82rem',
        fontWeight: 400,
        transition: 'color 0.2s ease'
    },
    taskRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    taskDate: {
        fontSize: '0.75rem',
        color: '#64748b'
    },
    starBtn: {
        background: 'transparent',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};