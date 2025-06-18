# OpenWhenVerse Mobile App

A personalized Bible verse companion app that provides comfort and guidance based on your emotions.

## 🚀 Features

- **Emotion-based verses**: Get personalized Bible verses for different emotional states
- **Beautiful UI**: Modern, intuitive design with emotion-themed colors
- **Share functionality**: Share verses with friends and family
- **Cross-platform**: Works on both Android and iOS
- **Offline-ready**: Verses are cached for offline access

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd OpenWhenVerseMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on your phone

## 🏗️ Building for Production

### 1. Set up EAS Build

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure your project**
   ```bash
   eas build:configure
   ```

### 2. Build for Android

1. **Build APK (for testing)**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Build AAB (for Play Store)**
   ```bash
   eas build --platform android --profile production
   ```

### 3. Build for iOS

1. **Build for App Store**
   ```bash
   eas build --platform ios --profile production
   ```

## 📦 Publishing to App Stores

### Google Play Store

1. **Create a Google Play Console account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay the $25 registration fee

2. **Upload your AAB file**
   - Download the AAB from EAS Build
   - Upload to Google Play Console
   - Fill in app details, screenshots, and description

3. **Submit for review**
   - Complete all required fields
   - Submit for Google's review process

### Apple App Store

1. **Create an Apple Developer account**
   - Go to [Apple Developer](https://developer.apple.com)
   - Pay the $99/year fee

2. **Upload your IPA file**
   - Download the IPA from EAS Build
   - Use Xcode or Application Loader to upload
   - Fill in app details in App Store Connect

3. **Submit for review**
   - Complete all required fields
   - Submit for Apple's review process

## 🔧 Configuration

### API Configuration

Update the API base URL in `api.ts`:

```typescript
// For development
const API_BASE_URL = 'http://localhost:5000';

// For production (replace with your server URL)
const API_BASE_URL = 'https://your-server.com';
```

### App Configuration

Update `app.json` with your app details:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

## 📱 App Store Requirements

### Google Play Store
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (minimum 2)
- App description
- Privacy policy URL
- Content rating

### Apple App Store
- App icon (1024x1024 PNG)
- Screenshots for different devices
- App description
- Privacy policy URL
- Content rating
- App Store Connect setup

## 🚀 Deployment Checklist

- [ ] Test app thoroughly on both platforms
- [ ] Update API URL for production
- [ ] Create app store assets (icons, screenshots)
- [ ] Write compelling app description
- [ ] Set up privacy policy
- [ ] Configure app signing certificates
- [ ] Build production versions
- [ ] Submit to app stores
- [ ] Monitor reviews and feedback

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email support@openwhenverse.com or create an issue in this repository. 