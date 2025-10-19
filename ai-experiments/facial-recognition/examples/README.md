# Example Facial Recognition Experiments

This folder contains working examples and proof-of-concepts for different AI facial recognition approaches.

## 📁 Examples Structure

- `basic-detection/` - Simple face detection examples
- `advanced-recognition/` - Face recognition with training data
- `emotion-detection/` - Facial expression analysis
- `landmark-detection/` - Facial feature point detection
- `react-integration/` - React components for face recognition

## 🚀 Quick Start Examples

### Example 1: Basic Face Detection

```javascript
// Detect faces in an image
const detections = await faceapi.detectAllFaces(image);
console.log(`Found ${detections.length} faces`);
```

### Example 2: With Expressions

```javascript
// Detect faces with emotion analysis
const detections = await faceapi.detectAllFaces(image).withFaceExpressions();

detections.forEach((detection) => {
  const expressions = detection.expressions;
  const emotion = Object.keys(expressions).reduce((a, b) =>
    expressions[a] > expressions[b] ? a : b
  );
  console.log(`Detected emotion: ${emotion}`);
});
```

### Example 3: Face Landmarks

```javascript
// Detect 68 facial landmarks
const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();

detections.forEach((detection) => {
  const landmarks = detection.landmarks;
  // landmarks.getJawOutline() - jaw points
  // landmarks.getLeftEye() - left eye points
  // landmarks.getRightEye() - right eye points
  // landmarks.getNose() - nose points
  // landmarks.getMouth() - mouth points
});
```

## 🔧 Integration Examples

### React Component Example

```jsx
import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

function FaceDetectionComponent() {
  const videoRef = useRef();
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const handleVideoPlay = () => {
    const detectFaces = async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      setDetections(detections);
    };

    setInterval(detectFaces, 100);
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        onPlay={handleVideoPlay}
        width="640"
        height="480"
      />
      <p>Faces detected: {detections.length}</p>
    </div>
  );
}
```

## 📱 Camera Integration Tips

1. **getUserMedia()** - Access webcam
2. **MediaRecorder** - Record video streams
3. **Canvas** - Draw detection overlays
4. **RequestAnimationFrame** - Smooth real-time detection

## 🎯 Use Case Examples

- **Security Systems** - Access control
- **Photo Organization** - Auto-tag people
- **AR Filters** - Snap/Instagram style effects
- **Accessibility** - Face-controlled interfaces
- **Analytics** - Demographic analysis
- **Gaming** - Face-controlled games
