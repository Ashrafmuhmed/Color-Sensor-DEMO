import { defaultColorTable, detectColor, getRGBString, getPixelFromCanvas } from './colorUtils.js';
import { AudioManager } from './audio.js';

export class ColorSensorDemo {
    constructor() {
        this.video = document.getElementById('video');
        this.status = document.getElementById('status');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.colorOverlay = document.getElementById('colorOverlay');
        this.colorHistory = document.getElementById('colorHistory');
        
        this.stream = null;
        this.isRunning = false;
        this.colorHistoryArray = [];
        this.maxHistoryLength = 10;
        this.colorTable = [...defaultColorTable];
        this.audioManager = new AudioManager();

        this.canvas = document.createElement('canvas');
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.ctx = this.canvas.getContext('2d');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
    }

    updateColorHistory(color) {
        this.colorHistoryArray.unshift(color);
        if (this.colorHistoryArray.length > this.maxHistoryLength) {
            this.colorHistoryArray.pop();
        }
        this.renderColorHistory();
    }

    renderColorHistory() {
        this.colorHistory.innerHTML = '';
        this.colorHistoryArray.forEach(color => {
            const dot = document.createElement('div');
            dot.className = 'color-dot';
            dot.style.backgroundColor = getRGBString(color.rgb);
            this.colorHistory.appendChild(dot);
        });
    }

    async start() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Webcam access is not supported in this browser.");
            }
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'environment'
                }, 
                audio: false 
            });
            this.video.srcObject = this.stream;
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.status.textContent = "Status: Webcam running...";
            await this.audioManager.startAudioContext();
            this.processFrame();
        } catch (error) {
            console.error("Error starting webcam:", error);
            this.status.textContent = `Status: Error starting webcam: ${error.message}`;
        }
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.status.textContent = "Status: Webcam stopped.";
            this.audioManager.stopAnnouncements();
        }
    }

    processFrame() {
        if (!this.isRunning) return;

        try {
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const [r, g, b] = getPixelFromCanvas(this.ctx, centerX, centerY);

            const color = detectColor(r, g, b, this.colorTable);
            
            this.colorOverlay.style.backgroundColor = getRGBString(color.rgb);
            this.updateColorHistory(color);
            
            const note = this.audioManager.playNote(color.note);
            this.status.textContent = `Status: Detected ${color.name}, playing ${note}`;
            this.audioManager.announce(color, note);
        } catch (error) {
            console.error("Error processing frame:", error);
            this.status.textContent = `Status: Error processing frame: ${error.message}`;
        }

        setTimeout(() => this.processFrame(), 1000);
    }
} 