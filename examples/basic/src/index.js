console.log('Main entry point loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded event fired');
    
    const button = document.getElementById('testButton');
    const output = document.getElementById('output');
    
    if (button && output) {
        button.addEventListener('click', function() {
            output.innerHTML = '<p>Button clicked! Resources are now loading...</p>';
        });
    }
});
