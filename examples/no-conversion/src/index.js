console.log('Main entry point loaded (no conversion example)');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded event fired');
    
    const button = document.getElementById('testButton');
    const output = document.getElementById('output');
    
    if (button && output) {
        button.addEventListener('click', function() {
            output.innerHTML = '<p>Button clicked! Lazy loading script is active but src attributes are unchanged.</p>';
        });
    }
});
