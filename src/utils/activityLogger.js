// Shared Activity Logger and State Synchronizer
export const ACTIVITY_STORAGE_KEY = 'weather_dashboard_yesterday_log';

export function getStoredYesterdayData() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultDateStr = yesterday.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const defaultData = {
        dateString: defaultDateStr,
        focusMinutes: 165,
        focusSessions: 4,
        tasks: [
            { id: 1, title: 'Finished Math Assignment & Calculus Problem Set', tag: 'Academic', completed: true, time: '11:30 AM' },
            { id: 2, title: 'Reviewed Physics Chapter 4 - Thermodynamics', tag: 'Study', completed: true, time: '2:15 PM' },
            { id: 3, title: 'Completed Dashboard UI & Responsive Layout', tag: 'Project', completed: true, time: '5:45 PM' },
            { id: 4, title: 'Team Sync & Weekly Sprint Review Call', tag: 'Work', completed: true, time: '7:00 PM' },
            { id: 5, title: 'Read 20 pages of Atomic Habits', tag: 'Personal', completed: false, time: 'Pending' }
        ],
        habits: [
            { id: 1, name: 'Deep Study (2+ hrs)', completed: true, icon: '🎓' },
            { id: 2, name: '30m Workout / Gym', completed: true, icon: '🔥' },
            { id: 3, name: 'Mindfulness Meditation (15m)', completed: true, icon: '✨' },
            { id: 4, name: 'Drank 3 Liters Water', completed: true, icon: '💧' },
            { id: 5, name: 'No Screen 30m Before Bed', completed: false, icon: '🌙' }
        ],
        focusSessionsList: [
            { id: 1, title: 'Calculus Problem Solving', duration: '50 mins', time: '10:40 AM' },
            { id: 2, title: 'Physics Formula Practice', duration: '45 mins', time: '01:30 PM' },
            { id: 3, title: 'React Frontend Implementation', duration: '45 mins', time: '04:00 PM' },
            { id: 4, title: 'Sprint Review & Planning', duration: '25 mins', time: '06:30 PM' }
        ],
        recentActivities: [
            { id: 101, type: 'task', title: 'Completed Task: Finished Math Assignment', tag: 'Academic', time: '11:30 AM' },
            { id: 102, type: 'habit', title: 'Completed Habit: 30m Workout / Gym', tag: 'Fitness', time: '01:15 PM' },
            { id: 103, type: 'timer', title: 'Finished Focus Session (45m): Physics Formula Practice', tag: 'Study', time: '02:15 PM' },
            { id: 104, type: 'note', title: 'Added Quick Note: Revise thermodynamics', tag: 'Notes', time: '05:20 PM' }
        ],
        notes: "Completed all high-priority college assignments and finalized the dashboard UI wireframes. Kept up with hydration and workout routine. Need to wrap up the thermodynamics lab report first thing this morning.",
        productivityScore: 88
    };

    try {
        const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...defaultData,
                ...parsed,
                recentActivities: parsed.recentActivities || defaultData.recentActivities
            };
        }
    } catch (e) {
        console.error('Error reading yesterday log:', e);
    }
    return defaultData;
}

// Function to log any small or big activity instantly
export function logDashboardActivity({ type, title, tag = 'General', detail = '' }) {
    try {
        const currentData = getStoredYesterdayData();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newActivity = {
            id: Date.now() + Math.random(),
            type, // 'task' | 'habit' | 'timer' | 'note'
            title,
            tag,
            detail,
            time: timeStr,
            timestamp: now.toISOString()
        };

        const updatedActivities = [newActivity, ...(currentData.recentActivities || [])].slice(0, 100);

        const updatedData = {
            ...currentData,
            recentActivities: updatedActivities
        };

        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updatedData));

        // Dispatch a custom event so UI updates instantly
        window.dispatchEvent(new CustomEvent('dashboard-activity-logged', { 
            detail: newActivity 
        }));

        return newActivity;
    } catch (e) {
        console.error('Failed to log dashboard activity:', e);
    }
}
