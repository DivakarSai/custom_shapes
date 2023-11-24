import sharedState from "../sharedState.js";

const enterViewMode = () => {
    sharedState.currentMode = "view";
    console.log("view event starts");
    // Logic for viewing objects
    // Implement click-and-drag functionality to move extruded objects
    
    };

const exitViewMode = () => {
    // Cleanup for move mode
    
    // allow camera to move

    
    console.log("view event ends");
    };

export {enterViewMode, exitViewMode};



