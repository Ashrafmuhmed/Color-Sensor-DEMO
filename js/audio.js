export class AudioManager {
    constructor() {
        try {
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: { decay: 0.1, sustain: 0.3, release: 0.5 }
            }).toDestination();

            this.reverb = new Tone.Reverb({
                decay: 2,
                wet: 0.3
            }).toDestination();

            this.synth.connect(this.reverb);
        } catch (error) {
            console.error("audio.js: Error in constructor:", error);
            throw error;
        }
    }

    async startAudioContext() {
        try {
            if (Tone.context.state !== 'running') {
                await Tone.start();
            }
        } catch (error) {
            console.error("audio.js: Error starting audio context:", error);
            throw error;
        }
    }

    playNote(note, duration = "8n") {
        try {
            this.synth.triggerAttackRelease(note, duration);
            return note;
        } catch (error) {
            console.error("audio.js: Error playing note:", error);
            throw error;
        }
    }

    announce(color, note) {
        try {
            if (!speechSynthesis.speaking) {
                const utterance = new SpeechSynthesisUtterance(`Color: ${color.name}, Note: ${note}`);
                utterance.rate = 1.2;
                utterance.pitch = 1.1;
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error("audio.js: Error in announce:", error);
        }
    }

    stopAnnouncements() {
        try {
            speechSynthesis.cancel();
        } catch (error) {
            console.error("audio.js: Error in stopAnnouncements:", error);
        }
    }
}