/**
 * Synthesized Web Audio API Engine
 * Generates responsive tactile sound effects without external audio assets.
 */

export class AudioEngine {
  constructor(storageKey = 'calc_sound') {
    this.storageKey = storageKey;
    this.audioCtx = null;
    this.enabled = this.loadPreference();
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.enabled);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.enabled));
  }

  toggle() {
    this.enabled = !this.enabled;
    this.savePreference();
    this.notify();
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  play(type = 'click') {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      switch (type) {
        case 'click':
          // Subtle organic click
          osc.type = 'sine';
          osc.frequency.setValueAtTime(580, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;

        case 'success':
          // Harmonic validation chime
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.start(now);
          osc.stop(now + 0.16);
          break;

        case 'error':
          // Low descending warning buzz
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.linearRampToValueAtTime(90, now + 0.14);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.14);
          break;
      }
    } catch (e) {
      // Gracefully silent if audio restricted by browser
    }
  }

  loadPreference() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(this.storageKey) !== 'false';
      }
    } catch (e) {}
    return true;
  }

  savePreference() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, this.enabled.toString());
      }
    } catch (e) {}
  }
}
