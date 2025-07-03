// Insta Bulk Unlike Extension - Background Script
chrome.runtime.onInstalled.addListener(() => {});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateProgress' ||
        message.action === 'processComplete' ||
        message.action === 'processError') {
        chrome.runtime.sendMessage(message).catch(() => {});
        }
        return true;
});

chrome.action.onClicked.addListener((tab) => {});
