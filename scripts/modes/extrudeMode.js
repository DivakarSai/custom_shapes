import sharedState from '../sharedState.js';

const enterExtrudeMode = () => {
    // Logic for extruding the drawn shape
    let drawnPoints = sharedState.drawnPoints;
    let path = [];
    const fixed_depth = 1.2;
    const scene = sharedState.modeSpecificVariables.draw.scene;
    console.log("Extrude event begins");
    // console.log("drawnPoints: ", drawnPoints);
  
    if (drawnPoints.length < 3) {
      console.error(
        "Insufficient points to extrude. Please draw a complete shape first."
      );
      return;
    }
  
    for (let i = 0; i < drawnPoints.length; i++) {
      path.push(new BABYLON.Vector3(drawnPoints[i].x, drawnPoints[i].y, 0)); // Create a path from the 2D points
    }
    
    const shape = BABYLON.MeshBuilder.ExtrudePolygon("extrudedShape",{ shape: drawnPoints, depth: fixed_depth },scene);
    shape.position.y += fixed_depth;
    // 'depth' parameter controls the extrusion height, adjust as needed
  
    // Optionally, perform additional operations or set properties for the extruded shape
  
    // drawnPoints = []; // Clear drawn points after extrusion
    
  };

  const exitExtrudeMode = () => {
    console.log("Extrude event ends");
  }

  export { enterExtrudeMode, exitExtrudeMode };