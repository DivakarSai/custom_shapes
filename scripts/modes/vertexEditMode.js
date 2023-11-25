import sharedState from "../sharedState.js";

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

const enterVertexEditMode = (scene) => {
    // Logic for vertex editing
    // Allow users to select vertices and move them using mouse interactions
    sharedState.currentMode = "vertexEdit";
  
    const shapeMesh = scene.getMeshByName("shape");
    console.log("shapeMesh: ", shapeMesh);
  
      // Accessing Vertices
    var vertices = scene.getMeshByName("box").getVerticesData(BABYLON.VertexBuffer.PositionKind);
    console.log(vertices);
  
    const ground = scene.getMeshByName("ground");
    let selectedVertex = null;
    let selectedMesh = null; 
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


const exitVertexEditMode = () => {
    // Cleanup for vertex editing mode
    canvas.removeEventListener("pointerdown", pointerDown);
    canvas.removeEventListener("pointermove", pointerMove);
    canvas.removeEventListener("pointerup", pointerUp);
    console.log("vertexEdit event ends");
};

export { enterVertexEditMode, exitVertexEditMode };