/**
 * Soft synthetic sound generator utilizing Web Audio API. 
 * Prevents loading external audio files and runs smoothly in the sandbox.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundManager = {
  toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  },

  getMuteState() {
    return isMuted;
  },

  playClick() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // Ramp up quickly

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  playCorrect() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      
      // High-pitched "ding-ding!"
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        
        gain.gain.setValueAtTime(0.12, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.25);
        
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.3);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  playIncorrect() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      
      // Soft downward "boing..."
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.25);
      
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
      
      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  playFanfare() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      
      // Chord progressions: C4, E4, G4, C5 (joyful celebration)
      const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
      arpeggio.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        
        gain.gain.setValueAtTime(0.1, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.005, t + idx * 0.05 + 0.5);
        
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.6);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  },

  playPop() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
};
