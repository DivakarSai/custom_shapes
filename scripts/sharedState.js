const sharedState = {
    currentMode: "none",
    drawnPoints: [],
    scene: null,
    selectedMesh: null,
    selectedVertex: null,
    selectedPolygon: null,
    modeSpecificVariables: {
      move: {
        pickedMeshes: [],
      },
      vertexEdit: {
        vertices: [],
        selectedVertex: null,
        selectedMesh: null,
        selectedVertexIndex: 3,
        isDragging:0,
      },
    },
    camera: [],
    cameraSpecs: {
      alpha: null,
      beta: null,
      radius: null,
      target: null,
    },
  };
  
  export default sharedState;