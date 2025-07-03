// Insta Bulk Unlike Extension - Production Content Script
(function() {
    'use strict';

    if (window.instaBulkUnlikeLoaded) {
        return;
    }
    window.instaBulkUnlikeLoaded = true;

    let isProcessing = false;
    let shouldStop = false;
    let currentBatch = 0;
    let totalBatches = 0;
    let totalProcessed = 0;
    let settings = {
        batchSize: 5,
        selectionDelay: 3000,
        batchDelay: 10000
    };

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
            if (message.action === 'ping') {
                sendResponse({
                    status: 'ready',
                    timestamp: Date.now(),
                             url: window.location.href,
                             loaded: true
                });
                return true;
            }
            if (message.action === 'startUnlike') {
                if (message.settings) {
                    settings = { ...settings, ...message.settings };
                }
                startUnlikeProcess(message.count);
                sendResponse({ status: 'started' });
                return true;
            }
            if (message.action === 'stopUnlike') {
                stopUnlikeProcess();
                sendResponse({ status: 'stopping' });
                return true;
            }
        } catch (error) {
            sendResponse({ status: 'error', error: error.message });
        }
        return true;
    });

    function sendProgressUpdate(text, details = '', percentage = 0) {
        try {
            chrome.runtime.sendMessage({
                action: 'updateProgress',
                data: { text, details, percentage }
            }).catch(() => {});
        } catch (error) {}
    }

    function sendProcessComplete(count) {
        try {
            chrome.runtime.sendMessage({
                action: 'processComplete',
                data: { count }
            }).catch(() => {});
        } catch (error) {}
    }

    function sendProcessError(error) {
        try {
            chrome.runtime.sendMessage({
                action: 'processError',
                data: { error }
            }).catch(() => {});
        } catch (err) {}
    }

    function testDOMAccess() {
        try {
            const wbloks = document.querySelectorAll('div.wbloks_1');
            return wbloks.length > 0;
        } catch (error) {
            return false;
        }
    }

    function isSelectionModeActive() {
        try {
            const allDivs = Array.from(document.querySelectorAll('div.wbloks_1'));
            const buttonTexts = allDivs.map(div => div.textContent.trim().toLowerCase());
            const indicators = [
                buttonTexts.includes('cancel'),
 buttonTexts.includes('done'),
 buttonTexts.includes('select all'),
 document.querySelectorAll('div.wbloks_1[aria-label="Image with button"]').length > 0
            ];
            const isActive = indicators.some(indicator => indicator);
            return isActive;
        } catch (error) {
            return false;
        }
    }

    function findSelectablePosts() {
        try {
            const posts = document.querySelectorAll('div.wbloks_1[aria-label="Image with button"]');
            const filtered = Array.from(posts).filter(post => {
                const rect = post.getBoundingClientRect();
                return rect.width > 100 && rect.height > 100;
            });
            return filtered;
        } catch (error) {
            return [];
        }
    }

    async function ensureSelectionMode() {
        if (isSelectionModeActive()) {
            return true;
        }
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Entering selection mode...`,
            'Activating selection interface'
        );
        const wbloksSelects = document.querySelectorAll('div.wbloks_1');
        for (let div of wbloksSelects) {
            const text = div.textContent.trim().toLowerCase();
            if (text === 'select') {
                div.click();
                for (let attempt = 0; attempt < 5; attempt++) {
                    await sleep(1000);
                    if (isSelectionModeActive()) {
                        return true;
                    }
                }
                break;
            }
        }
        throw new Error('Could not activate selection mode');
    }

    async function clickPosts(posts, maxCount) {
        const postsToClick = Math.min(maxCount, posts.length);
        let clicked = 0;
        for (let i = 0; i < postsToClick; i++) {
            if (shouldStop) break;
            try {
                posts[i].click();
                clicked++;
                sendProgressUpdate(
                    `Batch ${currentBatch}/${totalBatches}: Selecting posts...`,
                    `Selected ${clicked}/${postsToClick} posts in current batch`,
                    ((currentBatch - 1) / totalBatches) * 100 + (clicked / postsToClick) * (100 / totalBatches) * 0.5
                );
                if (i < postsToClick - 1) {
                    const delay = settings.selectionDelay + Math.random() * 1000;
                    await sleep(delay);
                }
            } catch (error) {}
        }
        return clicked;
    }

    async function clickUnlikeButton() {
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Looking for Unlike button...`,
            'Processing unlike request',
            ((currentBatch - 1) / totalBatches) * 100 + 50
        );
        await sleep(3000);
        for (let attempt = 1; attempt <= 3; attempt++) {
            const buttonSelectors = [
                'button',
                '[role="button"]',
                'div[role="button"]',
                'div.wbloks_1'
            ];
            let allButtons = [];
            buttonSelectors.forEach(selector => {
                const buttons = document.querySelectorAll(selector);
                allButtons.push(...Array.from(buttons));
            });
            for (let btn of allButtons) {
                const text = btn.textContent.trim().toLowerCase();
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                const pointerEvents = window.getComputedStyle(btn).pointerEvents;
                const isVisible = btn.getBoundingClientRect().width > 0;
                if ((text === 'unlike' || ariaLabel === 'unlike') &&
                    pointerEvents !== 'none' &&
                    isVisible) {
                    btn.click();
                sendProgressUpdate(
                    `Batch ${currentBatch}/${totalBatches}: Unlike button clicked`,
                    'Waiting for confirmation...',
                    ((currentBatch - 1) / totalBatches) * 100 + 70
                );
                await sleep(3000);
                return true;
                    }
            }
            await sleep(1000);
        }
        throw new Error('Unlike button not found');
    }

    async function handleConfirmation() {
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Confirming unlike...`,
            'Processing confirmation',
            ((currentBatch - 1) / totalBatches) * 100 + 80
        );
        await sleep(2000);
        for (let attempt = 1; attempt <= 5; attempt++) {
            const confirmButtonSelectors = [
                'button._a9--._ap36._a9_1',
                'button._a9--',
                'button',
                '[role="button"]'
            ];
            let confirmButtons = [];
            confirmButtonSelectors.forEach(selector => {
                const buttons = document.querySelectorAll(selector);
                confirmButtons.push(...Array.from(buttons));
            });
            for (let btn of confirmButtons) {
                const innerDiv = btn.querySelector('div._ap3a._aacp._aacw._aac-._aad6, div[dir="auto"]');
                const text = (innerDiv ? innerDiv.textContent.trim() : btn.textContent.trim()).toLowerCase();
                const isVisible = btn.getBoundingClientRect().width > 0;
                const isClickable = !btn.disabled && window.getComputedStyle(btn).pointerEvents !== 'none';
                if (text === 'unlike' && isClickable && isVisible) {
                    btn.click();
                    sendProgressUpdate(
                        `Batch ${currentBatch}/${totalBatches}: Batch completed!`,
                        'Moving to next batch...',
                        (currentBatch / totalBatches) * 100
                    );
                    await sleep(3000);
                    return true;
                }
            }
            await sleep(1000);
        }
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Batch completed!`,
            'Moving to next batch...',
            (currentBatch / totalBatches) * 100
        );
        return true;
    }

    async function processBatch(totalCount) {
        totalProcessed = 0;
        currentBatch = 0;
        totalBatches = Math.ceil(totalCount / settings.batchSize);
        while (totalProcessed < totalCount && !shouldStop) {
            currentBatch++;
            const remainingCount = totalCount - totalProcessed;
            const currentBatchSize = Math.min(settings.batchSize, remainingCount);
            sendProgressUpdate(
                `Processing batch ${currentBatch}/${totalBatches}...`,
                `${currentBatchSize} posts in this batch`,
                ((currentBatch - 1) / totalBatches) * 100
            );
            try {
                await ensureSelectionMode();
                await sleep(2000);
                const selectablePosts = findSelectablePosts();
                if (selectablePosts.length === 0) {
                    sendProgressUpdate('No more posts available', 'Process completed - no more posts to unlike');
                    break;
                }
                const selected = await clickPosts(selectablePosts, currentBatchSize);
                if (selected > 0) {
                    await clickUnlikeButton();
                    await handleConfirmation();
                    totalProcessed += selected;
                    if (totalProcessed < totalCount && !shouldStop) {
                        sendProgressUpdate(
                            `Batch ${currentBatch} complete!`,
                            `Total processed: ${totalProcessed}/${totalCount}. Waiting before next batch...`,
                            (currentBatch / totalBatches) * 100
                        );
                        const delay = settings.batchDelay + Math.random() * 2000;
                        await sleep(delay);
                    }
                } else {
                    sendProgressUpdate('No posts could be selected', 'Stopping process - no selectable posts found');
                    break;
                }
            } catch (error) {
                throw error;
            }
        }
        return totalProcessed;
    }

    async function startUnlikeProcess(totalCount) {
        if (isProcessing) {
            return;
        }
        isProcessing = true;
        shouldStop = false;
        try {
            sendProgressUpdate('Starting unlike process...', 'Initializing with custom settings', 0);
            const hasAccess = testDOMAccess();
            if (!hasAccess) {
                throw new Error('Cannot access Instagram elements');
            }
            const processedCount = await processBatch(totalCount);
            if (shouldStop) {
                sendProcessError(`Process stopped. Processed ${processedCount} posts.`);
            } else {
                sendProcessComplete(processedCount);
            }
        } catch (error) {
            sendProcessError(error.message);
        } finally {
            isProcessing = false;
        }
    }

    function stopUnlikeProcess() {
        shouldStop = true;
        sendProgressUpdate('Stopping process...', 'Please wait for current operation to finish');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function initialize() {
        setTimeout(() => {
            testDOMAccess();
            if (window.location.href.includes('/your_activity/interactions/likes/')) {
                setTimeout(() => {
                    findSelectablePosts();
                    isSelectionModeActive();
                }, 3000);
            }
        }, 2000);
    }

    initialize();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initialize, 1000);
        }
    }).observe(document, {subtree: true, childList: true});
})();
