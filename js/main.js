import { ColorSensorDemo } from './ColorSensorDemo.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new ColorSensorDemo();
        app.init();
    } catch (error) {
        console.error("main.js: Error initializing app:", error);
    }
});
