import sharedState from "../sharedState.js";
import {
  pointerDown as movePointerDown,
  pointerUp as movePointerUp,
  pointerMove as movePointerMove,
} from "../eventHandlers.js";

const enterVertexEditMode = (scene, canvas, camera) => {
  // Logic for vertex editing
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
  const positions = sharedState.vertices;
  positions[selectedVertexIndex * 3] = newPosition.x;
  //positions[selectedVertexIndex * 3 + 1] = newPosition.y;
  positions[selectedVertexIndex * 3 + 2] = newPosition.z;

  sharedState.modeSpecificVariables.vertexEdit.newPositions = positions;

};

// Function to change mesh colour
function changeMeshColour(selectedMesh) {
  const scene = sharedState.scene;
  let newMaterial = new BABYLON.StandardMaterial("newMaterial", scene);
  newMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
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

  console.log("point ", point);

  for (let i = 0; i < vertices.length/3; i += 3) {
    let vertex = BABYLON.Vector3.FromArray(vertices, i).multiply(mesh.scaling);
    vertex = BABYLON.Vector3.TransformCoordinates(vertex, worldMatrix);

    
    console.log("vertex ", vertex);
    console.log("index ",i/3);
    console.log("distance ", BABYLON.Vector3.Distance(vertex, point));
    

    const distance = BABYLON.Vector3.Distance(vertex, point);
    if (distance < minDistance) {
      minDistance = distance;
      closestVertexIndex = i / 3; // Divide by 3 to get the index

    }
  }

  return closestVertexIndex;
};



const exitVertexEditMode = (canvas,camera) => {
  
  // reconstruct the mesh using the new positions
  camera.attachControl(canvas, true);
  if (sharedState.selectedMesh) {
    const selectedMesh = sharedState.selectedMesh;

// Get the vertices data
    const positions = sharedState.vertices; // Vertices data

    // Get the indices data
    const indices = sharedState.indices; // Indices data
    console.log('old indices',indices);

    // Log the vertices and indices for demonstration
    console.log("Vertices:", positions);
    console.log("Indices:", indices);

    const indexes_list = sharedState.repeatedVertices;

    const alteredIndex = sharedState.modeSpecificVariables.vertexEdit.selectedVertexIndex;

    //alter all the vertices that are repeated
    for(let i=0;i<3;i++){
      let nowIndex = indexes_list[alteredIndex][i];
      positions[nowIndex*3+ 1] += 1;
    }
    
    selectedMesh.dispose(); 

        // Assuming 'scene' is your Babylon.js scene
    // 'positions' and 'indices' are the stored vertices and indices

    // Create a new mesh
    const scene = sharedState.modeSpecificVariables.vertexEdit.scene;
    const reconstructedMesh = new BABYLON.Mesh("reconstructedMesh", scene);

    // Create a VertexData object
    const vertexData = new BABYLON.VertexData();

    // Assign stored positions to the vertex data
    vertexData.positions = positions;

    // Assign stored indices to the vertex data
    vertexData.indices = indices;

    // Apply the vertex data to the reconstructed mesh
    vertexData.applyToMesh(reconstructedMesh);


    // Update the vertices in the sharedState
    sharedState.vertices = positions;


  }
  
  sharedState.modeSpecificVariables.vertexEdit.isDragging = false;
};

export {
  enterVertexEditMode,
  changeMeshColour,
  findClosestVertexIndex,
  exitVertexEditMode,
  moveSelectedVertex,
  transformedVertices,
};