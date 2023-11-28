const sharedState = {
    currentMode: "none",
    drawnPoints: [],
    drawnMarkers: [],
    vertices: [],
    indices: [],
    repeatedVertices: [],
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
        newPositions: [],
        selectedVertex: null,
        selectedMesh: null,
        selectedVertexIndex: 3,
        isDragging:0,
        endPosition: null,
      },
    },
    camera: [],
  };
  
  export default sharedState;