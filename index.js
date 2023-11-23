
const canvas = document.getElementById("renderCanvas");
const drawButton = document.getElementById("drawButton");
const extrudeButton = document.getElementById("extrudeButton");
const moveButton = document.getElementById("moveButton");
const vertexEditButton = document.getElementById("vertexEditButton");

let scene, engine, currentMode, drawnPoints = [];

// Babylon.js Scene Initialization
const createScene = () => {
    scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    return scene;
};

// Function to handle drawing mode
const enterDrawMode = () => {


    currentMode = "draw";
    // Logic for drawing mode
    // Implement mouse interactions to draw 2D shapes
    // Store drawn points in 'drawnPoints' array
    currentMode = "draw";
    drawnPoints = []; // Clear previously drawn points

    const ground = scene.getMeshByName("ground");

    const pointerDown = (event) => {
        if (event.button !== 0) return; 
        
        // Check for left mouse click
        const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground);
        if (pickInfo.hit) {
            const hitPoint = pickInfo.pickedPoint;
            drawnPoints.push(hitPoint.clone()); // Store the clicked point
            // Visual cue: Adding a marker or shape at the clicked point
            // creating a small sphere to mark the point:
            const marker = BABYLON.MeshBuilder.CreateSphere("marker", { diameter: 0.1 }, scene);
            marker.position = hitPoint;
        }
    };

    const pointerUp = (event) => {
        if (event.button === 2 && drawnPoints.length > 2) {
            // Right-click to complete the shape (assuming at least 3 points)
            // Create a polygon mesh using the drawn points
            
            const shape = BABYLON.MeshBuilder.CreatePolygon("shape", { shape: drawnPoints }, scene);
            console.log(shape);
            shape.convertToFlatShadedMesh(); // Optional: Improve visual appearance
            drawnPoints = []; // Clear points after creating the shape
        }
    };

    // Event listeners for pointer events
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointerup", pointerUp);
};

// Function to handle extrusion process
const extrudeShape = () => {
    // Logic for extruding the drawn shape
    // Use 'drawnPoints' to create a 3D object with fixed height
    if (drawnPoints.length < 3) {
        console.error("Insufficient points to extrude. Please draw a complete shape first.");
        return;
    }

    const path = [];
    for (let i = 0; i < drawnPoints.length; i++) {
        path.push(new BABYLON.Vector3(drawnPoints[i].x, drawnPoints[i].y, 0)); // Create a path from the 2D points
    }

    const shape = BABYLON.MeshBuilder.ExtrudePolygon("extrudedShape", { shape: path, depth: 1 }, scene);
    // 'depth' parameter controls the extrusion height, adjust as needed

    // Optionally, perform additional operations or set properties for the extruded shape

    drawnPoints = []; // Clear drawn points after extrusion

};

// Function to handle moving objects mode
const enterMoveMode = () => {
    currentMode = "move";
    // Logic for moving objects
    // Implement click-and-drag functionality to move extruded objects
    currentMode = "move";

    const ground = scene.getMeshByName("ground");
    const pickedMeshes = [];

    const pointerDown = (event) => {
        const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
        if (pickInfo.hit && pickInfo.pickedMesh !== ground) {
            // Check if the picked mesh is not the ground
            pickedMeshes.push(pickInfo.pickedMesh);
        }
    };

    const pointerMove = (event) => {
        if (pickedMeshes.length > 0) {
            const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground);
            if (pickInfo.hit) {
                // Move the picked meshes along the ground plane
                const newPosition = pickInfo.pickedPoint.clone();
                for (let i = 0; i < pickedMeshes.length; i++) {
                    pickedMeshes[i].position.x = newPosition.x;
                    pickedMeshes[i].position.z = newPosition.z;
                }
            }
        }
    };

    const pointerUp = (event) => {
        pickedMeshes.length = 0; // Clear the picked meshes array
    };

    // Event listeners for pointer events
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
};

// Function to handle vertex editing mode
const enterVertexEditMode = () => {
    currentMode = "vertexEdit";
    // Logic for vertex editing
    // Allow users to select vertices and move them using mouse interactions
    currentMode = "vertexEdit";

    const ground = scene.getMeshByName("ground");
    let selectedVertex = null;
    let selectedMesh = null;

    const pointerDown = (event) => {
        const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
        if (pickInfo.hit && pickInfo.pickedMesh !== ground) {
            // Check if the picked mesh is not the ground
            selectedMesh = pickInfo.pickedMesh;
            // Logic to identify the clicked vertex on the selected mesh
            // For example, find the closest vertex to the picked point:
            selectedVertex = findClosestVertex(selectedMesh, pickInfo.pickedPoint);
            if (selectedVertex !== null) {
                // Perform vertex selection visual feedback
                // For example, change color or scale of the selected vertex
            }
        }
    };

    const pointerMove = (event) => {
        if (selectedVertex !== null) {
            // Logic to update the position of the selected vertex based on pointer movement
            // For example, move the selected vertex to the new pointer position
        }
    };

    const pointerUp = (event) => {
        // Clear the selected vertex and mesh when the pointer is released
        selectedVertex = null;
        selectedMesh = null;
    };

    // Event listeners for pointer events
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
};

// Function to find the closest vertex to a given point on a mesh
const findClosestVertex = (mesh, point) => {
    // Logic to find the closest vertex to the given point on the mesh
    // For example, iterate through mesh vertices and find the nearest one to the point
    // Return the index or reference to the closest vertex
    // You might use vector calculations or mesh methods for vertex manipulation
    let closestVertexIndex = null;
    let minDistance = Number.MAX_VALUE;

    if (!mesh || !point || !mesh.getVerticesData || !mesh.getTotalVertices()) {
        return closestVertexIndex;
    }

    const vertices = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    for (let i = 0; i < mesh.getTotalVertices(); i += 3) {
        const vertex = new BABYLON.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        const distance = BABYLON.Vector3.DistanceSquared(vertex, point);

        if (distance < minDistance) {
            minDistance = distance;
            closestVertexIndex = i / 3; // Index of the closest vertex
        }
    }

    return closestVertexIndex;

};

// Event listeners for mode buttons
drawButton.addEventListener("click", enterDrawMode);
extrudeButton.addEventListener("click", extrudeShape);
moveButton.addEventListener("click", enterMoveMode);
vertexEditButton.addEventListener("click", enterVertexEditMode);

// Babylon.js Engine Initialization
window.addEventListener("DOMContentLoaded", () => {
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => {
        engine.resize();
    });
});
