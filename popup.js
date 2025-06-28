// Insta Bulk Unlike Extension - Enhanced Popup Script v1.1
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎛️ Enhanced Popup loaded v1.1');

    // Get essential DOM elements
    const pageStatus = document.getElementById('page-status');
    const pageStatusText = document.getElementById('page-status-text');
    const openLikesBtn = document.getElementById('open-likes-page');
    const controlsSection = document.getElementById('controls-section');
    const startBtn = document.getElementById('start-unlike');
    const stopBtn = document.getElementById('stop-unlike');
    const acknowledgeTerms = document.getElementById('acknowledge-terms');
    const unlikeCountInput = document.getElementById('unlike-count');
    const disclaimerToggle = document.getElementById('disclaimer-toggle');
    const disclaimerDetails = document.getElementById('disclaimer-details');
    const advancedToggleBtn = document.getElementById('advanced-toggle-btn');
    const advancedSettings = document.getElementById('advanced-settings');

    // Enhanced progress elements
    const progressSection = document.getElementById('progress-section');
    const progressTitle = document.getElementById('progress-title');
    const progressStats = document.getElementById('progress-stats');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressEta = document.getElementById('progress-eta');
    const progressBatchInfo = document.getElementById('progress-batch-info');

    // Message elements
    const messageSection = document.getElementById('message-section');
    const messageIcon = document.getElementById('message-icon');
    const messageText = document.getElementById('message-text');
    const messageDetails = document.getElementById('message-details');
    const messageDismiss = document.getElementById('message-dismiss');

    // Safety and settings elements
    const dailyUsageSpan = document.getElementById('daily-usage');
    const dailyLimitDisplay = document.getElementById('daily-limit-display');
    const dailyLimitInput = document.getElementById('daily-limit');
    const dailyLimitValue = document.getElementById('daily-limit-value');
    const batchSizeInput = document.getElementById('batch-size');
    const batchSizeValue = document.getElementById('batch-size-value');
    const selectionDelayInput = document.getElementById('selection-delay');
    const selectionDelayValue = document.getElementById('selection-delay-value');
    const batchDelayInput = document.getElementById('batch-delay');
    const batchDelayValue = document.getElementById('batch-delay-value');
    const resetSettingsBtn = document.getElementById('reset-settings');

    // Speed preset buttons
    const speedButtons = document.querySelectorAll('.speed-btn');

    let currentTab = null;
    let isProcessing = false;
    let disclaimerOpen = false;
    let advancedSettingsOpen = false;
    let processStartTime = null;
    let currentSettings = null;

    // Enhanced safety limits with configurable daily limit
    const SAFETY_LIMITS = {
        maxPostsPerSession: 50,
        minSelectionDelay: 1000,
        minBatchDelay: 5000,
        maxBatchSize: 15,
        minDailyLimit: 50,
        maxDailyLimit: 500
    };

    // Speed presets
    const SPEED_PRESETS = {
        safe: {
            batchSize: 5,
            selectionDelay: 2500,
            batchDelay: 8000,
            name: 'Safe Mode'
        },
        balanced: {
            batchSize: 7,
            selectionDelay: 1500,
            batchDelay: 6000,
            name: 'Balanced Mode'
        },
        fast: {
            batchSize: 10,
            selectionDelay: 1000,
            batchDelay: 5000,
            name: 'Fast Mode'
        }
    };

    // Default settings (now faster)
    const defaultSettings = {
        batchSize: 5,
        selectionDelay: 2500,
        batchDelay: 8000,
        unlikeCount: 10,
        dailyLimit: 100,
        speedPreset: 'safe'
    };

    // Test that all elements exist
    console.log('🔍 Checking elements:', {
        pageStatus: !!pageStatus,
        progressSection: !!progressSection,
        messageSection: !!messageSection,
        speedButtons: speedButtons.length
    });

    // Enhanced event listeners
    try {
        // Disclaimer toggle
        if (disclaimerToggle) {
            disclaimerToggle.addEventListener('click', function() {
                console.log('📋 Disclaimer toggle clicked');
                disclaimerOpen = !disclaimerOpen;

                if (disclaimerOpen) {
                    disclaimerDetails.classList.add('open');
                    disclaimerToggle.textContent = 'Show Less';
                } else {
                    disclaimerDetails.classList.remove('open');
                    disclaimerToggle.textContent = 'Learn More';
                }
                saveSettings();
            });
        }

        // Terms acknowledgment
        if (acknowledgeTerms) {
            acknowledgeTerms.addEventListener('change', function() {
                console.log('✅ Terms acknowledged:', acknowledgeTerms.checked);
                updateStartButtonState();
                saveSettings();
            });
        }

        // Speed preset selection
        speedButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const speed = this.dataset.speed;
                selectSpeedPreset(speed);
            });
        });

        // Advanced settings toggle
        if (advancedToggleBtn) {
            advancedToggleBtn.addEventListener('click', function() {
                console.log('⚙️ Advanced settings toggle clicked');
                advancedSettingsOpen = !advancedSettingsOpen;

                if (advancedSettingsOpen) {
                    advancedSettings.classList.add('open');
                    advancedToggleBtn.classList.add('active');
                } else {
                    advancedSettings.classList.remove('open');
                    advancedToggleBtn.classList.remove('active');
                }
                saveSettings();
            });
        }

        // Daily limit input
        if (dailyLimitInput) {
            dailyLimitInput.addEventListener('input', function(e) {
                const value = Math.max(SAFETY_LIMITS.minDailyLimit, Math.min(parseInt(e.target.value), SAFETY_LIMITS.maxDailyLimit));
                e.target.value = value;
                if (dailyLimitValue) dailyLimitValue.textContent = value;
                if (dailyLimitDisplay) dailyLimitDisplay.textContent = value;
                console.log('📊 Daily limit changed to:', value);
                updateDailyUsage();
                saveSettings();
            });
        }

        // Range inputs with enhanced feedback
        if (batchSizeInput) {
            batchSizeInput.addEventListener('input', function(e) {
                const value = Math.min(parseInt(e.target.value), SAFETY_LIMITS.maxBatchSize);
                e.target.value = value;
                if (batchSizeValue) batchSizeValue.textContent = value;
                console.log('📊 Batch size changed to:', value);
                saveSettings();
            });
        }

        if (selectionDelayInput) {
            selectionDelayInput.addEventListener('input', function(e) {
                const value = Math.max(parseInt(e.target.value), SAFETY_LIMITS.minSelectionDelay);
                e.target.value = value;
                if (selectionDelayValue) selectionDelayValue.textContent = (value / 1000).toFixed(1);
                console.log('⏱️ Selection delay changed to:', value);
                saveSettings();
            });
        }

        if (batchDelayInput) {
            batchDelayInput.addEventListener('input', function(e) {
                const value = Math.max(parseInt(e.target.value), SAFETY_LIMITS.minBatchDelay);
                e.target.value = value;
                if (batchDelayValue) batchDelayValue.textContent = (value / 1000).toFixed(1);
                console.log('⏱️ Batch delay changed to:', value);
                saveSettings();
            });
        }

        // Unlike count input
        if (unlikeCountInput) {
            unlikeCountInput.addEventListener('input', function(e) {
                const value = parseInt(e.target.value);
                if (value > SAFETY_LIMITS.maxPostsPerSession) {
                    e.target.value = SAFETY_LIMITS.maxPostsPerSession;
                    showMessage('warning', 'Session Limit', `Maximum ${SAFETY_LIMITS.maxPostsPerSession} posts per session for safety`);
                }
                updateStartButtonState();
                saveSettings();
            });
        }

        // Reset settings button
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', function() {
                console.log('🔄 Reset settings clicked');
                if (confirm('Reset all settings to recommended defaults?')) {
                    resetToDefaults();
                }
            });
        }

        // Message dismiss button
        if (messageDismiss) {
            messageDismiss.addEventListener('click', function() {
                hideMessage();
            });
        }

        // Open likes page button
        if (openLikesBtn) {
            openLikesBtn.addEventListener('click', async function() {
                console.log('🔗 Open likes page clicked');
                try {
                    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

                    if (tab.url.includes('instagram.com')) {
                        await chrome.tabs.update(tab.id, {
                            url: 'https://www.instagram.com/your_activity/interactions/likes/'
                        });
                    } else {
                        await chrome.tabs.create({
                            url: 'https://www.instagram.com/your_activity/interactions/likes/'
                        });
                    }

                    setTimeout(checkTabStatus, 3000);

                } catch (error) {
                    console.error('❌ Error opening likes page:', error);
                    showMessage('error', 'Navigation Error', 'Could not open likes page. Please navigate manually.');
                }
            });
        }

        // Enhanced start button
        if (startBtn) {
            startBtn.addEventListener('click', async function() {
                console.log('🚀 Start button clicked');

                if (!acknowledgeTerms.checked) {
                    showMessage('warning', 'Terms Required', 'Please acknowledge the terms and conditions first.');
                    return;
                }

                const count = parseInt(unlikeCountInput.value) || 5;

                if (count < 1) {
                    showMessage('warning', 'Invalid Count', 'Please enter a valid number of posts (1 or more).');
                    return;
                }

                if (!currentTab) {
                    showMessage('error', 'No Tab', 'No active tab found. Please refresh and try again.');
                    return;
                }

                // Check daily limit
                const currentDailyLimit = parseInt(dailyLimitInput.value) || defaultSettings.dailyLimit;
                chrome.storage.local.get(['dailyUsage', 'lastUsageDate'], async (result) => {
                    const today = new Date().toISOString().split('T')[0];
                    const dailyUsage = (result.lastUsageDate === today) ? (result.dailyUsage || 0) : 0;

                    if (dailyUsage + count > currentDailyLimit) {
                        const remaining = currentDailyLimit - dailyUsage;
                        showMessage('warning', 'Daily Limit', `This would exceed your daily limit. Remaining today: ${remaining} posts`);
                        return;
                    }

                    await startProcess(count);
                });
            });
        }

        // Stop button
        if (stopBtn) {
            stopBtn.addEventListener('click', async function() {
                console.log('⏹️ Stop button clicked');
                try {
                    if (currentTab) {
                        await sendMessageToTab(currentTab.id, { action: 'stopUnlike' });
                        showMessage('info', 'Stopping', 'Process is being stopped safely...');
                    }
                } catch (error) {
                    console.error('❌ Error stopping process:', error);
                }
            });
        }

    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }

    // Speed preset selection
    function selectSpeedPreset(speed) {
        console.log('🏃 Selecting speed preset:', speed);

        // Update active button
        speedButtons.forEach(btn => btn.classList.remove('active'));
        const selectedBtn = document.querySelector(`[data-speed="${speed}"]`);
        if (selectedBtn) selectedBtn.classList.add('active');

        // Apply preset settings
        const preset = SPEED_PRESETS[speed];
        if (preset && batchSizeInput && selectionDelayInput && batchDelayInput) {
            batchSizeInput.value = preset.batchSize;
            if (batchSizeValue) batchSizeValue.textContent = preset.batchSize;

            selectionDelayInput.value = preset.selectionDelay;
            if (selectionDelayValue) selectionDelayValue.textContent = (preset.selectionDelay / 1000).toFixed(1);

            batchDelayInput.value = preset.batchDelay;
            if (batchDelayValue) batchDelayValue.textContent = (preset.batchDelay / 1000).toFixed(1);

            showMessage('info', `${preset.name} Selected`, 'Settings have been updated to the selected speed preset.');
        }

        saveSettings();
    }

    // Enhanced message sending
    async function sendMessageToTab(tabId, message) {
        return new Promise((resolve) => {
            if (!tabId) {
                console.warn('No tab ID available');
                resolve(null);
                return;
            }

            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    console.warn('Message sending failed:', chrome.runtime.lastError.message);
                    resolve(null);
                } else {
                    console.log('📥 Response received:', response);
                    resolve(response);
                }
            });
        });
    }

    // Enhanced start process
    async function startProcess(count) {
        try {
            currentSettings = {
                batchSize: parseInt(batchSizeInput.value) || 5,
                          selectionDelay: parseInt(selectionDelayInput.value) || 2500,
                          batchDelay: parseInt(batchDelayInput.value) || 8000
            };

            console.log('📤 Sending start message with settings:', currentSettings);

            const response = await sendMessageToTab(currentTab.id, {
                action: 'startUnlike',
                count: count,
                settings: currentSettings
            });

            if (response) {
                console.log('✅ Process started successfully');
                isProcessing = true;
                processStartTime = Date.now();

                // Update UI
                startBtn.style.display = 'none';
                if (stopBtn) stopBtn.style.display = 'flex';
                if (unlikeCountInput) unlikeCountInput.disabled = true;

                // Show progress section
                showProgress();
                updateProgress({
                    text: 'Starting process...',
                    percentage: 0,
                    current: 0,
                    total: count
                });

            } else {
                throw new Error('No response from content script');
            }

        } catch (error) {
            console.error('❌ Start process error:', error);
            showMessage('error', 'Start Failed', 'Failed to start process. Please refresh the page and try again.');
        }
    }

    // Enhanced progress display
    function showProgress() {
        if (progressSection) {
            progressSection.style.display = 'block';
            hideMessage(); // Hide any existing messages
        }
    }

    function hideProgress() {
        if (progressSection) {
            progressSection.style.display = 'none';
        }
    }

    function updateProgress(data) {
        if (!progressSection) return;

        // Update progress bar
        if (data.percentage !== undefined && progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, data.percentage))}%`;
        }

        // Update progress text
        if (data.text && progressText) {
            progressText.textContent = data.text;
        }

        // Update stats
        if (data.current !== undefined && data.total !== undefined && progressStats) {
            progressStats.textContent = `${data.current}/${data.total} posts`;
        }

        // Calculate and update ETA
        if (data.current && data.total && processStartTime && progressEta) {
            const elapsed = Date.now() - processStartTime;
            const rate = data.current / elapsed; // posts per ms
            const remaining = data.total - data.current;
            const etaMs = remaining / rate;

            if (etaMs > 0 && isFinite(etaMs)) {
                const etaSeconds = Math.ceil(etaMs / 1000);
                const minutes = Math.floor(etaSeconds / 60);
                const seconds = etaSeconds % 60;

                if (minutes > 0) {
                    progressEta.textContent = `ETA: ${minutes}m ${seconds}s`;
                } else {
                    progressEta.textContent = `ETA: ${seconds}s`;
                }
            }
        }

        // Update batch info
        if (data.details && progressBatchInfo) {
            progressBatchInfo.textContent = data.details;
        }

        // Update title based on status
        if (progressTitle) {
            if (data.percentage >= 100) {
                progressTitle.textContent = 'Completed!';
            } else if (data.percentage > 0) {
                progressTitle.textContent = 'Processing...';
            } else {
                progressTitle.textContent = 'Starting...';
            }
        }
    }

    // Enhanced message system
    function showMessage(type, title, details, duration = 5000) {
        if (!messageSection) return;

        // Set message type class
        messageSection.className = `message-section ${type}`;

        // Set icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        if (messageIcon) messageIcon.textContent = icons[type] || 'ℹ️';
        if (messageText) messageText.textContent = title;
        if (messageDetails) messageDetails.textContent = details;

        // Show message
        messageSection.style.display = 'block';

        // Auto hide after duration (except for errors)
        if (type !== 'error' && duration > 0) {
            setTimeout(() => {
                hideMessage();
            }, duration);
        }
    }

    function hideMessage() {
        if (messageSection) {
            messageSection.style.display = 'none';
        }
    }

    // Reset to default settings
    function resetToDefaults() {
        // Speed preset
        selectSpeedPreset('safe');

        // Daily limit
        if (dailyLimitInput) {
            dailyLimitInput.value = defaultSettings.dailyLimit;
            if (dailyLimitValue) dailyLimitValue.textContent = defaultSettings.dailyLimit;
            if (dailyLimitDisplay) dailyLimitDisplay.textContent = defaultSettings.dailyLimit;
        }

        // Unlike count
        if (unlikeCountInput) {
            unlikeCountInput.value = defaultSettings.unlikeCount;
        }

        showMessage('success', 'Settings Reset', 'All settings have been reset to safe defaults.');
        saveSettings();
    }

    // Update start button state
    function updateStartButtonState() {
        if (!startBtn || !acknowledgeTerms || !unlikeCountInput) return;

        const termsAccepted = acknowledgeTerms.checked;
        const validCount = parseInt(unlikeCountInput.value) > 0;
        const notProcessing = !isProcessing;

        const canStart = termsAccepted && validCount && notProcessing;

        startBtn.disabled = !canStart;

        if (!termsAccepted) {
            startBtn.innerHTML = '<span>⚠️ Please acknowledge terms first</span>';
        } else if (!validCount) {
            startBtn.innerHTML = '<span>⚠️ Enter valid post count</span>';
        } else {
            startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
            Start Unlike Process
            `;
        }
    }

    // Update status display
    function updateStatus(type, text) {
        if (pageStatus) pageStatus.className = `status-indicator ${type}`;
        if (pageStatusText) pageStatusText.textContent = text;
        console.log(`📊 Status: ${type} - ${text}`);
    }

    // Enhanced tab status checking
    async function checkTabStatus() {
        try {
            console.log('🔍 Checking tab status...');
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            currentTab = tab;

            if (!tab) {
                updateStatus('error', 'No active tab found');
                return;
            }

            if (tab.url.includes('instagram.com/your_activity/interactions/likes/')) {
                console.log('✅ On likes page, testing communication...');
                updateStatus('success', 'On likes page - testing connection...');

                try {
                    const response = await sendMessageToTab(tab.id, { action: 'ping' });

                    if (response && response.status === 'ready') {
                        console.log('✅ Communication successful!');
                        updateStatus('success', 'Ready! Extension loaded successfully');
                        if (controlsSection) controlsSection.style.display = 'block';
                        if (openLikesBtn) openLikesBtn.style.display = 'none';
                    } else {
                        throw new Error('No response from content script');
                    }

                } catch (error) {
                    console.error('❌ Communication failed:', error);
                    updateStatus('error', 'Extension loading... Please wait or refresh');
                }

            } else if (tab.url.includes('instagram.com')) {
                updateStatus('error', 'Please navigate to your likes page');
                if (controlsSection) controlsSection.style.display = 'none';
                if (openLikesBtn) openLikesBtn.style.display = 'flex';

            } else {
                updateStatus('error', 'Please open Instagram first');
                if (controlsSection) controlsSection.style.display = 'none';
                if (openLikesBtn) openLikesBtn.style.display = 'flex';
            }

        } catch (error) {
            console.error('❌ Tab status check error:', error);
            updateStatus('error', 'Error checking page status');
        }
    }

    // Enhanced daily usage tracking
    function updateDailyUsage() {
        if (!dailyUsageSpan) return;

        const today = new Date().toISOString().split('T')[0];
        const currentDailyLimit = parseInt(dailyLimitInput?.value) || defaultSettings.dailyLimit;

        chrome.storage.local.get(['dailyUsage', 'lastUsageDate'], (result) => {
            let dailyUsage = 0;

            if (result.lastUsageDate === today) {
                dailyUsage = result.dailyUsage || 0;
            }

            dailyUsageSpan.textContent = dailyUsage;

            // Update safety notice styling based on usage
            const safetyNotice = document.getElementById('safety-notice');
            if (safetyNotice) {
                safetyNotice.classList.remove('daily-limit-warning', 'daily-limit-near');

                if (dailyUsage >= currentDailyLimit) {
                    safetyNotice.classList.add('daily-limit-warning');
                    startBtn.disabled = true;
                } else if (dailyUsage >= currentDailyLimit * 0.8) {
                    safetyNotice.classList.add('daily-limit-near');
                }
            }

            updateStartButtonState();
        });
    }

    // Enhanced settings management
    function saveSettings() {
        const settings = {
            batchSize: parseInt(batchSizeInput?.value) || defaultSettings.batchSize,
                          selectionDelay: parseInt(selectionDelayInput?.value) || defaultSettings.selectionDelay,
                          batchDelay: parseInt(batchDelayInput?.value) || defaultSettings.batchDelay,
                          unlikeCount: parseInt(unlikeCountInput?.value) || defaultSettings.unlikeCount,
                          dailyLimit: parseInt(dailyLimitInput?.value) || defaultSettings.dailyLimit,
                          advancedSettingsOpen,
                          termsAccepted: acknowledgeTerms?.checked || false,
                          disclaimerOpen
        };

        chrome.storage.sync.set(settings);
        console.log('💾 Settings saved:', settings);
    }

    function loadSettings() {
        chrome.storage.sync.get([
            'batchSize', 'selectionDelay', 'batchDelay', 'unlikeCount',
            'dailyLimit', 'advancedSettingsOpen', 'termsAccepted', 'disclaimerOpen'
        ], (result) => {
            console.log('📁 Loading settings:', result);

            // Apply settings to inputs
            if (batchSizeInput) {
                const batchSize = Math.min(result.batchSize || defaultSettings.batchSize, SAFETY_LIMITS.maxBatchSize);
                batchSizeInput.value = batchSize;
                if (batchSizeValue) batchSizeValue.textContent = batchSize;
            }

            if (selectionDelayInput) {
                const selectionDelay = Math.max(result.selectionDelay || defaultSettings.selectionDelay, SAFETY_LIMITS.minSelectionDelay);
                selectionDelayInput.value = selectionDelay;
                if (selectionDelayValue) selectionDelayValue.textContent = (selectionDelay / 1000).toFixed(1);
            }

            if (batchDelayInput) {
                const batchDelay = Math.max(result.batchDelay || defaultSettings.batchDelay, SAFETY_LIMITS.minBatchDelay);
                batchDelayInput.value = batchDelay;
                if (batchDelayValue) batchDelayValue.textContent = (batchDelay / 1000).toFixed(1);
            }

            if (unlikeCountInput) {
                const unlikeCount = Math.min(result.unlikeCount || defaultSettings.unlikeCount, SAFETY_LIMITS.maxPostsPerSession);
                unlikeCountInput.value = unlikeCount;
            }

            if (dailyLimitInput) {
                const dailyLimit = Math.max(SAFETY_LIMITS.minDailyLimit, Math.min(result.dailyLimit || defaultSettings.dailyLimit, SAFETY_LIMITS.maxDailyLimit));
                dailyLimitInput.value = dailyLimit;
                if (dailyLimitValue) dailyLimitValue.textContent = dailyLimit;
                if (dailyLimitDisplay) dailyLimitDisplay.textContent = dailyLimit;
            }

            // Terms acceptance
            if (acknowledgeTerms) {
                acknowledgeTerms.checked = result.termsAccepted || false;
            }

            // Advanced settings state
            if (result.advancedSettingsOpen) {
                advancedSettingsOpen = true;
                if (advancedSettings) advancedSettings.classList.add('open');
                if (advancedToggleBtn) advancedToggleBtn.classList.add('active');
            }

            // Disclaimer state
            if (result.disclaimerOpen) {
                disclaimerOpen = true;
                if (disclaimerDetails) disclaimerDetails.classList.add('open');
                if (disclaimerToggle) disclaimerToggle.textContent = 'Show Less';
            }

            updateStartButtonState();
        });
    }

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('📨 Popup received message:', message.action);

        if (message.action === 'updateProgress') {
            updateProgress(message.data);

        } else if (message.action === 'processComplete') {
            console.log('✅ Process complete:', message.data.count);
            handleProcessComplete(message.data);

        } else if (message.action === 'processError') {
            console.log('❌ Process error:', message.data.error);
            handleProcessError(message.data);
        }
    });

    // Handle process completion
    function handleProcessComplete(data) {
        isProcessing = false;

        // Reset UI
        if (startBtn) {
            startBtn.style.display = 'flex';
            startBtn.disabled = false;
        }
        if (stopBtn) stopBtn.style.display = 'none';
        if (unlikeCountInput) unlikeCountInput.disabled = false;

        // Update progress to 100%
        updateProgress({
            text: 'Process completed!',
            percentage: 100,
            current: data.count,
            total: data.count
        });

        // Calculate process duration
        const duration = processStartTime ? Math.round((Date.now() - processStartTime) / 1000) : 0;
        const durationText = duration > 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`;

        // Show success message
        setTimeout(() => {
            hideProgress();
            showMessage('success', 'Process Completed!', `Successfully processed ${data.count} posts in ${durationText}`, 8000);
        }, 2000);

        // Update daily usage
        const today = new Date().toISOString().split('T')[0];
        chrome.storage.local.get(['dailyUsage', 'lastUsageDate'], (result) => {
            let dailyUsage = 0;

            if (result.lastUsageDate === today) {
                dailyUsage = result.dailyUsage || 0;
            }

            dailyUsage += data.count;

            chrome.storage.local.set({
                dailyUsage: dailyUsage,
                lastUsageDate: today
            });

            updateDailyUsage();
        });
    }

    // Handle process error
    function handleProcessError(data) {
        isProcessing = false;

        // Reset UI
        if (startBtn) {
            startBtn.style.display = 'flex';
            startBtn.disabled = false;
        }
        if (stopBtn) stopBtn.style.display = 'none';
        if (unlikeCountInput) unlikeCountInput.disabled = false;

        // Hide progress and show error
        setTimeout(() => {
            hideProgress();
            showMessage('error', 'Process Error', data.error, 0); // Don't auto-hide errors
        }, 1000);
    }

    // Initialize everything
    console.log('🔧 Initializing enhanced popup...');

    // Load settings first
    loadSettings();

    // Set default speed preset
    selectSpeedPreset('safe');

    // Update daily usage
    updateDailyUsage();

    // Start checking tab status
    checkTabStatus();

    // Update start button state
    updateStartButtonState();

    // Check status every 5 seconds
    setInterval(checkTabStatus, 5000);

    // Update daily usage every minute
    setInterval(updateDailyUsage, 60000);

    console.log('✅ Enhanced popup initialization complete');
});
