# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Support for other social media platforms
- Export/import settings functionality
- Scheduling features
- Enhanced analytics and reporting

## [1.0.0] - 2025-06-28

### Added
- **Initial Release** 🎉
- Smart batch processing with configurable settings (3-15 posts per batch)
- Three speed presets:
  - 🐢 Safe Mode (2.5s delays, 5 posts/batch)
  - ⚡ Balanced Mode (1.5s delays, 7 posts/batch)
  - 🚀 Fast Mode (1s delays, 10 posts/batch)
- Built-in safety features:
  - Daily usage limits (50-500 posts per day)
  - Session limits (max 50 posts per session)
  - Real-time usage tracking with visual warnings
  - Automatic rate limiting protection
- Advanced progress tracking:
  - Real-time progress bar with percentage completion
  - ETA calculations based on current processing speed
  - Detailed batch information and status updates
  - Success/error notifications with actionable feedback
- Customizable settings:
  - Configurable batch sizes
  - Adjustable selection delays (1-8 seconds)
  - Variable batch delays (5-20 seconds)
  - Customizable daily limits
  - Settings persistence across browser sessions
- Modern user interface:
  - Clean, Instagram-inspired design
  - One-click navigation to Instagram likes page
  - Built-in safety warnings and usage guidelines
  - No annoying alert popups
- Technical features:
  - Manifest V3 compliance
  - Local data storage only
  - No external API calls
  - Comprehensive error handling
  - Cross-session settings persistence
  - Responsive design for all screen sizes

### Security
- All data stored locally using Chrome's secure storage API
- No external data transmission
- Minimal required permissions
- Content Security Policy implementation
- No third-party integrations or tracking

### Documentation
- Comprehensive README with installation and usage instructions
- Detailed privacy policy
- Safety guidelines and best practices
- Troubleshooting guide
- Development documentation

### Browser Support
- ✅ Chrome v88+
- ✅ Edge v88+ (Chromium-based)
- ✅ Brave (latest version)
- ❌ Firefox (not supported - different extension API)
- ❌ Safari (not supported)

---

## Version History Legend

- 🎉 **Major Release** - New version with significant features
- ✨ **Added** - New features
- 🔧 **Changed** - Changes in existing functionality
- 🐛 **Fixed** - Bug fixes
- 🗑️ **Removed** - Removed features
- 🛡️ **Security** - Security improvements
- 📚 **Documentation** - Documentation changes
- ⚡ **Performance** - Performance improvements

---

**Note**: This project follows semantic versioning. Given a version number MAJOR.MINOR.PATCH:
- MAJOR version increments for incompatible API changes
- MINOR version increments for backwards-compatible functionality additions
- PATCH version increments for backwards-compatible bug fixes