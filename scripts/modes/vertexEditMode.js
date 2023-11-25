import sharedState from "../sharedState.js";
import {
  pointerDown as movePointerDown,
  pointerUp as movePointerUp,
  pointerMove as movePointerMove,
} from "../eventHandlers.js";

const enterVertexEditMode = (scene, canvas, camera) => {
  // Logic for vertex editing
  // Allow users to select vertices and move them using mouse interactions

  sharedState.currentMode = "vertexEdit";
  sharedState.modeSpecificVariables.vertexEdit.scene = scene;
  sharedState.modeSpecificVariables.vertexEdit.ground = scene.getMeshByName("ground");

  sharedState.camera.detachControl(canvas);

  canvas.addEventListener("pointerdown", movePointerDown);
    canvas.addEventListener("pointermove", movePointerMove);
    canvas.addEventListener("pointerup", movePointerUp);
};

// Function to move the selected vertex
const moveSelectedVertex = (newPosition, selectedVertexIndex, selectedMesh) => {
  const positions = selectedMesh.getVerticesData(
    BABYLON.VertexBuffer.PositionKind
  );
  positions[selectedVertexIndex * 3] = newPosition.x;
  positions[selectedVertexIndex * 3 + 1] = newPosition.y;
  positions[selectedVertexIndex * 3 + 2] = newPosition.z;

  selectedMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
  selectedMesh._resetPointsArrayCache();
  selectedMesh._resetNormalsCache();
  selectedMesh._resetFacetData();
  selectedMesh.computeWorldMatrix(true);
};

// Function to change mesh colour
function changeMeshColour(selectedMesh) {
  const scene = sharedState.modeSpecificVariables.extrude.scene;
  let newMaterial = new BABYLON.StandardMaterial("newMaterial", scene);
  newMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Change to red color (RGB: 1, 0, 0)
  selectedMesh.material = newMaterial;
}

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

// Function to find the closest vertex to a given point on a mesh
const findClosestVertexIndex = (mesh, point) => {
  const vertices = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  const worldMatrix = mesh.getWorldMatrix();

  let minDistance = Number.MAX_VALUE;
  let closestVertexIndex = -1;

  for (let i = 0; i < vertices.length; i += 3) {
    let vertex = BABYLON.Vector3.FromArray(vertices, i).multiply(mesh.scaling); // Get vertex in world space
    vertex = BABYLON.Vector3.TransformCoordinates(vertex, worldMatrix); // Transform to world coordinates

    const distance = BABYLON.Vector3.Distance(vertex, point);
    if (distance < minDistance) {
      minDistance = distance;
      closestVertexIndex = i / 3; // Divide by 3 to get the index
    }
  }

  return closestVertexIndex;
};

const exitVertexEditMode = (canvas,camera) => {
  camera.attachControl(canvas, true);
  sharedState.modeSpecificVariables.vertexEdit.isDragging = false;
};

export {
  enterVertexEditMode,
  changeMeshColour,
  findClosestVertexIndex,
  transformedVertices,
  exitVertexEditMode,
  moveSelectedVertex,
};