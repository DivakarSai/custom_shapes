import sharedState from "./sharedState.js";
import { showPrompt } from "./components/prompt.js";
import {changeMeshColour, findClosestVertexIndex, transformedVertices} from "./modes/vertexEditMode.js";

const pointerDown = (event) => {
  // Pointer down logic for each modes
  switch (sharedState.currentMode) {
    case "draw":
      // Draw mode pointer down logic
      if (event.button !== 0) return; // Check for left mouse click
      const groundD = sharedState.modeSpecificVariables.draw.ground;
      const sceneD = sharedState.modeSpecificVariables.draw.scene;
      const pickInfoD = sceneD.pick(
        sceneD.pointerX,
        sceneD.pointerY,
        (mesh) => mesh === groundD
      );
      if (pickInfoD.hit) {
        const hitPoint = pickInfoD.pickedPoint;
        sharedState.drawnPoints.push(hitPoint.clone()); // Store the clicked point
        // Visual cue: Add a marker or shape at the clicked point
        const marker = BABYLON.MeshBuilder.CreateSphere(
          "marker",
          { diameter: 0.1 },
          sceneD
        );
        marker.position = hitPoint;
      }
      break;
    case "extrude":
      // Extrude mode pointer down logic
      break;

    case "move":
      // Move mode pointer down logic
      const sceneM = sharedState.modeSpecificVariables.move.scene;
      const groundM = sharedState.modeSpecificVariables.move.ground;
      const pickedMeshes = sharedState.modeSpecificVariables.move.pickedMeshes;
      const pickInfoM = sceneM.pick(sceneM.pointerX, sceneM.pointerY);
      if (pickInfoM.hit && pickInfoM.pickedMesh !== groundM) {
        // Check if the picked mesh is not the ground
        pickedMeshes.push(pickInfoM.pickedMesh);
      }
      sharedState.modeSpecificVariables.move.pickedMeshes = pickedMeshes;

      break;
    case "vertexEdit":
      // vertexEdit mode pointer down logic
      const sceneVE = sharedState.modeSpecificVariables.vertexEdit.scene;
      const groundVE = sharedState.modeSpecificVariables.vertexEdit.ground;
      const pickInfoVE = sceneVE.pick(sceneVE.pointerX, sceneVE.pointerY);
      if (pickInfoVE.hit && pickInfoVE.pickedMesh !== groundVE) {
        let selectedMesh = pickInfoVE.pickedMesh;
        sharedState.selectedMesh = selectedMesh;
        changeMeshColour(selectedMesh);
        sharedState.modeSpecificVariables.vertexEdit.isDragging = true;
        
        let vertices = transformedVertices(selectedMesh);
        sharedState.modeSpecificVariables.vertexEdit.vertices = vertices;
        let selectedVertexIndex = findClosestVertexIndex(
          selectedMesh,
          pickInfoVE.pickedPoint,
          vertices
        ); //selectedVertexIndex

        sharedState.modeSpecificVariables.move.selectedVertexIndex = selectedVertexIndex;

        
        if (selectedVertexIndex !== null) {
          const sphereRadius = 0.1; // radius of the spheres as needed for marking
          const sphereMaterial = new BABYLON.StandardMaterial(
            "sphereMaterial",
            sceneVE
          );
          sphereMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // color for marking
          const sphere = BABYLON.MeshBuilder.CreateSphere(
            `sphere`,
            { diameter: sphereRadius * 1 },
            sceneVE
          );
          sphere.material = sphereMaterial;
          sphere.position = vertices[selectedVertexIndex];
        }
      }
  }
};

const pointerUp = (event) => {
  // Pointer up logic for all modes
  switch (sharedState.currentMode) {
    case "draw":
      // Draw mode pointer up logic
      let drawnPoints = sharedState.drawnPoints;
      const sceneD = sharedState.modeSpecificVariables.draw.scene;

      // Right-click to complete the shape (assuming at least 3 points)
      if (event.button === 2 && drawnPoints.length > 2) { 

        // Create a polygon mesh using the drawn points
        let shape = BABYLON.MeshBuilder.CreatePolygon(
          "shape",
          { shape: drawnPoints },
          sceneD
        );
        shape.convertToFlatShadedMesh();
        sharedState.selectedPolygon = shape;
      } else if (event.button === 2 && drawnPoints.length <= 2) {
        showPrompt("Alert", "Draw atleast 3 points to finish a shape");
      }
      break;
    case "extrude":
      // Extrude mode pointer up logic
      break;
    case "move":
      // Move mode pointer up logic
      let pickedMeshes = sharedState.modeSpecificVariables.move.pickedMeshes;
      pickedMeshes.length = 0;
      break;
    case "vertexEdit":
        sharedState.modeSpecificVariables.vertexEdit.isDragging = false;
      break;
        
  }
};

const pointerMove = (event) => {
  // Pointer move logic for all modes
  switch (sharedState.currentMode) {
    case "draw":
      // Draw mode pointer move logic
      break;
    case "extrude":
      // Extrude mode pointer move logic
      break;
    case "move":
      // Move mode pointer move logic
      const scene = sharedState.modeSpecificVariables.move.scene;
      const ground = sharedState.modeSpecificVariables.move.ground;
      const pickedMeshes = sharedState.modeSpecificVariables.move.pickedMeshes;

      if (pickedMeshes.length > 0) {
        const pickInfo = scene.pick(
          scene.pointerX,
          scene.pointerY,
          (mesh) => mesh === ground
        );

        if (pickInfo.hit) {
          // Move the picked meshes along the ground plane
          const newPosition = pickInfo.pickedPoint.clone();
          for (let i = 0; i < pickedMeshes.length; i++) {
            pickedMeshes[i].position.x = newPosition.x;
            pickedMeshes[i].position.z = newPosition.z;
          }
        }
      }
      break;
    case "vertexEdit":
      const sceneVE = sharedState.modeSpecificVariables.vertexEdit.scene;
      const groundVE = sharedState.modeSpecificVariables.vertexEdit.ground;
        const isDragging = sharedState.modeSpecificVariables.vertexEdit.isDragging;

        
        
        if (isDragging) {
            const pickInfoVE = sceneVE.pick(sceneVE.pointerX, sceneVE.pointerY);
            if (pickInfoVE.hit && pickInfoVE.pickedMesh !== groundVE) {
            let selectedMesh = pickInfoVE.pickedMesh;
            sharedState.selectedMesh = selectedMesh;
    
    
            const selectedVertexIndex =  findClosestVertexIndex(
                selectedMesh,
                pickInfoVE.pickedPoint,
                sharedState.modeSpecificVariables.vertexEdit.vertices
              );
            const pickResult = sceneVE.pick(sceneVE.pointerX, sceneVE.pointerY);
            if (pickResult.hit && pickResult.pickedMesh === selectedMesh) {
                const newPosition = pickResult.pickedPoint;
                //moveSelectedVertex(newPosition, selectedVertexIndex, selectedMesh);
            }
            }
        };
      break;
  }
};

export { pointerDown, pointerUp, pointerMove };