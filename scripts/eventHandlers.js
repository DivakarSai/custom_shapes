import sharedState from './sharedState.js';

const pointerDown = (event) => {
    // Pointer down logic for drawing mode and other modes
    switch (sharedState.currentMode) {
        case 'draw':
            // Draw mode pointer down logic
                if (event.button !== 0) return; // Check for left mouse click
                const ground = sharedState.modeSpecificVariables.draw.ground;
                const scene = sharedState.modeSpecificVariables.draw.scene;
                const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground);
                if (pickInfo.hit) {
                    const hitPoint = pickInfo.pickedPoint;
                    sharedState.drawnPoints.push(hitPoint.clone()); // Store the clicked point
                    // Visual cue: Add a marker or shape at the clicked point
                    // For example, create a small sphere to mark the point:
                    const marker = BABYLON.MeshBuilder.CreateSphere("marker", { diameter: 0.1 }, scene);
                    marker.position = hitPoint;
                }
            break;
        case 'extrude':
            // Extrude mode pointer down logic
            break;

        case 'move':
                // Move mode pointer down logic
                const scene1 = sharedState.modeSpecificVariables.move.scene;
                const ground1 = sharedState.modeSpecificVariables.move.ground;
                const pickedMeshes = sharedState.modeSpecificVariables.move.pickedMeshes;
                const pickInfo1 = scene1.pick(scene1.pointerX, scene1.pointerY);
                if (pickInfo1.hit && pickInfo1.pickedMesh !== ground1) {
                // Check if the picked mesh is not the ground
                pickedMeshes.push(pickInfo1.pickedMesh);
                console.log("picked mesh: ", pickInfo1.pickedMesh);
                }
                sharedState.modeSpecificVariables.move.pickedMeshes = pickedMeshes;
                
            break;

    }
    console.log("pointerDown: move", sharedState)
};

const pointerUp = (event) => {
    // Pointer up logic for drawing mode and other modes
    switch (sharedState.currentMode) {
        case 'draw':
            // Draw mode pointer up logic
            let drawnPoints = sharedState.drawnPoints
            const scene = sharedState.modeSpecificVariables.draw.scene;
            if (event.button === 2 && drawnPoints.length > 2) {
                // Right-click to complete the shape (assuming at least 3 points)
                // Create a polygon mesh using the drawn points
                let shape = BABYLON.MeshBuilder.CreatePolygon("shape", { shape: drawnPoints }, scene);
                console.log("points events: ", drawnPoints);
                shape.convertToFlatShadedMesh(); // Optional: Improve visual appearance
                sharedState.selectedPolygon = shape;
                // drawnPoints = []; // Clear points after creating the shape
            }
            break;
        case 'extrude':
            // Extrude mode pointer up logic
            break;
        case 'move':
            // Move mode pointer up logic
            console.log("pointeUp move before: ", sharedState.modeSpecificVariables.move.pickedMeshes);
            let pickedMeshes = sharedState.modeSpecificVariables.move.pickedMeshes;
            pickedMeshes.length = 0; 
            console.log("pointeUp move: ", sharedState);
            break;
    }
};


const pointerMove = (event) => {
    // Pointer move logic for drawing mode and other modes
    switch (sharedState.currentMode) {
        case 'draw':
            // Draw mode pointer move logic
            break;
        case 'extrude':
            // Extrude mode pointer move logic
            break;
        case 'move':
            // Move mode pointer move logic
            // console.log("pointerMove move: ", sharedState);
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
    }
}

export { pointerDown, pointerUp, pointerMove };