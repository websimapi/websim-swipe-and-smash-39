import * as recorder from './recorder.js';
import { Simulator } from './simulation.js';
// We need to import the mounter dynamically or just assume it's loaded via module system
import { mountReplay } from './main.jsx';

export default class Replay {
    constructor(game, config) {
        this.game = game;
        this.config = config;
        this.reactRoot = null;
        this.setupUI();
    }

    setupUI() {
        document.getElementById('clip-button').addEventListener('click', () => this.show());
        document.getElementById('close-replay-button').addEventListener('click', () => this.hide());
    }

    async show() {
        this.game.pauseTimer();
        this.game.pauseMainBGM();
        if (this.game.isRecordingStarted) {
            recorder.pauseRecording();
        }

        const recording = recorder.getRecording();
        if (!recording || !recording.initialState) return;

        // Generate Simulation Data
        const simulator = new Simulator(this.config);
        const simData = await simulator.run(recording);

        const modal = document.getElementById('replay-modal');
        modal.classList.remove('hidden');
        
        const container = document.getElementById('remotion-root');
        container.innerHTML = ''; // Clean up
        
        this.reactRoot = mountReplay(container, {
            events: simData.events,
            sounds: simData.sounds,
            duration: simData.duration
        });
    }

    hide() {
        const modal = document.getElementById('replay-modal');
        modal.classList.add('hidden');
        
        if (this.reactRoot) {
            this.reactRoot.unmount();
            this.reactRoot = null;
        }

        if (this.game.isRecordingStarted) {
            recorder.resumeRecording();
        }
        this.game.resumeMainBGM();
        this.game.resumeTimer();
    }
}

