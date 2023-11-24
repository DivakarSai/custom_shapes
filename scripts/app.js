import { createScene } from "./createScene.js";
import { enterDrawMode, exitDrawMode } from "./modes/drawMode.js";
import { enterExtrudeMode, exitExtrudeMode } from "./modes/extrudeMode.js";
import { enterViewMode, exitViewMode } from "./modes/viewMode.js";
import { enterMoveMode, exitMoveMode } from "./modes/moveMode.js";
import sharedState from "./sharedState.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const cm = document.getElementById("currentMode");

let scene,
  drawnPoints,
  camera = [];
let currentMode = "none"; // Initialize with default mode

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
        enterVertexEditMode();
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


// Function to handle vertex editing mode
const enterVertexEditMode = () => {
  // Logic for vertex editing
  // Allow users to select vertices and move them using mouse interactions
  currentMode = "vertexEdit";
  updateCurrentMode();

  const ground = scene.getMeshByName("ground");
  let selectedVertex = null;
  let selectedMesh = null;

  const pointerDown = (event) => {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if (pickInfo.hit && pickInfo.pickedMesh !== ground) {
      // Check if the picked mesh is not the ground
      selectedMesh = pickInfo.pickedMesh;
      // Logic to identify the clicked vertex on the selected mesh
      // For example, find the closest vertex to the picked point:
      selectedVertex = findClosestVertex(selectedMesh, pickInfo.pickedPoint);
      if (selectedVertex !== null) {
        // Perform vertex selection visual feedback
        // For example, change color or scale of the selected vertex
      }
    }
  };

  const pointerMove = (event) => {
    if (selectedVertex !== null && selectedMesh !== null) {
      const pickInfo = scene.pick(
        scene.pointerX,
        scene.pointerY,
        (mesh) => mesh === ground
      );
      if (pickInfo.hit) {
        // Update the position of the selected vertex based on pointer movement
        const newPosition = pickInfo.pickedPoint.clone();

        // Retrieve the vertices of the selected mesh
        const vertices = selectedMesh.getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );

        // Update the position of the selected vertex
        vertices[selectedVertex * 3] = newPosition.x; // X-coordinate
        vertices[selectedVertex * 3 + 1] = newPosition.y; // Y-coordinate
        vertices[selectedVertex * 3 + 2] = newPosition.z; // Z-coordinate

        // Update the mesh vertices
        selectedMesh.updateVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          vertices
        );

        // Recalculate mesh normals and update
        selectedMesh.createNormals();
        selectedMesh.refreshBoundingInfo();
      }
    }
  };

  const pointerUp = (event) => {
    // Clear the selected vertex and mesh when the pointer is released
    selectedVertex = null;
    selectedMesh = null;
  };

  // Event listeners for pointer events
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
};

// Function to find the closest vertex to a given point on a mesh
const findClosestVertex = (mesh, point) => {
  // Logic to find the closest vertex to the given point on the mesh
  // For example, iterate through mesh vertices and find the nearest one to the point
  // Return the index or reference to the closest vertex
  // You might use vector calculations or mesh methods for vertex manipulation
  let closestVertexIndex = null;
  let minDistance = Number.MAX_VALUE;

  if (!mesh || !point || !mesh.getVerticesData || !mesh.getTotalVertices()) {
    return closestVertexIndex;
  }

  const vertices = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

  for (let i = 0; i < mesh.getTotalVertices(); i += 3) {
    const vertex = new BABYLON.Vector3(
      vertices[i],
      vertices[i + 1],
      vertices[i + 2]
    );
    const distance = BABYLON.Vector3.DistanceSquared(vertex, point);

    if (distance < minDistance) {
      minDistance = distance;
      closestVertexIndex = i / 3; // Index of the closest vertex
    }
  }

  return closestVertexIndex;
};

// Event listeners for mode buttons
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