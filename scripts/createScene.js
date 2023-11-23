// Babylon JS scene creation
export const createScene = (engine, canvas) => {
    let scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
    groundMaterial.diffuseColor = BABYLON.Color3.Red();
    ground.material = groundMaterial;

    return {
        "scene": scene,
        "camera": camera
    }
};
