import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { KeyboardHandler } from '../src/core/keyboard-handler.js';

describe('KeyboardHandler', () => {
  let mockStateMachine;
  let mockAudioEngine;
  let keyboardHandler;

  beforeEach(() => {
    mockStateMachine = {
      inputDigit: vi.fn(),
      inputDecimal: vi.fn(),
      setOperation: vi.fn(),
      calculate: vi.fn(),
      backspace: vi.fn(),
      clear: vi.fn(),
      applyPercent: vi.fn(),
    };

    mockAudioEngine = {
      play: vi.fn(),
    };

    keyboardHandler = new KeyboardHandler(mockStateMachine, mockAudioEngine);
    keyboardHandler.attach();
  });

  afterEach(() => {
    keyboardHandler.detach();
  });

  it('routes digit keys to inputDigit', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '7' }));
    expect(mockStateMachine.inputDigit).toHaveBeenCalledWith('7');
    expect(mockAudioEngine.play).toHaveBeenCalledWith('click');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '0' }));
    expect(mockStateMachine.inputDigit).toHaveBeenCalledWith('0');
  });

  it('routes comma and dot to inputDecimal', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '.' }));
    expect(mockStateMachine.inputDecimal).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ',' }));
    expect(mockStateMachine.inputDecimal).toHaveBeenCalledTimes(2);
  });

  it('routes arithmetic operator keys', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }));
    expect(mockStateMachine.setOperation).toHaveBeenCalledWith('+');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '-' }));
    expect(mockStateMachine.setOperation).toHaveBeenCalledWith('−');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '*' }));
    expect(mockStateMachine.setOperation).toHaveBeenCalledWith('×');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
    expect(mockStateMachine.setOperation).toHaveBeenCalledWith('÷');
  });

  it('routes Enter and = to calculate', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(mockStateMachine.calculate).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '=' }));
    expect(mockStateMachine.calculate).toHaveBeenCalledTimes(2);
  });

  it('routes Backspace, Escape, and Percent', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(mockStateMachine.backspace).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(mockStateMachine.clear).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '%' }));
    expect(mockStateMachine.applyPercent).toHaveBeenCalledTimes(1);
  });

  it('ignores events when target is an input element', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = new KeyboardEvent('keydown', { key: '5', bubbles: true });
    input.dispatchEvent(event);

    expect(mockStateMachine.inputDigit).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
