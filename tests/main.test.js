import '../js/main.js';
import { ColorSensorDemo } from '../js/ColorSensorDemo.js';

jest.mock('../js/ColorSensorDemo.js');

describe('main.js', () => {
  test('should initialize ColorSensorDemo when DOM is loaded', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(ColorSensorDemo).toHaveBeenCalled();
  });
}); 