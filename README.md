# 🚀 Insta Bulk Unlike - Social Media Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg?style=for-the-badge)](https://github.com/r1t3s/insta-bulk-unlike/releases)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg?style=for-the-badge)](https://github.com/r1t3s)

> **Efficiently manage your Instagram liked posts with smart batch processing, safety features, and customizable speed controls.**


## ✨ Key Features

### 🚀 **Smart Batch Processing**
- Process posts in configurable batches (3-15 posts per batch)
- Intelligent delays between actions to prevent rate limiting
- Automatic retry mechanisms for failed operations

### ⚡ **Multiple Speed Modes**
- **🐢 Safe Mode**: Recommended for first-time users (2.5s delays, 5 posts/batch)
- **⚡ Balanced Mode**: Faster processing (1.5s delays, 7 posts/batch)
- **🚀 Fast Mode**: Maximum speed for experienced users (1s delays, 10 posts/batch)

### 🛡️ **Built-in Safety Features**
- Configurable daily limits (50-500 posts per day)
- Session limits (max 50 posts per session)
- Real-time usage tracking with visual warnings
- Automatic rate limiting protection

### 📊 **Advanced Progress Tracking**
- Real-time progress bar with percentage completion
- ETA calculations based on current processing speed
- Detailed batch information and status updates
- Success/error notifications with actionable feedback

### ⚙️ **Customizable Settings**
- **Batch Size**: 3-15 posts per batch
- **Selection Delay**: 1-8 seconds between post selections
- **Batch Delay**: 5-20 seconds between batches
- **Daily Limit**: 50-500 posts per day
- Settings persistence across browser sessions

### 🎯 **User Experience**
- Clean, modern interface with Instagram-inspired design
- One-click navigation to Instagram likes page
- Built-in safety warnings and usage guidelines
- No annoying alert popups - all feedback is integrated

## 📸 Screenshots

| Main Interface | Speed Presets | Advanced Settings |
|----------------|---------------|-------------------|
| ![Main](https://github.com/r1t3s/insta-bulk-unlike/blob/main/screenshots/insta-bulk-unlike-main-interface.png) | ![Speed](https://github.com/r1t3s/insta-bulk-unlike/blob/main/screenshots/insta-bulk-unlike-main-interface-2.png) | ![Settings](https://github.com/r1t3s/insta-bulk-unlike/blob/main/screenshots/insta-bulk-unlike-advanced-settings.png) |

| Progress Tracking | Safety Features |
|-------------------|-----------------|
| ![Progress](https://github.com/r1t3s/insta-bulk-unlike/blob/main/screenshots/insta-bulk-unlike-processing-demo.png) | ![Safety](https://github.com/r1t3s/insta-bulk-unlike/blob/main/screenshots/insta-bulk-unlike-safety-features.png) |

## 🚀 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore) (Coming Soon)
2. Click "Add to Chrome"
3. Confirm installation in the popup

### Manual Installation (Developer Mode)
1. **Download the extension**:
   ```bash
   git clone https://github.com/r1t3s/insta-bulk-unlike.git
   cd insta-bulk-unlike
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the downloaded folder

3. **Ready to use**! 🎉

## 📋 How to Use

### Quick Start Guide

1. **🔗 Navigate to Instagram**
   - Open Instagram and log into your account
   - Go to your liked posts page, or click "Open Likes Page" in the extension

2. **⚙️ Configure Settings**
   - Choose a speed preset (Safe/Balanced/Fast)
   - Set the number of posts to process (1-50 per session)
   - Optionally adjust advanced settings

3. **✅ Acknowledge Terms**
   - Read and acknowledge the usage terms
   - Understand Instagram's Terms of Service compliance

4. **🚀 Start Processing**
   - Click "Start Unlike Process"
   - Keep the browser tab active
   - Monitor progress in real-time

5. **📊 Track Progress**
   - Watch the progress bar and ETA
   - View detailed batch information
   - Receive completion notifications

### Pro Tips

- **Start with Safe Mode** if you're new to bulk operations
- **Monitor daily usage** to stay within platform limits
- **Take breaks** between large processing sessions
- **Keep the tab active** during processing for best results
- **Use Fast Mode sparingly** and at your own risk

## 🛡️ Safety & Compliance

### Built-in Safety Features
- **Daily Limits**: Prevents excessive usage that could trigger Instagram's anti-spam measures
- **Rate Limiting**: Intelligent delays between actions
- **Session Limits**: Maximum 50 posts per session
- **Usage Warnings**: Visual indicators when approaching limits
- **Failure Handling**: Automatic retries and graceful error recovery

### Instagram Terms of Service
⚠️ **Important**: This tool automates social media interactions. Users are responsible for:
- Complying with Instagram's Terms of Service
- Using the tool responsibly and ethically
- Understanding potential risks of automation
- Taking breaks between large processing sessions

### Best Practices
1. **Start Small**: Begin with 5-10 posts to test functionality
2. **Use Safe Mode**: Recommended for regular usage
3. **Monitor Usage**: Keep track of daily processing limits
4. **Stay Updated**: Check for extension updates regularly
5. **Report Issues**: Contact support if you encounter problems

## ⚙️ Technical Details

### Browser Compatibility
- ✅ **Chrome**: v88+ (Manifest V3 support)
- ✅ **Edge**: v88+ (Chromium-based)
- ✅ **Brave**: Latest version
- ❌ **Firefox**: Not supported (different extension API)
- ❌ **Safari**: Not supported

### Permissions Explained
- `activeTab`: Access the current Instagram tab for automation
- `storage`: Save user preferences and daily usage tracking
- `scripting`: Inject content scripts for Instagram interaction
- `host_permissions`: Only works on instagram.com domains

### Performance
- **Memory Usage**: < 10MB typical usage
- **CPU Impact**: Minimal during operation
- **Network**: No external requests (all processing is local)
- **Storage**: < 1KB for settings and usage data

## 🔧 Development

### Project Structure
```
insta-bulk-unlike/
├── 📁 icons/              # Extension icons (16px, 48px, 128px)
├── 📄 manifest.json       # Extension configuration
├── 📄 popup.html          # Main interface HTML
├── 📄 popup.css           # Styling and animations
├── 📄 popup.js            # UI logic and settings management
├── 📄 content.js          # Instagram page automation
├── 📄 background.js       # Service worker for extension lifecycle
├── 📄 privacy-policy.html # Privacy policy for Chrome Web Store
└── 📄 LICENSE.md           # MIT License file
└── 📄 README.md           # This file
```

### Key Technologies
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No external dependencies
- **Chrome Storage API**: Settings persistence
- **Chrome Scripting API**: Dynamic content injection
- **Modern CSS**: Flexbox, Grid, Custom Properties
- **Instagram Web API**: DOM manipulation and automation

### Local Development
```bash
# Clone repository
git clone https://github.com/r1t3s/insta-bulk-unlike.git
cd insta-bulk-unlike

# Load in Chrome for testing
# Go to chrome://extensions/ → Developer mode → Load unpacked

# Make changes and reload extension for testing
```

### Building for Production
```bash
# Create production package
zip -r insta-bulk-unlike-v1.0.0.zip . -x "*.git*" "*.DS_Store" "*.md"
```

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Loading
- **Solution**: Refresh the Instagram page and try again
- **Check**: Ensure you're on the correct Instagram likes page
- **Verify**: Extension permissions are granted

#### "Please refresh this page" Message
- **Cause**: Content script failed to inject
- **Solution**: Refresh the page, ensure extension is enabled
- **Alternative**: Disable and re-enable the extension

#### Process Stops Unexpectedly
- **Possible Causes**: Instagram rate limiting, network issues, page navigation
- **Solution**: Wait a few minutes, then try with fewer posts
- **Prevention**: Use slower speed settings, smaller batch sizes

#### Daily Limit Reached
- **Message**: "Daily limit exceeded"
- **Solution**: Wait until next day (resets at midnight UTC)
- **Alternative**: Increase daily limit in advanced settings (use carefully)

### Getting Help
1. **Check Console**: Open DevTools (F12) and look for error messages
2. **Update Extension**: Ensure you have the latest version
3. **Report Bug**: Create an issue on GitHub with details
4. **Contact Developer**: Reach out through GitHub

## 🔒 Privacy & Security

### Data Collection
- **What we collect**: User preferences, daily usage counters (stored locally)
- **What we DON'T collect**: Instagram credentials, post content, personal information
- **Storage**: All data stays on your device using Chrome's secure storage API
- **Transmission**: No data is sent to external servers

### Security Features
- **Local Processing**: All automation happens in your browser
- **No External APIs**: No communication with third-party services
- **Secure Storage**: Uses Chrome's encrypted storage system
- **Permission Scope**: Limited to Instagram.com only

### Privacy Policy
Full privacy policy available at: [privacy-policy.html](https://r1t3s.github.io/insta-bulk-unlike/privacy-policy.html)

## 📈 Roadmap

### Version 1.1 (Planned)
- [ ] **Support for Other Platforms**: Twitter, Facebook likes management
- [ ] **Backup/Restore**: Export and import settings
- [ ] **Scheduling**: Set specific times for processing
- [ ] **Detailed Analytics**: Processing history and statistics

### Version 1.2 (Future)
- [ ] **Selective Processing**: Filter posts by date, content type
- [ ] **Bulk Actions**: Multiple action types beyond unlike
- [ ] **Theme Options**: Dark mode, custom color schemes
- [ ] **Cloud Sync**: Sync settings across devices

### Community Requests
- [ ] **Firefox Support**: Mozilla extension version
- [ ] **Mobile Support**: Android/iOS app version
- [ ] **API Integration**: Direct Instagram API usage (if available)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Have an idea? We'd love to hear it!
- 🔧 **Code Contributions**: Submit pull requests
- 📖 **Documentation**: Improve guides and explanations
- 🌍 **Translations**: Help make this available in more languages

### Development Setup
```bash
# Fork the repository
git clone https://github.com/r1t3s/insta-bulk-unlike.git
cd insta-bulk-unlike

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test thoroughly
# Follow existing code style and patterns

# Commit changes
git commit -m "Add amazing feature"

# Push and create pull request
git push origin feature/amazing-feature
```

### Code Style Guidelines
- **JavaScript**: Use modern ES6+ features, async/await for promises
- **CSS**: Use CSS custom properties, mobile-first responsive design
- **HTML**: Semantic markup, accessibility considerations
- **Comments**: Document complex logic and user-facing features

### Project Stats
- **Lines of Code**: ~2,000+
- **Development Time**: 40+ hours
- **Features**: 15+ major features
- **Browser Support**: Chrome, Edge, Brave
- **Safety Features**: 10+ built-in protections

## 📝 Changelog

### v1.0.0 (June 28, 2025)
**🎉 Initial Release**

#### ✨ New Features
- Smart batch processing with configurable settings
- Three speed presets (Safe, Balanced, Fast)
- Real-time progress tracking with ETA
- Built-in safety features and daily limits
- Advanced customization options
- Modern, responsive user interface
- Instagram-compatible automation engine

#### 🛡️ Safety Features
- Daily usage limits (50-500 posts)
- Session limits (max 50 posts)
- Rate limiting protection
- Intelligent delay management
- Visual usage warnings

#### 🔧 Technical Features
- Manifest V3 compliance
- Local data storage
- Error handling and recovery
- Cross-session settings persistence
- Responsive design for all screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 r1t3s

Permission is hereby granted, free of charge, to any person obtaining a copy
...
