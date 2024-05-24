const { App } = require("@slack/bolt");

function humanReadableDiff(date1, date2) {
    date1 = new Date(date1)
    date2 = new Date(date2)
    var seconds = Math.floor((date2 - date1) / 1000);
    var prefix = seconds < 0 ? " from now" : " ago";
    seconds = Math.abs(seconds);

    var interval = Math.floor(seconds / 31536000);
    var timeStr = "";
    if (interval >= 1) {
        timeStr += interval + " year" + (interval > 1 ? "s" : "");
        seconds %= 31536000;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        timeStr += (timeStr ? ", " : "") + interval + " month" + (interval > 1 ? "s" : "");
        seconds %= 2592000;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        timeStr += (timeStr ? ", " : "") + interval + " day" + (interval > 1 ? "s" : "");
        seconds %= 86400;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        timeStr += (timeStr ? ", " : "") + interval + " hour" + (interval > 1 ? "s" : "");
        seconds %= 3600;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        timeStr += (timeStr ? ", " : "") + interval + " minute" + (interval > 1 ? "s" : "");
        seconds %= 60;
    }
    if (seconds > 0) {
        timeStr += (timeStr ? ", " : "") + seconds + " second" + (seconds > 1 ? "s" : "");
    }
    return timeStr + prefix;
}

module.exports = { humanReadableDiff }