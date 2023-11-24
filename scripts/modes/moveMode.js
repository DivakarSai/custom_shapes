import sharedState from "../sharedState.js";
import { pointerDown as movePointerDown, pointerUp as movePointerUp, pointerMove as movePointerMove } from "../eventHandlers.js";

// Function to handle moving objects mode
const enterMoveMode = (scene,canvas,camera) => {
    sharedState.currentMode = "move";
    console.log("move event starts");
    // Logic for moving objects
    // Implement click-and-drag functionality to move extruded objects

    sharedState.cameraSpecs.alpha = camera.alpha;
    sharedState.cameraSpecs.beta = camera.beta;
    sharedState.cameraSpecs.radius = camera.radius;
    sharedState.cameraSpecs.target = camera.target;


    sharedState.camera.detachControl(canvas);
  
    const ground = scene.getMeshByName("ground");
    const pickedMeshes = []; // Array to store picked meshes

    sharedState.modeSpecificVariables.move.scene = scene;
    sharedState.modeSpecificVariables.move.ground = ground;
    sharedState.modeSpecificVariables.move.pickedMeshes = pickedMeshes;
  
    // Event listeners for pointer events
    canvas.addEventListener("pointerdown", movePointerDown);
    canvas.addEventListener("pointermove", movePointerMove);
    canvas.addEventListener("pointerup", movePointerUp);
  
  };

const exitMoveMode = (canvas,camera) => {


    // Cleanup for move mode


    // allow camera to move
    
    console.log("currentCamera: ", sharedState.camera);

    canvas.removeEventListener("pointerdown", movePointerDown);
    canvas.removeEventListener("pointermove", movePointerMove);
    canvas.removeEventListener("pointerup", movePointerUp);


    camera.attachControl(canvas, true);

    console.log("move event ends");
    };

  export {enterMoveMode, exitMoveMode};