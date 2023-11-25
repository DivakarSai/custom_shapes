import sharedState from "../sharedState.js";

const enterViewMode = () => {
    sharedState.currentMode = "view";
    };

const exitViewMode = () => {
    };
export {enterViewMode, exitViewMode};