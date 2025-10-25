console.log('Utils script loaded (no conversion example)');

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date);
}

window.formatDate = formatDate;
