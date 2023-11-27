import sharedState from '../sharedState.js';
import { pointerDown as drawPointerDown, pointerUp as drawPointerUp } from '../eventHandlers.js';

const enterDrawMode = (scene, canvas) => {
    sharedState.currentMode = 'draw'; // Update the current mode in the shared state
    sharedState.drawnPoints = [] // Clear previously drawn points
    sharedState.scene = scene;
    
    canvas.addEventListener("pointerdown", drawPointerDown);
    canvas.addEventListener("pointerup", drawPointerUp);
};

const exitDrawMode = (canvas) => {
    // Cleanup for draw mode
    canvas.removeEventListener("pointerdown", drawPointerDown);
    canvas.removeEventListener("pointerup", drawPointerUp);
};

export { enterDrawMode, exitDrawMode };