import { defaultColorTable, detectColor, getRGBString, getPixelFromCanvas } from '../js/colorUtils.js';

describe('colorUtils', () => {
  describe('detectColor', () => {
    test('should detect red color correctly', () => {
      const result = detectColor(255, 0, 0, defaultColorTable);
      expect(result.name).toBe('red');
      expect(result.note).toBe('C4');
    });

    test('should detect unknown color', () => {
      const result = detectColor(128, 128, 128, []);
      expect(result.name).toBe('unknown');
      expect(result.note).toBe('C4');
    });

    test('should find closest matching color', () => {
      const result = detectColor(250, 10, 10, defaultColorTable);
      expect(result.name).toBe('red');
    });
  });

  describe('getRGBString', () => {
    test('should format RGB values correctly', () => {
      const result = getRGBString([255, 128, 0]);
      expect(result).toBe('rgb(255,128,0)');
    });
  });

  describe('getPixelFromCanvas', () => {
    test('should get pixel data from canvas', () => {
      const mockContext = {
        getImageData: jest.fn().mockReturnValue({
          data: new Uint8ClampedArray([255, 0, 0, 255])
        })
      };
      const result = getPixelFromCanvas(mockContext, 0, 0);
      expect(result).toEqual([255, 0, 0]);
      expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, 1, 1);
    });
  });
}); 