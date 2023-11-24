const sharedState = {
    currentMode: 'none',
    drawnPoints: [],
    selectedMesh: null,
    selectedVertex: null,
    modeSpecificVariables: {
        draw: {
            scene: null, 
            ground: null,
        },
        extrude: {
            scene: null, 
            ground: null,
        },
    },
    cameraSpec: {
        alpha: null,
        beta: null,
        radius: null,
        target: null,
    }
};

export default sharedState;