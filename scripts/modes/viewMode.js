import sharedState from "../sharedState.js";

const enterViewMode = () => {
    sharedState.currentMode = "view";
    console.log("view event starts");
    };

const exitViewMode = () => {
    console.log("view event ends");
    };

export {enterViewMode, exitViewMode};







