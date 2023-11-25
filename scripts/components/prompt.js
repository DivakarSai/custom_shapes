const hidePrompt = document.getElementById("hidePrompt");
hidePrompt.addEventListener("click", () => {
    document.getElementById('overlay').style.display = 'none';
});

function showPrompt(title, message) {
    var overlay = document.getElementById('overlay');
    var titleElement = document.getElementById('promptTitle');
    var messageElement = document.getElementById('promptMessage');
  
    titleElement.textContent = title || 'Welcome!';
    messageElement.textContent = message || 'This is a prompt component.';
  
    overlay.style.display = 'flex';
  }
  
  export {showPrompt};