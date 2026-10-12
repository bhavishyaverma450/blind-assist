# BlindAssist 🔊

### Every Word Within Reach.

BlindAssist is an accessibility-focused mobile application designed to help visually impaired people read printed text independently. Users can capture a picture of text using their phone's camera, extract the text using Optical Character Recognition (OCR), and listen to the extracted content through text-to-speech audio playback.

The goal of BlindAssist is to make everyday reading more accessible, convenient, and inclusive.

## ✨ Features

- **📸 Capture Text:** Take pictures of printed text using your phone's camera.
- **🔍 Optical Character Recognition (OCR):** Extract readable text from captured images.
- **🔊 Text-to-Speech:** Convert extracted text into spoken audio.
- **🔁 Repeat Audio:** Listen to the extracted text again whenever needed.
- **🗣️ Voice Selection:** Choose between available voice options, if supported by the device.
- **♿ Accessibility-Focused Design:** Help visually impaired users access printed information more independently.

## 🛠️ Tech Stack

- **Framework:** React Native
- **Development Platform:** Expo
- **Language:** JavaScript
- **Image Capture:** Expo Image Picker
- **Image Processing:** Expo Image Manipulator
- **OCR:** OCR.space API
- **Text-to-Speech:** Expo Speech

## ⚙️ Getting Started

Follow these steps to run BlindAssist locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Git
- Expo Go on your compatible mobile device, or an appropriate Android/iOS development environment

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/bhavishyaverma450/blind-assist.git
```

**2. Navigate to the project directory**

```bash
cd blind-assist
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

If the application uses an OCR.space API key, configure it according to your project's implementation. Never commit API keys or other secrets to GitHub.

**5. Start the development server**

```bash
npx expo start
```

Follow the Expo instructions to open the app on a compatible device or emulator.

## 📱 How It Works

1. Open BlindAssist on your mobile device.
2. Capture a picture containing printed text.
3. The app sends the image for OCR processing.
4. The extracted text is displayed or processed by the application.
5. Text-to-speech reads the extracted content aloud.
6. Replay the audio when needed.

## 🎯 Purpose

BlindAssist aims to reduce barriers to accessing printed information for visually impaired users. By combining camera-based image capture, OCR, and speech synthesis, it provides a practical assistive reading experience on a mobile device.

## 🔮 Future Enhancements

- Improve recognition accuracy in different lighting conditions.
- Support multiple languages.
- Add offline text recognition.
- Improve screen-reader compatibility and voice-guided navigation.
- Add document scanning and text-to-speech history.

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome. If you would like to improve BlindAssist, feel free to fork the repository and submit a pull request.

## 👨‍💻 Author

**Bhavishya Verma**

GitHub: [@bhavishyaverma450](https://github.com/bhavishyaverma450)

---

*BlindAssist — Making printed words accessible through sound.*
