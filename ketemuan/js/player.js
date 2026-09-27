/**
 * Audio Player Component
 * Safe promise handling, anti-jitter seeking, and state management.
 */
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const seekInput = document.getElementById('seekInput');
    const seekFill = document.getElementById('seekFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('durationEl') || document.getElementById('duration');
    const volSlider = document.getElementById('volSlider');
    const volBtn = document.getElementById('volBtn');

    if (!audio || !playBtn || !seekInput || !seekFill) return;

    let isSeeking = false;
    let lastVolume = 1;

    const formatTime = (seconds) => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // ── Update Metadata Durasi ──
    const updateDuration = () => {
        if (durationEl && !isNaN(audio.duration)) {
            durationEl.textContent = formatTime(audio.duration);
        }
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    if (audio.readyState >= 1) {
        updateDuration();
    }

    // ── Play / Pause dengan Safe Promise Handling ──
    const togglePlay = () => {
        if (audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        playBtn.textContent = '⏸';
                        playBtn.setAttribute('aria-label', 'Pause');
                    })
                    .catch((err) => {
                        // Mencegah uncaught DOMException jika playback diinterupsi
                        console.warn('Audio play request interrupted or blocked:', err);
                    });
            }
        } else {
            audio.pause();
            playBtn.textContent = '▶';
            playBtn.setAttribute('aria-label', 'Play');
        }
    };

    playBtn.addEventListener('click', togglePlay);

    // ── Time Update (Hanya jika user tidak sedang drag slider) ──
    audio.addEventListener('timeupdate', () => {
        if (isSeeking || isNaN(audio.duration) || audio.duration === 0) return;

        const pct = (audio.currentTime / audio.duration) * 100;
        seekInput.value = pct;
        seekFill.style.width = `${pct}%`;
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    // ── Anti-Jitter Seeking Controls ──
    const startSeek = () => {
        isSeeking = true;
    };

    const performSeekInput = () => {
        const pct = parseFloat(seekInput.value);
        seekFill.style.width = `${pct}%`;
        if (currentTimeEl && !isNaN(audio.duration)) {
            const previewTime = (pct / 100) * audio.duration;
            currentTimeEl.textContent = formatTime(previewTime);
        }
    };

    const commitSeek = () => {
        if (!isNaN(audio.duration)) {
            audio.currentTime = (parseFloat(seekInput.value) / 100) * audio.duration;
        }
        isSeeking = false;
    };

    seekInput.addEventListener('mousedown', startSeek);
    seekInput.addEventListener('touchstart', startSeek, { passive: true });
    seekInput.addEventListener('input', performSeekInput);
    seekInput.addEventListener('change', commitSeek);

    window.addEventListener('mouseup', () => {
        if (isSeeking) commitSeek();
    });
    window.addEventListener('touchend', () => {
        if (isSeeking) commitSeek();
    });

    // ── Volume Control ──
    if (volSlider && volBtn) {
        volSlider.addEventListener('input', () => {
            const vol = parseFloat(volSlider.value);
            audio.volume = vol;
            audio.muted = vol === 0;
            volBtn.textContent = vol === 0 ? '🔇' : '🔊';
            if (vol > 0) lastVolume = vol;
        });

        volBtn.addEventListener('click', () => {
            if (audio.muted || audio.volume === 0) {
                audio.muted = false;
                audio.volume = lastVolume > 0 ? lastVolume : 1;
                volSlider.value = audio.volume;
                volBtn.textContent = '🔊';
            } else {
                audio.muted = true;
                volSlider.value = 0;
                volBtn.textContent = '🔇';
            }
        });
    }

    // ── Audio Ended ──
    audio.addEventListener('ended', () => {
        playBtn.textContent = '▶';
        playBtn.setAttribute('aria-label', 'Play');
        seekInput.value = 0;
        seekFill.style.width = '0%';
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
    });
});
