# SmartBulk Mobile App - React Native

A comprehensive fitness and nutrition mobile application built with React Native for Android and iOS platforms.

## 🚀 Features

### Core Features
- **Workout Planning**: Create, customize, and track workout routines
- **Nutrition Tracking**: MyFitnessPal-style food logging with macro breakdown
- **Progress Monitoring**: Visual charts and progress tracking
- **AI Fitness Coach**: ChatGPT-powered personalized fitness advice
- **Community**: Social fitness community with challenges
- **Trainer Marketplace**: Find and hire certified personal trainers

### Mobile-Specific Features
- **Offline Support**: Core features work without internet
- **Push Notifications**: Workout reminders and progress updates
- **Biometric Authentication**: Fingerprint/Face ID login
- **Camera Integration**: Food photo logging and barcode scanning
- **GPS Tracking**: Outdoor workout route mapping
- **Wearable Integration**: Smartwatch and fitness tracker sync
- **Background Sync**: Automatic data synchronization

## 📱 Platform Support

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 12.0+
- **Cross-Platform**: Shared codebase with platform-specific optimizations

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ 
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11
- Android SDK

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd android-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **iOS Setup (macOS only)**
```bash
cd ios
pod install
cd ..
```

4. **Start Metro bundler**
```bash
npm start
# or
yarn start
```

5. **Run on device/emulator**
```bash
# Android
npm run android
# or
yarn android

# iOS (macOS only)
npm run ios
# or
yarn ios
```

## 🏗️ Project Structure

```
android-app/
├── android/                 # Android native code
├── ios/                    # iOS native code
├── src/
│   ├── components/         # Reusable UI components
│   ├── screens/           # Screen components
│   ├── navigation/        # Navigation configuration
│   ├── services/          # API and business logic
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── constants/         # App constants
│   └── assets/            # Images, fonts, etc.
├── __tests__/             # Test files
├── App.js                 # Main app component
├── index.js               # App entry point
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=https://your-api-domain.com
API_KEY=your_api_key

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_SIGN_IN_WEB_CLIENT_ID=your_web_client_id

# Analytics
MIXPANEL_TOKEN=your_mixpanel_token
```

### Android Configuration

1. **Update app/build.gradle**
```gradle
android {
    defaultConfig {
        applicationId "com.smartbulk.mobile"
        versionCode 1
        versionName "1.0.0"
    }
}
```

2. **Configure signing keys**
```gradle
signingConfigs {
    release {
        storeFile file('release-key.keystore')
        storePassword 'your_store_password'
        keyAlias 'your_key_alias'
        keyPassword 'your_key_password'
    }
}
```

## 📦 Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```

### Android App Bundle (Google Play Store)
```bash
cd android
./gradlew bundleRelease
```

### iOS Archive
```bash
cd ios
xcodebuild -workspace SmartBulk.xcworkspace -scheme SmartBulk -configuration Release archive -archivePath SmartBulk.xcarchive
```

## 🚀 Deployment

### Google Play Store

1. **Create Developer Account**
   - Sign up at [Google Play Console](https://play.google.com/console)
   - Pay $25 one-time registration fee

2. **Prepare App Bundle**
   ```bash
   npm run build:android-bundle
   ```

3. **Upload to Play Console**
   - Go to "Release" → "Production"
   - Upload your AAB file
   - Fill in store listing details
   - Set up content rating
   - Configure pricing and distribution

4. **Submit for Review**
   - Review all requirements
   - Submit for Google review
   - Wait for approval (1-7 days typically)

### App Store (iOS)

1. **Apple Developer Account**
   - Sign up at [Apple Developer](https://developer.apple.com)
   - Pay $99/year membership

2. **Create Archive**
   - Build in Xcode
   - Archive and upload to App Store Connect

3. **App Store Connect**
   - Configure app information
   - Set up screenshots and metadata
   - Submit for review

## 🔒 Security Features

- **Biometric Authentication**: Fingerprint/Face ID
- **Encrypted Storage**: Secure data storage
- **Certificate Pinning**: Prevent man-in-the-middle attacks
- **Code Obfuscation**: ProGuard for Android
- **App Signing**: Verified app integrity

## 📊 Analytics & Monitoring

- **Crash Reporting**: Firebase Crashlytics
- **User Analytics**: Firebase Analytics
- **Performance Monitoring**: Firebase Performance
- **Remote Config**: A/B testing and feature flags

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Authentication flows
- [ ] Core features on different screen sizes
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Deep linking
- [ ] App state preservation

## 📈 Performance Optimization

- **Lazy Loading**: Screen and component lazy loading
- **Image Optimization**: Compressed images and lazy loading
- **Memory Management**: Proper cleanup and memory optimization
- **Bundle Splitting**: Code splitting for better performance
- **Caching**: Offline data caching and sync

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build:android
      - uses: actions/upload-artifact@v2
```

## 📱 Device Support

### Minimum Requirements
- **Android**: API 21 (Android 5.0 Lollipop)
- **iOS**: iOS 12.0
- **RAM**: 2GB minimum
- **Storage**: 100MB available space

### Recommended
- **Android**: API 26+ (Android 8.0+)
- **iOS**: iOS 14.0+
- **RAM**: 4GB+
- **Storage**: 500MB+ available space

## 🆘 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build failures**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **iOS build failures**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npx react-native run-ios
   ```

### Performance Issues
- Enable Hermes engine
- Use release builds for testing
- Monitor memory usage
- Optimize images and assets

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**SmartBulk Mobile** - Transform your fitness journey with the power of AI and community support! 💪🚀
