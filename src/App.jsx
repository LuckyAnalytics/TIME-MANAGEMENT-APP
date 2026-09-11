import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CalendarCard from './components/CalendarCard';
import TodaySchedule from './components/TodaySchedule';
import WeatherCard from './components/WeatherCard';
import MyTasks from './components/MyTasks';
import FocusTimer from './components/FocusTimer';
import Deadlines from './components/Deadlines';
import QuickNotes from './components/QuickNotes';
import StudyPlaylist from './components/StudyPlaylist';
import HabitTracker from './components/HabitTracker';
import YesterdayModal from './components/YesterdayModal';
import LoginModal from './components/LoginModal';


function getWindDirection(deg) {
    if (deg === undefined || deg === null) return 'ENE';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((deg % 360) / 22.5) % 16;
    return directions[index];
}

function getUvLevel(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Mod';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

export default function App() {
    // Current Logged-in User profile
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('weather_dashboard_user_profile');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Auto prompt login on dashboard open unless logged in for this active session
    const [showLoginModal, setShowLoginModal] = useState(() => {
        try {
            const sessionActive = sessionStorage.getItem('weather_dashboard_session_active');
            return !sessionActive; // Opens immediately on dashboard load!
        } catch {
            return true;
        }
    });

    // Sidebar navigation & moon state
    const [activeSection, setActiveSection] = useState('home');
    const [moonOn, setMoonOn] = useState(false);
    const [showYesterdayModal, setShowYesterdayModal] = useState(false);

    const handleNav = (id) => {
        if (id === 'history') {
            setActiveSection('history');
            setShowYesterdayModal(true);
            return;
        }
        if (id === 'user') {
            setActiveSection('user');
            setShowLoginModal(true);
            return;
        }
        setActiveSection(prev => prev === id ? 'home' : id);
    };

    // Shared weather state matching reference image with wind, humidity, uv, and air pressure
    const [city, setCity] = useState('San Francisco');
    const [weather, setWeather] = useState({
        location: 'San Francisco, US',
        temp: 24,
        condition: 'Partly Cloudy',
        high: 28,
        low: 18,
        windSpeed: 14,
        windDir: 'ENE',
        humidity: 65,
        uv: 4.2,
        uvLevel: 'Mod',
        pressure: 1015,
        forecast: [
            { day: 'Mon', icon: 'sun',      high: 28, low: 18, condition: 'Sunny' },
            { day: 'Tue', icon: 'rain-sun', high: 26, low: 17, condition: 'Partly Cloudy' },
            { day: 'Wed', icon: 'rain-sun', high: 27, low: 16, condition: 'Partly Cloudy' },
            { day: 'Thu', icon: 'sun',      high: 29, low: 19, condition: 'Sunny' },
            { day: 'Fri', icon: 'rain',     high: 22, low: 15, condition: 'Rain' },
            { day: 'Sat', icon: 'sun-cloud',high: 25, low: 17, condition: 'Cloudy' },
            { day: 'Sun', icon: 'sun',      high: 27, low: 18, condition: 'Sunny' }
        ]
    });
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState('');

    // Dynamic API key resolution: user profile -> localStorage -> .env -> hardcoded fallback
    const getActiveApiKey = () => {
        return currentUser?.apiKey
            || localStorage.getItem('weather_dashboard_api_key')
            || import.meta.env.VITE_OPENWEATHER_API_KEY
            || '4ff0015b209f5f61e460a0e32588e79e';
    };

    const handleSearchWeather = async (queryLocation) => {
        if (!queryLocation || !queryLocation.trim()) return;
        setWeatherLoading(true);
        setWeatherError('');

        try {
            const API_KEY = getActiveApiKey();
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryLocation.trim())}&units=metric&appid=${API_KEY}`
            );

            if (!res.ok) {
                throw new Error('City or country not found');
            }

            const data = await res.json();
            const condition = data.weather[0]?.main || 'Clear';
            const temp = Math.round(data.main.temp);
            const high = Math.round(data.main.temp_max);
            const low = Math.round(data.main.temp_min);
            const country = data.sys?.country ? `, ${data.sys.country}` : '';
            const locationName = `${data.name}${country}`;

            // Wind
            const windSpeed = Math.round((data.wind?.speed || 0) * 3.6);
            const windDir = getWindDirection(data.wind?.deg ?? 65);

            // Humidity & Pressure
            const humidity = data.main?.humidity ?? 60;
            const pressure = data.main?.pressure ?? 1013;

            // Fetch UV Index with coordinates
            let uvValue = 4;
            if (data.coord?.lat && data.coord?.lon) {
                try {
                    const uvRes = await fetch(
                        `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`
                    );
                    if (uvRes.ok) {
                        const uvData = await uvRes.json();
                        if (uvData.value !== undefined) {
                            uvValue = Math.round(uvData.value * 10) / 10;
                        }
                    }
                } catch {
                    // Fallback to estimate based on clouds
                    const clouds = data.clouds?.all ?? 20;
                    uvValue = Math.max(1, Math.round((10 - clouds / 15) * 10) / 10);
                }
            }

            // Fetch 7-day forecast from Open-Meteo (free, no key, guaranteed 7 days)
            let forecastDays = [];
            try {
                const fcRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${data.coord.lat}&longitude=${data.coord.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7`
                );
                if (fcRes.ok) {
                    const fcData = await fcRes.json();
                    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    forecastDays = fcData.daily.time.map((dateStr, i) => {
                        const d = new Date(dateStr + 'T12:00:00');
                        const wmoCode = fcData.daily.weathercode[i];
                        let icon = 'sun';
                        if (wmoCode >= 95) icon = 'rain'; // thunderstorm
                        else if (wmoCode >= 80) icon = 'rain'; // showers
                        else if (wmoCode >= 71) icon = 'snow'; // snow
                        else if (wmoCode >= 51) icon = 'rain'; // drizzle/rain
                        else if (wmoCode >= 3)  icon = 'sun-cloud'; // overcast
                        else if (wmoCode >= 1)  icon = 'rain-sun'; // partly cloudy
                        return {
                            day: DAY_NAMES[d.getDay()],
                            icon,
                            high: Math.round(fcData.daily.temperature_2m_max[i]),
                            low:  Math.round(fcData.daily.temperature_2m_min[i]),
                            condition: wmoCode === 0 ? 'Clear' : wmoCode < 3 ? 'Partly Cloudy' : wmoCode < 51 ? 'Cloudy' : wmoCode < 71 ? 'Rain' : 'Snow'
                        };
                    });
                }
            } catch { /* will use fallback */ }

            // Fallback: 7 estimated days if Open-Meteo fails
            if (forecastDays.length === 0) {
                const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                forecastDays = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    return {
                        day: DAY_NAMES[d.getDay()],
                        icon: i % 3 === 0 ? 'sun' : i % 3 === 1 ? 'rain-sun' : 'sun-cloud',
                        high: high + Math.round(Math.random() * 4 - 2),
                        low:  low  + Math.round(Math.random() * 3 - 1),
                        condition: 'Partly Cloudy'
                    };
                });
            }

            setCity(data.name);
            setWeather({
                location: locationName,
                temp: temp,
                condition: condition === 'Clear' ? 'Sunny' : condition === 'Clouds' ? 'Partly Cloudy' : condition,
                high: high,
                low: low,
                windSpeed: windSpeed,
                windDir: windDir,
                humidity: humidity,
                uv: uvValue,
                uvLevel: getUvLevel(uvValue),
                pressure: pressure,
                forecast: forecastDays
            });
        } catch (err) {
            setWeatherError(err.message || 'Unable to retrieve weather');
        } finally {
            setWeatherLoading(false);
        }
    };

    const hl = (section) => activeSection === section ? 'card-highlight' : '';

    return (
        <div className={`app-wrapper${moonOn ? ' moon-mode' : ''}`}>
            <div className="app-layout">
                {/* Left Floating Sidebar */}
                <Sidebar
                    activeSection={activeSection}
                    onNav={handleNav}
                    moonOn={moonOn}
                    onMoonToggle={() => setMoonOn(m => !m)}
                />

                {/* Main Dashboard Space */}
                <main className="main-content">
                    {/* Header with Search Bar in the middle */}
                    <Header
                        weather={weather}
                        loading={weatherLoading}
                        error={weatherError}
                        onSearch={handleSearchWeather}
                        currentUser={currentUser}
                    />

                    <div className="dashboard-grid">
                        {/* Row 1: Calendar | Today's Schedule | Weather */}
                        <div className={`col-span-7 ${hl('calendar')}`}>
                            <CalendarCard />
                        </div>
                        <div className="col-span-9">
                            <TodaySchedule />
                        </div>
                        <div className={`col-span-8 ${hl('weather')}`}>
                            <WeatherCard
                                weather={weather}
                                city={city}
                                loading={weatherLoading}
                                onSearch={handleSearchWeather}
                            />
                        </div>

                        {/* Row 2: My Tasks | Focus Timer */}
                        <div className={`col-span-16 ${hl('tasks')}`}>
                            <MyTasks />
                        </div>
                        <div className={`col-span-8 ${hl('timer')}`}>
                            <FocusTimer />
                        </div>

                        {/* Row 3: Upcoming Deadlines | Quick Notes */}
                        <div className="col-span-15">
                            <Deadlines />
                        </div>
                        <div className={`col-span-9 ${hl('notes')}`}>
                            <QuickNotes />
                        </div>

                        {/* Row 4: Study Playlist | Habit Tracker */}
                        <div className="col-span-9">
                            <StudyPlaylist />
                        </div>
                        <div className={`col-span-15 ${hl('tasks')}`}>
                            <HabitTracker />
                        </div>
                    </div>
                </main>
            </div>

            {/* Yesterday's Activity Log & Recap Modal */}
            <YesterdayModal
                isOpen={showYesterdayModal}
                onClose={() => {
                    setShowYesterdayModal(false);
                    setActiveSection('home');
                }}
            />

            {/* Login & User Registration Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => {
                    setShowLoginModal(false);
                    setActiveSection('home');
                }}
                onUserUpdated={(profile) => {
                    setCurrentUser(profile);
                    // Refresh weather with new API key on login
                    if (profile?.apiKey && city) {
                        setTimeout(() => handleSearchWeather(city), 300);
                    }
                }}
            />
        </div>
    );
}