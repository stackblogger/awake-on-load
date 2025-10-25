console.log('Utils script loaded');

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date);
}

window.formatDate = formatDate;
