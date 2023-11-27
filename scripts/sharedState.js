const sharedState = {
    currentMode: "none",
    drawnPoints: [],
    drawnMarkers: [],
    selectedMesh: null,
    selectedVertex: null,
    selectedPolygon: null,
    modeSpecificVariables: {
      draw: {
        scene: null,
        ground: null,
      },
      extrude: {
        scene: null,
        ground: null,
      },
      move: {
        scene: null,
        ground: null,
        pickedMeshes: [],
      },
      vertexEdit: {
        scene: null,
        ground: null,
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