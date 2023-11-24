import sharedState from '../sharedState.js';
import { pointerDown as drawPointerDown, pointerUp as drawPointerUp } from '../eventHandlers.js';

const enterDrawMode = (scene, canvas) => {
    console.log("Draw event begins");
    sharedState.currentMode = 'draw'; // Update the current mode in the shared state
    sharedState.drawnPoints = [] // Clear previously drawn points
    sharedState.modeSpecificVariables.draw.scene = scene
    sharedState.modeSpecificVariables.draw.ground = scene.getMeshByName("ground");
    

    canvas.addEventListener("pointerdown", drawPointerDown);
    canvas.addEventListener("pointerup", drawPointerUp);
};

const exitDrawMode = (canvas) => {
    // Cleanup for draw mode
    canvas.removeEventListener("pointerdown", drawPointerDown);
    canvas.removeEventListener("pointerup", drawPointerUp);
    console.log("Draw event ends");
};

export { enterDrawMode, exitDrawMode };