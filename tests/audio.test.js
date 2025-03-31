import { AudioManager } from '../js/audio.js';
import { suppressConsoleErrors } from './test-utils.js';

suppressConsoleErrors();

const mockSynth = {
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn()
};

const mockReverb = {
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn().mockReturnThis()
};

jest.mock('tone', () => {
    return {
        __esModule: true,
        default: {
            start: jest.fn().mockResolvedValue(undefined),
            PolySynth: jest.fn().mockImplementation(() => mockSynth),
            Synth: jest.fn(),
            Reverb: jest.fn().mockImplementation(() => mockReverb)
        }
    };
});

describe('AudioManager', () => {
    let audioManager;

    beforeEach(() => {
        jest.clearAllMocks();
        audioManager = new AudioManager();
    });

    test('constructor creates synth and reverb', () => {
        expect(audioManager.synth).toBeDefined();
        expect(audioManager.reverb).toBeDefined();
    });

    test('playNote triggers synth correctly', () => {
        const result = audioManager.playNote('C4');
        expect(result).toBe('C4');
        expect(mockSynth.triggerAttackRelease).toHaveBeenCalledWith('C4', '8n');
    });

    test('startAudioContext starts Tone', async () => {
        await audioManager.startAudioContext();
        expect(require('tone').default.start).toHaveBeenCalled();
    });

    test('announce creates speech synthesis', () => {
        const mockUtterance = {};
        global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => mockUtterance);
        global.speechSynthesis = {
            speak: jest.fn(),
            speaking: false
        };

        audioManager.announce({ name: 'red' }, 'C4');
        
        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Color: red, Note: C4');
        expect(global.speechSynthesis.speak).toHaveBeenCalledWith(mockUtterance);
    });

    test('stopAnnouncements cancels speech synthesis', () => {
        global.speechSynthesis = { cancel: jest.fn() };
        audioManager.stopAnnouncements();
        expect(global.speechSynthesis.cancel).toHaveBeenCalled();
    });
});