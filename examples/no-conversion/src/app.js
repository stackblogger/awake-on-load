console.log('App script loaded (no conversion example)');

function showMessage(message) {
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML += `<p>${message}</p>`;
    }
}

window.showMessage = showMessage;
