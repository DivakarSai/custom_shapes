import { createScene } from "./createScene.js";
import { enterDrawMode, exitDrawMode } from "./modes/drawMode.js";
import { enterExtrudeMode, exitExtrudeMode } from "./modes/extrudeMode.js";
import { enterViewMode, exitViewMode } from "./modes/viewMode.js";
import { enterMoveMode, exitMoveMode } from "./modes/moveMode.js";
import { enterVertexEditMode, exitVertexEditMode } from "./modes/vertexEditMode.js";
import sharedState from "./sharedState.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const cm = document.getElementById("currentMode");

let scene,
  drawnPoints,
  camera = [];// Initialize with default mode

// let alpha, beta, radius, target;

const setCurrentMode = (newMode) => {
    const prevMode = sharedState.currentMode;
  if (sharedState.currentMode !== newMode) {

    switch (prevMode) {
        case "draw":
            exitDrawMode(canvas);
            break;
        case "extrude":
            exitExtrudeMode();
            break;
        case "move":
            exitMoveMode(canvas,camera);
            break;
        case "vertexEdit":
          exitVertexEditMode();
            break;
        case "view":
            exitViewMode();
            break;
        default:
            console.log("Invalid mode");
            break;
        }
   
    sharedState.currentMode = newMode;
    switch (newMode) {
      case "draw":
        enterDrawMode(scene, canvas);
        break;
      case "extrude":
        enterExtrudeMode();
        break;
      case "move":
        enterMoveMode(scene,canvas,camera);
        break;
      case "vertexEdit":
        enterVertexEditMode(scene);
        break;
      case "view":
        enterViewMode();
        break;
      default:
        console.log("Invalid mode");
        break;
    }
  }
  updateCurrentMode(newMode);
};

const updateCurrentMode = () => {
  cm.textContent = `Current Mode: ${sharedState.currentMode}`;
};

// Event listeners for mode buttons

const viewButton = document.getElementById("viewButton");
viewButton.addEventListener("click", () => {
  setCurrentMode("view");
});
const drawButton = document.getElementById("drawButton");
drawButton.addEventListener("click", () => {
  setCurrentMode("draw");
});

const extrudeButton = document.getElementById("extrudeButton");
extrudeButton.addEventListener("click", () => {
  setCurrentMode("extrude");
});

const moveButton = document.getElementById("moveButton");
moveButton.addEventListener("click", () => {
  setCurrentMode("move");
});

const vertexEditButton = document.getElementById("vertexEditButton");
vertexEditButton.addEventListener("click", () => {
  setCurrentMode("vertexEdit");
});

// Babylon.js Engine Initialization
window.addEventListener("DOMContentLoaded", () => {
  let obj = createScene(engine, canvas);
  scene = obj.scene;
  camera = obj.camera;
  sharedState.camera = camera;
  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", () => {
    engine.resize();
  });
});