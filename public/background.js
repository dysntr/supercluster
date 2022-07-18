/*global chrome*/
// import { Client } from "@xmtp/xmtp-js";

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        //call a function to handle a first install
    } else if (details.reason == "update") {
        //call a function to handle an update
    }
    chrome.alarms.create("myAlarm", { delayInMinutes: 0.1, periodInMinutes: 0.01666666 });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log("Beep");
    });
});
