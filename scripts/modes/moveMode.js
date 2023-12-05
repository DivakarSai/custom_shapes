import sharedState from "../sharedState.js";
import { pointerDown as movePointerDown, pointerUp as movePointerUp, pointerMove as movePointerMove } from "../eventHandlers.js";

// Function to handle moving objects mode
const enterMoveMode = (scene,canvas,camera) => {
    sharedState.currentMode = "move";
    // Logic for moving objects

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
  
  // update vertices and store the transformed vertices
  if (sharedState.selectedMesh) sharedState.vertices = movedVertices(sharedState.selectedMesh);
    // Cleanup for move mode
    canvas.removeEventListener("pointerdown", movePointerDown);
    canvas.removeEventListener("pointermove", movePointerMove);
    canvas.removeEventListener("pointerup", movePointerUp);
    // allow camera to move
    camera.attachControl(canvas, true);
    };


function movedVertices(selectedMesh) {
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
    transformedVertices.push(transformedVertex._x);
    transformedVertices.push(transformedVertex._y);
    transformedVertices.push(transformedVertex._z);

  }

  // update the transformed vertices using repeatedVertices
  const repeatedVertices = sharedState.repeatedVertices;

  for(let i = 0; i < repeatedVertices.length; i+=3){
    let firstIndex = repeatedVertices[i][0], secondIndex = repeatedVertices[i][1], thirdIndex = repeatedVertices[i][2];
    transformedVertices[secondIndex*3] = transformedVertices[firstIndex*3];
    transformedVertices[secondIndex*3+1] = transformedVertices[firstIndex*3+1];
    transformedVertices[secondIndex*3+2] = transformedVertices[firstIndex*3+2];

    transformedVertices[thirdIndex*3] = transformedVertices[firstIndex*3];
    transformedVertices[thirdIndex*3+1] = transformedVertices[firstIndex*3+1];
    transformedVertices[thirdIndex*3+2] = transformedVertices[firstIndex*3+2];
  }



  return transformedVertices;
}

  export {enterMoveMode, exitMoveMode};