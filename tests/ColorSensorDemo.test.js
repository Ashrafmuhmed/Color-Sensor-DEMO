import { ColorSensorDemo } from '../js/ColorSensorDemo.js';
import { AudioManager } from '../js/audio.js';

jest.mock('../js/audio.js', () => ({
  AudioManager: jest.fn().mockImplementation(() => ({
    startAudioContext: jest.fn().mockResolvedValue(undefined),
    playNote: jest.fn().mockReturnValue('C4'),
    announce: jest.fn(),
    stopAnnouncements: jest.fn()
  }))
}));

document.getElementById = jest.fn((id) => {
  const element = document.createElement('div');
  element.id = id;
  return element;
});

const mockMediaDevices = {
  getUserMedia: jest.fn()
};
global.navigator.mediaDevices = mockMediaDevices;

const mockCanvas = {
  getContext: jest.fn().mockReturnValue({
    drawImage: jest.fn(),
    getImageData: jest.fn().mockReturnValue({
      data: new Uint8ClampedArray([255, 0, 0, 255])
    })
  })
};
global.HTMLCanvasElement.prototype.getContext = mockCanvas.getContext;

describe('ColorSensorDemo', () => {
  let colorSensorDemo;

  beforeEach(() => {
    jest.clearAllMocks();
    colorSensorDemo = new ColorSensorDemo();
  });

  describe('constructor', () => {
    test('should initialize properly', () => {
      expect(colorSensorDemo.isRunning).toBe(false);
      expect(colorSensorDemo.stream).toBeNull();
      expect(colorSensorDemo.colorHistoryArray).toEqual([]);
      expect(AudioManager).toHaveBeenCalled();
    });
  });

  describe('start', () => {
    beforeEach(() => {
      mockMediaDevices.getUserMedia.mockResolvedValue({
        getTracks: () => []
      });
    });

    test('should start webcam successfully', async () => {
      await colorSensorDemo.start();
      expect(colorSensorDemo.isRunning).toBe(true);
      expect(colorSensorDemo.startBtn.disabled).toBe(true);
      expect(colorSensorDemo.stopBtn.disabled).toBe(false);
    });

    test('should handle webcam access error', async () => {
      mockMediaDevices.getUserMedia.mockRejectedValue(new Error('Access denied'));
      await colorSensorDemo.start();
      expect(colorSensorDemo.isRunning).toBe(false);
      expect(colorSensorDemo.status.textContent).toContain('Error starting webcam');
    });
  });

  describe('stop', () => {
    test('should stop webcam', () => {
      const mockTrack = { stop: jest.fn() };
      colorSensorDemo.stream = { getTracks: () => [mockTrack] };
      colorSensorDemo.isRunning = true;
      colorSensorDemo.stop();
      expect(mockTrack.stop).toHaveBeenCalled();
      expect(colorSensorDemo.isRunning).toBe(false);
      expect(colorSensorDemo.stream).toBeNull();
    });
  });

  describe('updateColorHistory', () => {
    test('should update color history array', () => {
      const color = { name: 'red', rgb: [255, 0, 0] };
      colorSensorDemo.updateColorHistory(color);
      expect(colorSensorDemo.colorHistoryArray).toHaveLength(1);
      expect(colorSensorDemo.colorHistoryArray[0]).toEqual(color);
    });

    test('should limit history length', () => {
      const color = { name: 'red', rgb: [255, 0, 0] };
      for (let i = 0; i < 15; i++) {
        colorSensorDemo.updateColorHistory(color);
      }
      expect(colorSensorDemo.colorHistoryArray).toHaveLength(colorSensorDemo.maxHistoryLength);
    });
  });
}); 