const sharedState = {
    currentMode: 'none',
    drawnPoints: [],
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
    },
    camera : [],
    cameraSpecs: {
        alpha: null,
        beta: null,
        radius: null,
        target: null,
    }
};

export default sharedState;