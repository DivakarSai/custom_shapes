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
    }
};

const pointerUp = (event) => {
    // Pointer up logic for drawing mode and other modes
    switch (sharedState.currentMode) {
        case 'draw':
            // Draw mode pointer up logic
            let drawnPoints = sharedState.drawnPoints
            const scene = sharedState.modeSpecificVariables.draw.scene;
            if (event.button === 2 && drawnPoints.length > 2) {
                console.log("draw point: ", drawnPoints);
                // Right-click to complete the shape (assuming at least 3 points)
                // Create a polygon mesh using the drawn points
                const shape = BABYLON.MeshBuilder.CreatePolygon("shape", { shape: drawnPoints }, scene);
                console.log("shape: ", shape);
                shape.convertToFlatShadedMesh(); // Optional: Improve visual appearance
                // drawnPoints = []; // Clear points after creating the shape
            }
            break;
        case 'extrude':
            // Extrude mode pointer up logic
            break;
    }
};

export { pointerDown, pointerUp };