// Insta Bulk Unlike Extension - Background Script
chrome.runtime.onInstalled.addListener(() => {
    console.log('Insta Bulk Unlike Extension installed');
});

// Handle messages between popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward messages between popup and content script
    if (message.action === 'updateProgress' ||
        message.action === 'processComplete' ||
        message.action === 'processError') {

        // Send to popup if it's open
        chrome.runtime.sendMessage(message).catch(() => {
            // Popup might be closed, ignore error
        });
        }

        return true;
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically
    // No additional action needed
});
