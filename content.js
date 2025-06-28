// Insta Bulk Unlike Extension - Complete Working Version
(function() {
    'use strict';

    // Prevent multiple injections
    if (window.instaBulkUnlikeLoaded) {
        console.log('⚠️ Insta Bulk Unlike already loaded, skipping...');
        return;
    }
    window.instaBulkUnlikeLoaded = true;

    console.log('🚀 Insta Bulk Unlike Extension loading...');
    console.log('📍 URL:', window.location.href);
    console.log('⏰ Time:', new Date().toISOString());

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

    // Enhanced message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('📨 Message received:', message.action);

        try {
            if (message.action === 'ping') {
                console.log('🏓 Ping! Responding with ready status');
                sendResponse({
                    status: 'ready',
                    timestamp: Date.now(),
                             url: window.location.href,
                             loaded: true
                });
                return true;
            }

            if (message.action === 'startUnlike') {
                console.log('▶️ Starting unlike process:', message.count);
                if (message.settings) {
                    settings = { ...settings, ...message.settings };
                    console.log('⚙️ Using settings:', settings);
                }
                startUnlikeProcess(message.count);
                sendResponse({ status: 'started' });
                return true;
            }

            if (message.action === 'stopUnlike') {
                console.log('⏹️ Stopping process');
                stopUnlikeProcess();
                sendResponse({ status: 'stopping' });
                return true;
            }

        } catch (error) {
            console.error('❌ Error in message handler:', error);
            sendResponse({ status: 'error', error: error.message });
        }

        return true;
    });

    // Send messages with error handling
    function sendProgressUpdate(text, details = '', percentage = 0) {
        console.log(`📊 Progress: ${text} (${percentage}%)`);
        try {
            chrome.runtime.sendMessage({
                action: 'updateProgress',
                data: { text, details, percentage }
            }).catch(err => console.warn('⚠️ Progress update failed:', err));
        } catch (error) {
            console.error('❌ Error sending progress:', error);
        }
    }

    function sendProcessComplete(count) {
        console.log(`✅ Process complete! Count: ${count}`);
        try {
            chrome.runtime.sendMessage({
                action: 'processComplete',
                data: { count }
            }).catch(err => console.warn('⚠️ Complete message failed:', err));
        } catch (error) {
            console.error('❌ Error sending completion:', error);
        }
    }

    function sendProcessError(error) {
        console.log(`❌ Process error: ${error}`);
        try {
            chrome.runtime.sendMessage({
                action: 'processError',
                data: { error }
            }).catch(err => console.warn('⚠️ Error message failed:', err));
        } catch (err) {
            console.error('❌ Error sending error:', err);
        }
    }

    // Enhanced DOM access functions
    function testDOMAccess() {
        console.log('🧪 Testing DOM access...');
        try {
            const wbloks = document.querySelectorAll('div.wbloks_1');
            const buttons = document.querySelectorAll('button');
            const allButtons = document.querySelectorAll('button, [role="button"], div[role="button"]');
            const divs = document.querySelectorAll('div');

            console.log(`📦 Found ${wbloks.length} wbloks_1 elements`);
            console.log(`🔘 Found ${buttons.length} buttons`);
            console.log(`🔘 Found ${allButtons.length} total clickable elements`);
            console.log(`📄 Found ${divs.length} div elements`);

            // Check for Instagram-specific elements
            const main = document.querySelector('[role="main"]');
            const articles = document.querySelectorAll('article');
            console.log(`🏠 Main element:`, !!main);
            console.log(`📰 Articles found:`, articles.length);

            return wbloks.length > 0;
        } catch (error) {
            console.error('❌ DOM access error:', error);
            return false;
        }
    }

    // Check if we're in selection mode
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
            console.log('🔍 Selection mode active:', isActive, 'indicators:', indicators);
            return isActive;
        } catch (error) {
            console.error('❌ Error checking selection mode:', error);
            return false;
        }
    }

    // Find posts that can be selected
    function findSelectablePosts() {
        try {
            const posts = document.querySelectorAll('div.wbloks_1[aria-label="Image with button"]');
            const filtered = Array.from(posts).filter(post => {
                const rect = post.getBoundingClientRect();
                return rect.width > 100 && rect.height > 100;
            });
            console.log(`📋 Found ${filtered.length} selectable posts out of ${posts.length} total`);
            return filtered;
        } catch (error) {
            console.error('❌ Error finding posts:', error);
            return [];
        }
    }

    // Enter selection mode if not already active
    async function ensureSelectionMode() {
        if (isSelectionModeActive()) {
            console.log('✅ Already in selection mode');
            return true;
        }

        console.log('🔄 Entering selection mode...');
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Entering selection mode...`,
            'Activating selection interface'
        );

        const wbloksSelects = document.querySelectorAll('div.wbloks_1');
        console.log(`🔍 Found ${wbloksSelects.length} potential select buttons`);

        for (let div of wbloksSelects) {
            const text = div.textContent.trim().toLowerCase();
            console.log(`🔍 Checking div with text: "${text}"`);
            if (text === 'select') {
                console.log('✅ Found and clicking Select button');
                div.click();

                // Wait for selection mode to activate
                for (let attempt = 0; attempt < 5; attempt++) {
                    await sleep(1000);
                    if (isSelectionModeActive()) {
                        console.log('✅ Selection mode activated');
                        return true;
                    }
                    console.log(`⏳ Waiting for selection mode... attempt ${attempt + 1}/5`);
                }
                break;
            }
        }

        throw new Error('Could not activate selection mode');
    }

    // Click multiple posts with delay
    async function clickPosts(posts, maxCount) {
        const postsToClick = Math.min(maxCount, posts.length);
        let clicked = 0;

        console.log(`👆 Clicking ${postsToClick} posts...`);

        for (let i = 0; i < postsToClick; i++) {
            if (shouldStop) break;

            try {
                posts[i].click();
                clicked++;
                console.log(`✅ Clicked post ${clicked}/${postsToClick}`);

                sendProgressUpdate(
                    `Batch ${currentBatch}/${totalBatches}: Selecting posts...`,
                    `Selected ${clicked}/${postsToClick} posts in current batch`,
                    ((currentBatch - 1) / totalBatches) * 100 + (clicked / postsToClick) * (100 / totalBatches) * 0.5
                );

                if (i < postsToClick - 1) {
                    const delay = settings.selectionDelay + Math.random() * 1000;
                    console.log(`⏱️ Waiting ${delay}ms before next post`);
                    await sleep(delay);
                }
            } catch (error) {
                console.error('❌ Error clicking post:', error);
            }
        }

        return clicked;
    }

    // Find and click the Unlike button
    async function clickUnlikeButton() {
        console.log('🔍 Looking for Unlike button...');
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Looking for Unlike button...`,
            'Processing unlike request',
            ((currentBatch - 1) / totalBatches) * 100 + 50
        );

        await sleep(3000);

        for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`🔍 Unlike button search attempt ${attempt}/3`);

            // Look for all possible button selectors
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

            console.log(`🔍 Found ${allButtons.length} potential buttons to check`);

            for (let btn of allButtons) {
                const text = btn.textContent.trim().toLowerCase();
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                const pointerEvents = window.getComputedStyle(btn).pointerEvents;
                const isVisible = btn.getBoundingClientRect().width > 0;

                // Check for Unlike button
                if ((text === 'unlike' || ariaLabel === 'unlike') &&
                    pointerEvents !== 'none' &&
                    isVisible) {

                    console.log('✅ Found and clicking Unlike button');
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

    // Handle confirmation dialog
    async function handleConfirmation() {
        console.log('🔍 Looking for confirmation dialog...');
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Confirming unlike...`,
            'Processing confirmation',
            ((currentBatch - 1) / totalBatches) * 100 + 80
        );

        await sleep(2000);

        for (let attempt = 1; attempt <= 5; attempt++) {
            console.log(`🔍 Confirmation attempt ${attempt}/5`);

            // Look for confirmation buttons with various selectors
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

            console.log(`🔍 Found ${confirmButtons.length} potential confirmation buttons`);

            for (let btn of confirmButtons) {
                const innerDiv = btn.querySelector('div._ap3a._aacp._aacw._aac-._aad6, div[dir="auto"]');
                const text = (innerDiv ? innerDiv.textContent.trim() : btn.textContent.trim()).toLowerCase();
                const isVisible = btn.getBoundingClientRect().width > 0;
                const isClickable = !btn.disabled && window.getComputedStyle(btn).pointerEvents !== 'none';

                if (text === 'unlike' && isClickable && isVisible) {
                    console.log('✅ Found and clicking confirmation button');
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

        console.log('⚠️ No confirmation found - may have auto-processed');
        sendProgressUpdate(
            `Batch ${currentBatch}/${totalBatches}: Batch completed!`,
            'Moving to next batch...',
            (currentBatch / totalBatches) * 100
        );
        return true;
    }

    // Process posts in batches
    async function processBatch(totalCount) {
        console.log(`🚀 Starting batch processing for ${totalCount} posts`);
        totalProcessed = 0;
        currentBatch = 0;
        totalBatches = Math.ceil(totalCount / settings.batchSize);

        console.log(`📊 Will process ${totalBatches} batches of ${settings.batchSize} posts each`);

        while (totalProcessed < totalCount && !shouldStop) {
            currentBatch++;
            const remainingCount = totalCount - totalProcessed;
            const currentBatchSize = Math.min(settings.batchSize, remainingCount);

            console.log(`📦 Processing batch ${currentBatch}/${totalBatches} (${currentBatchSize} posts)`);

            sendProgressUpdate(
                `Processing batch ${currentBatch}/${totalBatches}...`,
                `${currentBatchSize} posts in this batch`,
                ((currentBatch - 1) / totalBatches) * 100
            );

            try {
                // Ensure we're in selection mode
                await ensureSelectionMode();
                await sleep(2000);

                // Find selectable posts
                const selectablePosts = findSelectablePosts();
                if (selectablePosts.length === 0) {
                    console.log('❌ No more posts available');
                    sendProgressUpdate('No more posts available', 'Process completed - no more posts to unlike');
                    break;
                }

                // Select posts for this batch
                const selected = await clickPosts(selectablePosts, currentBatchSize);

                if (selected > 0) {
                    // Process unlike for this batch
                    await clickUnlikeButton();
                    await handleConfirmation();

                    totalProcessed += selected;
                    console.log(`✅ Batch ${currentBatch} complete! Total processed: ${totalProcessed}/${totalCount}`);

                    // Wait between batches if more to process
                    if (totalProcessed < totalCount && !shouldStop) {
                        sendProgressUpdate(
                            `Batch ${currentBatch} complete!`,
                            `Total processed: ${totalProcessed}/${totalCount}. Waiting before next batch...`,
                            (currentBatch / totalBatches) * 100
                        );
                        const delay = settings.batchDelay + Math.random() * 2000;
                        console.log(`⏱️ Waiting ${delay}ms before next batch`);
                        await sleep(delay);
                    }
                } else {
                    console.log('❌ No posts could be selected');
                    sendProgressUpdate('No posts could be selected', 'Stopping process - no selectable posts found');
                    break;
                }
            } catch (error) {
                console.error(`❌ Error in batch ${currentBatch}:`, error);
                throw error;
            }
        }

        return totalProcessed;
    }

    // Main unlike process
    async function startUnlikeProcess(totalCount) {
        if (isProcessing) {
            console.log('⚠️ Already processing');
            return;
        }

        console.log(`🚀 Starting unlike process for ${totalCount} posts`);
        isProcessing = true;
        shouldStop = false;

        try {
            sendProgressUpdate('Starting unlike process...', 'Initializing with custom settings', 0);

            // Test DOM access first
            const hasAccess = testDOMAccess();
            if (!hasAccess) {
                throw new Error('Cannot access Instagram elements');
            }

            const processedCount = await processBatch(totalCount);

            if (shouldStop) {
                console.log(`⏹️ Process stopped by user. Processed: ${processedCount}`);
                sendProcessError(`Process stopped. Processed ${processedCount} posts.`);
            } else {
                console.log(`✅ Process completed successfully! Processed: ${processedCount}`);
                sendProcessComplete(processedCount);
            }

        } catch (error) {
            console.error('❌ Error in unlike process:', error);
            sendProcessError(error.message);
        } finally {
            isProcessing = false;
        }
    }

    function stopUnlikeProcess() {
        console.log('⏹️ Stop requested');
        shouldStop = true;
        sendProgressUpdate('Stopping process...', 'Please wait for current operation to finish');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Enhanced initialization
    async function initialize() {
        console.log('🔧 Initializing extension...');

        // Test initial DOM access
        setTimeout(() => {
            const domAccess = testDOMAccess();
            console.log('🧪 Initial DOM test result:', domAccess);

            if (window.location.href.includes('/your_activity/interactions/likes/')) {
                console.log('✅ On likes page - extension ready!');

                // Test finding selectable posts
                setTimeout(() => {
                    const posts = findSelectablePosts();
                    const selectionMode = isSelectionModeActive();
                    console.log('🔍 Detailed status:');
                    console.log(`   - Selectable posts: ${posts.length}`);
                    console.log(`   - Selection mode: ${selectionMode}`);
                }, 3000);
            } else {
                console.log('📍 Not on likes page, but extension loaded');
            }
        }, 2000);
    }

    // Initialize
    initialize();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }

    // Handle URL changes for Instagram's SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('🔄 URL changed to:', url);
            setTimeout(initialize, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    console.log('✅ Insta Bulk Unlike Extension setup complete!');

})();
