/**
 * Audio Synthesis Sound Presets
 * Configures distinct sound profiles (Mechanical, Soft, 8-bit, Sci-Fi) for keypad audio feedback.
 */

export const SOUND_PROFILES = {
  mechanical: {
    id: 'mechanical',
    name: 'Clavier Mécanique',
    clickFreq: 180,
    clickDuration: 0.03,
    successFreqs: [440, 554.37, 659.25], // A major triad
    errorFreq: 110,
    type: 'triangle',
  },
  soft: {
    id: 'soft',
    name: 'Bulle Douce',
    clickFreq: 400,
    clickDuration: 0.02,
    successFreqs: [523.25, 659.25, 783.99], // C major
    errorFreq: 150,
    type: 'sine',
  },
  retro: {
    id: 'retro',
    name: 'Rétro 8-bit',
    clickFreq: 220,
    clickDuration: 0.04,
    successFreqs: [261.63, 329.63, 392.00, 523.25],
    errorFreq: 85,
    type: 'square',
  },
  scifi: {
    id: 'scifi',
    name: 'Futuriste Laser',
    clickFreq: 880,
    clickDuration: 0.025,
    successFreqs: [659.25, 880, 1108.73],
    errorFreq: 130,
    type: 'sawtooth',
  },
};

export class SoundPresetManager {
  constructor(storageKey = 'calc_sound_profile') {
    this.storageKey = storageKey;
    this.currentProfileId = this.loadProfile();
  }

  loadProfile() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(this.storageKey);
        if (saved && SOUND_PROFILES[saved]) return saved;
      }
    } catch (e) {}
    return 'mechanical';
  }

  getProfile(profileId = null) {
    const id = profileId || this.currentProfileId;
    return SOUND_PROFILES[id] || SOUND_PROFILES.mechanical;
  }

  setProfile(profileId) {
    if (!SOUND_PROFILES[profileId]) return false;
    this.currentProfileId = profileId;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.storageKey, profileId);
      }
    } catch (e) {}
    return true;
  }

  cycleProfile() {
    const keys = Object.keys(SOUND_PROFILES);
    const currentIndex = keys.indexOf(this.currentProfileId);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    this.setProfile(nextKey);
    return SOUND_PROFILES[nextKey];
  }
}
