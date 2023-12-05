import sharedState from '../sharedState.js';
import { pointerDown as drawPointerDown, pointerUp as drawPointerUp } from '../eventHandlers.js';

const enterDrawMode = (scene, canvas) => {
    sharedState.currentMode = 'draw'; // Update the current mode in the shared state
    sharedState.drawnPoints = [] // Clear previously drawn points
    sharedState.modeSpecificVariables.draw.scene = scene
    sharedState.modeSpecificVariables.draw.ground = scene.getMeshByName("ground");
    
    canvas.addEventListener("pointerdown", drawPointerDown);
    canvas.addEventListener("pointerup", drawPointerUp);
};

const exitDrawMode = (canvas) => {
    // remove drawn markers
    sharedState.drawnMarkers.forEach((marker) => {
        marker.dispose();
    });
    // remove event listeners
    canvas.removeEventListener("pointerdown", drawPointerDown);
    canvas.removeEventListener("pointerup", drawPointerUp);
};

export { enterDrawMode, exitDrawMode };