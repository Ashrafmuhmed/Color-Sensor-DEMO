import Tone from 'tone';

export class AudioManager {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { decay: 0.1, sustain: 0.3, release: 0.5 }
        }).toDestination();

        this.reverb = new Tone.Reverb({
            decay: 2,
            wet: 0.3
        }).toDestination();

        this.synth.connect(this.reverb);
    }

    async startAudioContext() {
        try {
            await Tone.start();
            console.log("Audio context started");
        } catch (error) {
            console.error("Error starting audio context:", error);
            throw error;
        }
    }

    playNote(note, duration = "8n") {
        try {
            this.synth.triggerAttackRelease(note, duration);
            return note;
        } catch (error) {
            console.error("Error playing note:", error);
            throw error;
        }
    }

    announce(color, note) {
        if (!speechSynthesis.speaking) {
            const utterance = new SpeechSynthesisUtterance(`Color: ${color.name}, Note: ${note}`);
            utterance.rate = 1.2;
            utterance.pitch = 1.1;
            speechSynthesis.speak(utterance);
        }
    }

    stopAnnouncements() {
        speechSynthesis.cancel();
    }
}