import { describe, it, expect, beforeEach } from 'vitest';
import { SoundPresetManager, SOUND_PROFILES } from '../src/core/sound-presets.js';

describe('SoundPresetManager Service', () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    manager = new SoundPresetManager('test_sound_profile_key');
  });

  it('initializes with default mechanical sound profile', () => {
    expect(manager.currentProfileId).toBe('mechanical');
    const profile = manager.getProfile();
    expect(profile.type).toBe('triangle');
    expect(profile.clickFreq).toBe(180);
  });

  it('cycles across all 4 profiles and persists selection', () => {
    const next1 = manager.cycleProfile();
    expect(next1.id).toBe('soft');
    expect(localStorage.getItem('test_sound_profile_key')).toBe('soft');

    const next2 = manager.cycleProfile();
    expect(next2.id).toBe('retro');

    const next3 = manager.cycleProfile();
    expect(next3.id).toBe('scifi');

    const loop = manager.cycleProfile();
    expect(loop.id).toBe('mechanical');
  });

  it('safely handles invalid profile keys', () => {
    expect(manager.setProfile('non_existent')).toBe(false);
    expect(manager.getProfile('invalid')).toEqual(SOUND_PROFILES.mechanical);
  });
});
