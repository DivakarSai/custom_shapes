import sharedState from '../sharedState.js';
import { showPrompt } from '../components/prompt.js';

const enterExtrudeMode = () => {
    // Logic for extruding the drawn shape
    let drawnPoints = sharedState.drawnPoints;
    let path = [];
    const fixed_depth = 1.2;
    const scene = sharedState.modeSpecificVariables.draw.scene;
  
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
    shape.id = "extrudedShape";

    //store the vertices in the sharedState
    const positions =  shape.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    sharedState.vertices = [];
    for (let i = 0; i < positions.length; i += 3) {
      sharedState.vertices.push(positions[i]);
      sharedState.vertices.push(positions[i + 1]);
      sharedState.vertices.push(positions[i + 2]);
    }
    // store the indices in the sharedState
    sharedState.indices = shape.getIndices();

    // track repeated vertices
    let uniqueVertices = [];
    for(let i = 0; i < positions.length/3; i+=3){
      let vertex = new BABYLON.Vector3(positions[i],positions[i+1],positions[i+2]);
      uniqueVertices.push(vertex);
    }

    let indexes_list = [];
    for(let i=0;i<uniqueVertices.length;i++){
      indexes_list.push([i]);
    }

    for(let i = uniqueVertices.length*3; i < positions.length; i+=3){
      let vertex = new BABYLON.Vector3(positions[i],positions[i+1],positions[i+2]);
      let index = -1;

      for(let j = 0; j < uniqueVertices.length; j++){
        if(uniqueVertices[j].equals(vertex)){
          index = j;
          break;
        }
      }
      indexes_list[index].push(i/3);
    }
    sharedState.repeatedVertices = indexes_list;

    // Assuming 'positions' and 'indices' are your mesh's position and index data
    if(sharedState.selectedPolygon != null)sharedState.selectedPolygon.dispose(); // removes the polygon created in drawMode from memory
    
  };

  const exitExtrudeMode = () => {


  }

  export { enterExtrudeMode, exitExtrudeMode };