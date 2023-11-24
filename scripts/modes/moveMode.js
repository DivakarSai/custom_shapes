import sharedState from "../sharedState.js";

// Function to handle moving objects mode
const enterMoveMode = (scene,canvas) => {
    sharedState.currentMode = "move";
    console.log("move event starts");
    // Logic for moving objects
    // Implement click-and-drag functionality to move extruded objects
  
  //   camera.inputs.clear();
  
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
        const pickInfo = scene.pick(
          scene.pointerX,
          scene.pointerY,
          (mesh) => mesh === ground
        );
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
  
    console.log("move event ends");
  };

  export {enterMoveMode};