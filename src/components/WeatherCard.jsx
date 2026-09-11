import React, { useState } from 'react';
import { CloudSun, CloudRain, Sun, Search, MapPin, X, Loader2, Wind, Droplets, SunMedium, Gauge } from 'lucide-react';

export default function WeatherCard({ 
    weather: propWeather, 
    city: propCity, 
    loading = false, 
    onSearch 
}) {
    const [localCity, setLocalCity] = useState('San Francisco');
    const [searchOpen, setSearchOpen] = useState(false);
    const [inputVal, setInputVal] = useState('');

    const defaultWeather = {
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
    };

    const weather = propWeather || defaultWeather;
    const currentCity = propCity || localCity;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!inputVal.trim()) return;
        const query = inputVal.trim();
        setLocalCity(query);
        setSearchOpen(false);
        setInputVal('');

        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <div className="glass-card" style={styles.card}>
            {/* Top row with city/search toggle */}
            <div style={styles.topRow}>
                <div style={styles.locationTag} onClick={() => setSearchOpen(!searchOpen)}>
                    <MapPin size={13} color="#8b5cf6" />
                    <span>{currentCity}</span>
                </div>
                <button 
                    onClick={() => setSearchOpen(!searchOpen)} 
                    style={styles.searchToggleBtn}
                    title="Change location"
                >
                    {searchOpen ? <X size={14} color="#94a3b8" /> : <Search size={14} color="#94a3b8" />}
                </button>
            </div>

            {searchOpen && (
                <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Type city name..."
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        autoFocus
                        style={styles.searchInput}
                    />
                </form>
            )}

            {/* 3D Sun and Cloud Graphic */}
            <div style={styles.weatherVisual}>
                <div style={styles.iconWrapper}>
                    {loading ? (
                        <Loader2 size={36} color="#c084fc" className="spin" />
                    ) : (
                        <img 
                            src="/weather_sun_cloud.png" 
                            alt="Weather 3D icon" 
                            style={styles.weatherImg}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Big Temperature & Condition */}
            <div style={styles.tempSection}>
                <div style={styles.tempValue}>{weather.temp}°</div>
                <div style={styles.conditionText}>{weather.condition}</div>
                <div style={styles.rangeText}>
                    <span>↑ {weather.high}°</span>
                    <span>↓ {weather.low}°</span>
                </div>
            </div>

            {/* Weather Metrics Grid (Wind, Humidity, UV, Air Pressure) */}
            <div style={styles.metricsGrid}>
                {/* 1. Wind */}
                <div style={styles.metricItem}>
                    <Wind size={12} color="#38bdf8" />
                    <div style={styles.metricTexts}>
                        <span style={styles.metricLabel}>Wind</span>
                        <span style={styles.metricVal}>{weather.windDir} {weather.windSpeed} km/h</span>
                    </div>
                </div>

                {/* 2. Humidity */}
                <div style={styles.metricItem}>
                    <Droplets size={12} color="#60a5fa" />
                    <div style={styles.metricTexts}>
                        <span style={styles.metricLabel}>Humidity</span>
                        <span style={styles.metricVal}>{weather.humidity}%</span>
                    </div>
                </div>

                {/* 3. UV Index */}
                <div style={styles.metricItem}>
                    <SunMedium size={12} color="#fbbf24" />
                    <div style={styles.metricTexts}>
                        <span style={styles.metricLabel}>UV Index</span>
                        <span style={styles.metricVal}>{weather.uv} {weather.uvLevel}</span>
                    </div>
                </div>

                {/* 4. Air Pressure */}
                <div style={styles.metricItem}>
                    <Gauge size={12} color="#c084fc" />
                    <div style={styles.metricTexts}>
                        <span style={styles.metricLabel}>Pressure</span>
                        <span style={styles.metricVal}>{weather.pressure} hPa</span>
                    </div>
                </div>
            </div>

            {/* 7-Day Forecast Strip */}
            <div style={styles.forecastStrip}>
                {weather.forecast.map((fc, idx) => (
                    <div key={idx} style={styles.forecastCol}>
                        <span style={styles.forecastDay}>{fc.day}</span>
                        <div style={styles.forecastIconWrap}>
                            {fc.icon === 'rain-sun' && <CloudSun size={16} color="#93c5fd" />}
                            {fc.icon === 'sun-cloud' && <CloudSun size={16} color="#fde047" />}
                            {fc.icon === 'rain'     && <CloudRain size={16} color="#60a5fa" />}
                            {fc.icon === 'sun'      && <Sun size={16} color="#fbbf24" />}
                            {fc.icon === 'snow'     && <CloudSun size={16} color="#bae6fd" />}
                        </div>
                        <span style={styles.forecastHigh}>{fc.high ?? fc.temp}°</span>
                        {fc.low !== undefined && (
                            <span style={styles.forecastLow}>{fc.low}°</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: '1rem 1.15rem',
        position: 'relative'
    },
    topRow: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.1rem'
    },
    locationTag: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.75rem',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '0.15rem 0.4rem',
        borderRadius: '8px',
        transition: 'background 0.2s ease'
    },
    searchToggleBtn: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7
    },
    searchForm: {
        width: '100%',
        marginBottom: '0.4rem'
    },
    searchInput: {
        width: '100%',
        padding: '0.35rem 0.6rem',
        fontSize: '0.78rem'
    },
    weatherVisual: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0.1rem 0'
    },
    iconWrapper: {
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    weatherImg: {
        width: '64px',
        height: '64px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.4))'
    },
    tempSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.05rem',
        margin: '0.15rem 0'
    },
    tempValue: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#ffffff',
        lineHeight: 1,
        fontFamily: "'Inter', sans-serif"
    },
    conditionText: {
        fontSize: '0.84rem',
        color: '#cbd5e1',
        fontWeight: '400',
        marginTop: '0.15rem'
    },
    rangeText: {
        fontSize: '0.76rem',
        color: '#94a3b8',
        display: 'flex',
        gap: '0.65rem',
        marginTop: '0.15rem'
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.45rem',
        width: '100%',
        margin: '0.4rem 0'
    },
    metricItem: {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        padding: '0.35rem 0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        textAlign: 'left'
    },
    metricTexts: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        overflow: 'hidden'
    },
    metricLabel: {
        fontSize: '0.65rem',
        color: '#94a3b8',
        fontWeight: '400'
    },
    metricVal: {
        fontSize: '0.74rem',
        color: '#ffffff',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    forecastStrip: {
        display: 'grid',
        gridTemplateColumns: `repeat(7, 1fr)`,
        width: '100%',
        paddingTop: '0.55rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        marginTop: '0.1rem',
        gap: '0.1rem'
    },
    forecastCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.2rem'
    },
    forecastDay: {
        fontSize: '0.65rem',
        color: '#94a3b8',
        fontWeight: '500'
    },
    forecastIconWrap: {
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    forecastHigh: {
        fontSize: '0.72rem',
        fontWeight: '600',
        color: '#e2e8f0'
    },
    forecastLow: {
        fontSize: '0.65rem',
        fontWeight: '400',
        color: '#64748b'
    }
};