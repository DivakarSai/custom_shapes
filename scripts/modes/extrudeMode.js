import sharedState from '../sharedState.js';
import { showPrompt } from '../components/prompt.js';

const enterExtrudeMode = () => {
    // Logic for extruding the drawn shape
    let drawnPoints = sharedState.drawnPoints;
    let path = [];
    const fixed_depth = 1.2;
    const scene = sharedState.scene;
  
    if (drawnPoints.length < 3) {
      showPrompt("Alert", 'Draw atleast 3 points to extrude a shape');
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

    if(sharedState.selectedPolygon != null)sharedState.selectedPolygon.dispose(); // removes the polygon created in drawMode from memory
    
  };

  const exitExtrudeMode = () => {
  }

  export { enterExtrudeMode, exitExtrudeMode };