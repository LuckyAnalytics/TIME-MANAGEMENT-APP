import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music2, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

/* ── Note frequencies (Hz) ─────────────────────────────────── */
const N = {
    C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
    C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
    C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00,
};

/* ── Track definitions ─────────────────────────────────────── */
const TRACKS = [
    {
        title: 'Rainy Afternoon', artist: 'Lo-Fi Collective', genre: 'Chill & Focus',
        bpm: 70, color: '#60a5fa',
        chord: [N.C3, N.E3, N.G3],
        melody: [[N.E4,1],[N.G4,0.5],[N.A4,0.5],[N.G4,1],[N.E4,1],[N.C4,1],[N.D4,0.5],[N.E4,0.5],[N.D4,1],[N.C4,1]],
    },
    {
        title: 'The Sunset', artist: 'Sunset Vibes', genre: 'Lo-Fi Beats',
        bpm: 80, color: '#fb923c',
        chord: [N.F3, N.A3, N.C4],
        melody: [[N.F4,1],[N.A4,1],[N.C5,0.5],[N.A4,0.5],[N.F4,1],[N.G4,1],[N.A4,0.5],[N.G4,0.5],[N.F4,2]],
    },
    {
        title: 'Midnight Coffee', artist: 'Study Café', genre: 'Deep Focus',
        bpm: 65, color: '#c084fc',
        chord: [N.D3, N.F3, N.A3],
        melody: [[N.D4,1],[N.F4,1],[N.A4,0.5],[N.G4,0.5],[N.F4,1],[N.E4,0.5],[N.D4,0.5],[N.C4,1],[N.D4,2]],
    },
    {
        title: 'Forest Dream', artist: 'Nature Sounds', genre: 'Ambient',
        bpm: 60, color: '#34d399',
        chord: [N.G3, N.B3, N.D4],
        melody: [[N.G4,1.5],[N.A4,0.5],[N.B4,1],[N.A4,0.5],[N.G4,0.5],[N.F4,1],[N.G4,1],[N.A4,2]],
    },
    {
        title: 'Golden Hour', artist: 'Lo-Fi Collective', genre: 'Chill & Focus',
        bpm: 75, color: '#fbbf24',
        chord: [N.A3, N.C4, N.E4],
        melody: [[N.A4,1],[N.C5,0.5],[N.B4,0.5],[N.A4,1],[N.G4,1],[N.F4,0.5],[N.G4,0.5],[N.A4,1],[N.E4,1]],
    },
    {
        title: 'Neon Lights', artist: 'City Beats', genre: 'Urban Lo-Fi',
        bpm: 85, color: '#f472b6',
        chord: [N.E3, N.G3, N.B3],
        melody: [[N.E4,0.5],[N.G4,0.5],[N.B4,1],[N.A4,0.5],[N.G4,0.5],[N.F4,0.5],[N.E4,0.5],[N.D4,1],[N.E4,1.5]],
    },
];

/* ── Web Audio engine ──────────────────────────────────────── */
function createEngine() {
    let ctx = null;
    let masterGain = null;
    let filter = null;
    let timerId = null;
    let nextBeat = 0;
    let melIdx = 0;
    let chordCount = 0;
    let activeOscs = [];

    function initCtx() {
        if (ctx && ctx.state !== 'closed') return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.28;
        filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2200;
        filter.Q.value = 0.7;
        masterGain.connect(filter);
        filter.connect(ctx.destination);
    }

    function note(freq, start, dur, type = 'triangle', vol = 0.22) {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.025);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.88);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(start);
        osc.stop(start + dur);
        activeOscs.push(osc);
        // auto-clean finished refs
        osc.onended = () => { activeOscs = activeOscs.filter(o => o !== osc); };
    }

    function scheduler(track) {
        const beatDur = 60 / track.bpm;
        const ahead = 0.35;
        while (nextBeat < ctx.currentTime + ahead) {
            const [freq, beats] = track.melody[melIdx % track.melody.length];
            const dur = beats * beatDur;
            // Melody
            note(freq, nextBeat, dur, 'triangle', 0.2);
            // Chord swell every 8 melody notes
            if (chordCount % 8 === 0) {
                track.chord.forEach(f => note(f, nextBeat, beatDur * 4, 'sine', 0.07));
            }
            // Kick-like low thump every 4 beats
            if (chordCount % 4 === 0) {
                note(55, nextBeat, 0.18, 'sine', 0.15);
            }
            // Hi-hat every beat
            {
                const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.12;
                const src = ctx.createBufferSource();
                const hg = ctx.createGain();
                src.buffer = buf;
                hg.gain.setValueAtTime(0.18, nextBeat);
                hg.gain.exponentialRampToValueAtTime(0.0001, nextBeat + 0.035);
                src.connect(hg);
                hg.connect(masterGain);
                src.start(nextBeat);
            }
            nextBeat += dur;
            melIdx++;
            chordCount++;
        }
    }

    return {
        async start(track) {
            initCtx();
            if (ctx.state === 'suspended') await ctx.resume();
            melIdx = 0; chordCount = 0;
            nextBeat = ctx.currentTime + 0.05;
            const loop = () => {
                scheduler(track);
                timerId = setTimeout(loop, 25);
            };
            loop();
        },
        stop() {
            clearTimeout(timerId);
            timerId = null;
            activeOscs.forEach(o => { try { o.stop(0); } catch {} });
            activeOscs = [];
        },
        reset() {
            melIdx = 0; chordCount = 0;
        }
    };
}

/* ── Component ─────────────────────────────────────────────── */
export default function StudyPlaylist() {
    const [trackIdx, setTrackIdx]   = useState(1); // Default: The Sunset
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed]     = useState(0);  // seconds since play started
    const [barHeights, setBarHeights] = useState([
        4, 8, 14, 20, 12, 18, 24, 16, 10, 22, 15, 8, 12, 19, 14, 6, 18, 23, 11, 7
    ]);

    const engineRef   = useRef(null);
    const elapsedRef  = useRef(null); // for the timer interval

    // Create engine once
    if (!engineRef.current) engineRef.current = createEngine();
    const engine = engineRef.current;

    const track = TRACKS[trackIdx];

    // Start / stop engine when isPlaying changes
    useEffect(() => {
        if (isPlaying) {
            engine.start(track);
            // Elapsed timer
            elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
        } else {
            engine.stop();
            clearInterval(elapsedRef.current);
        }
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    // When track changes while playing — restart engine on new track
    useEffect(() => {
        if (isPlaying) {
            engine.stop();
            setElapsed(0);
            engine.reset();
            engine.start(TRACKS[trackIdx]);
        } else {
            setElapsed(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackIdx]);

    // Cleanup on unmount
    useEffect(() => () => { engine.stop(); clearInterval(elapsedRef.current); }, []);

    // Equalizer animation
    useEffect(() => {
        if (!isPlaying) {
            setBarHeights([4,6,10,16,12,14,18,13,8,16,12,6,9,14,10,5,12,16,8,5]);
            return;
        }
        const iv = setInterval(() => {
            setBarHeights(prev => prev.map(() => Math.floor(Math.random() * 22) + 4));
        }, 180);
        return () => clearInterval(iv);
    }, [isPlaying]);

    const handlePrev = useCallback(() => setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length), []);
    const handleNext = useCallback(() => setTrackIdx(i => (i + 1) % TRACKS.length), []);
    const handlePlayPause = useCallback(() => setIsPlaying(p => !p), []);

    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    // Fake a looping ~2 min song for the progress bar
    const SONG_DURATION = 120;
    const progress = ((elapsed % SONG_DURATION) / SONG_DURATION) * 100;

    return (
        <div className="glass-card" style={styles.card}>
            {/* Track Info */}
            <div style={styles.topInfo}>
                <div style={{ ...styles.musicSquircle, background: `linear-gradient(135deg, ${track.color}aa 0%, ${track.color} 100%)` }}>
                    <Music2 size={20} color="#ffffff" strokeWidth={2.2} />
                </div>
                <div style={styles.trackDetails}>
                    <h2 style={styles.trackTitle}>{track.title}</h2>
                    <span style={styles.artistName}>{track.artist}</span>
                    <span style={styles.subGenre}>{track.genre}</span>
                </div>
                <Volume2
                    size={14}
                    color={isPlaying ? track.color : '#475569'}
                    style={{ marginLeft: 'auto', flexShrink: 0, transition: 'color 0.3s' }}
                />
            </div>

            {/* Progress bar */}
            <div style={styles.progressWrap}>
                <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressFill, width: `${progress}%`, background: `linear-gradient(90deg, ${track.color}88, ${track.color})` }} />
                </div>
                <div style={styles.timeRow}>
                    <span style={styles.timeLabel}>{fmt(elapsed % SONG_DURATION)}</span>
                    <span style={styles.timeLabel}>{fmt(SONG_DURATION)}</span>
                </div>
            </div>

            {/* Controls + Visualizer */}
            <div style={styles.bottomRow}>
                <div style={styles.controlsGroup}>
                    <button style={styles.skipBtn} aria-label="Previous" onClick={handlePrev}>
                        <SkipBack size={15} color="#94a3b8" />
                    </button>
                    <button onClick={handlePlayPause} style={{ ...styles.playBtn, boxShadow: `0 0 14px ${track.color}88` }} aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying
                            ? <Pause size={16} color="#fff" fill="#fff" />
                            : <Play  size={16} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                        }
                    </button>
                    <button style={styles.skipBtn} aria-label="Next" onClick={handleNext}>
                        <SkipForward size={15} color="#94a3b8" />
                    </button>
                </div>

                {/* Equalizer bars */}
                <div style={styles.visualizerContainer}>
                    {barHeights.map((h, i) => (
                        <div key={i} style={{ ...styles.waveBar, height: `${h}px`, opacity: isPlaying ? 0.9 : 0.45, background: `linear-gradient(180deg, ${track.color} 0%, ${track.color}55 100%)` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.2rem 1.3rem', gap: '0.5rem' },
    topInfo: { display: 'flex', alignItems: 'flex-start', gap: '0.85rem' },
    musicSquircle: { width: '42px', height: '42px', borderRadius: '14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' },
    trackDetails: { display: 'flex', flexDirection: 'column', gap: '0.12rem', overflow: 'hidden', flex: 1 },
    trackTitle: { fontSize: '0.98rem', fontWeight: '600', color: '#ffffff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    artistName: { fontSize: '0.82rem', color: '#cbd5e1', fontWeight: '400' },
    subGenre: { fontSize: '0.74rem', color: '#94a3b8', fontWeight: '400' },
    progressWrap: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    progressTrack: { width: '100%', height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden', cursor: 'pointer' },
    progressFill: { height: '100%', borderRadius: '4px', transition: 'width 1s linear' },
    timeRow: { display: 'flex', justifyContent: 'space-between' },
    timeLabel: { fontSize: '0.65rem', color: '#64748b' },
    bottomRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' },
    controlsGroup: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    playBtn: { width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    skipBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 },
    visualizerContainer: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '28px', flex: 1, justifyContent: 'flex-end', paddingRight: '0.25rem' },
    waveBar: { width: '2.5px', borderRadius: '2px', transition: 'height 0.15s ease, opacity 0.2s ease' },
};