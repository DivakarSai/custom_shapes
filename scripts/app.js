import { createScene } from "./createScene.js";
import { enterDrawMode, exitDrawMode } from "./modes/drawMode.js";
import { enterExtrudeMode, exitExtrudeMode } from "./modes/extrudeMode.js";
import { enterViewMode, exitViewMode } from "./modes/viewMode.js";
import { enterMoveMode, exitMoveMode } from "./modes/moveMode.js";
import { exitVertexEditMode, enterVertexEditMode } from "./modes/vertexEditMode.js";
import sharedState from "./sharedState.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const cm = document.getElementById("currentMode");

let scene,
  drawnPoints,
  camera = [];
let currentMode = "none"; // Initialize with default mode

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
        exitMoveMode(canvas, camera);
        break;
      case "vertexEdit":
        exitVertexEditMode(canvas, camera);
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
        enterMoveMode(scene, canvas, camera);
        break;
      case "vertexEdit":
        enterVertexEditMode(scene, canvas, camera);
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

function transformedVertices(selectedMesh) {
  // Get the updated world matrix of the mesh after transformation
  const worldMatrix = selectedMesh.getWorldMatrix();

  // Get the original vertices data
  const originalVerticesData = selectedMesh.getVerticesData(
    BABYLON.VertexBuffer.PositionKind
  );

  // Create an array to store transformed vertices
  const transformedVertices = [];

  // Transform each vertex using the world matrix
  for (let i = 0; i < originalVerticesData.length; i += 3) {
    const vertex = new BABYLON.Vector3(
      originalVerticesData[i],
      originalVerticesData[i + 1],
      originalVerticesData[i + 2]
    );
    const transformedVertex = BABYLON.Vector3.TransformCoordinates(
      vertex,
      worldMatrix
    );
    transformedVertices.push(transformedVertex);
  }
  return transformedVertices;
}

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