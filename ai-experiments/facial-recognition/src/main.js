// Simple AI Facial Recognition Experiments
// Using face-api.js for browser-based face detection

class FacialRecognitionExperiments {
  constructor() {
    // DOM elements
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // State management
    this.isDetecting = false;
    this.modelsLoaded = false;
    this.detectionCount = 0;

    // Configuration
    this.DETECTION_CONFIG = {
      primary: { inputSize: 416, scoreThreshold: 0.2 },
      fallback: { inputSize: 320, scoreThreshold: 0.1 },
      image: { inputSize: 512, scoreThreshold: 0.3 },
    };

    // Emotion to emoji mapping
    this.emotionEmojis = {
      happy: "😄",
      sad: "😢",
      angry: "😠",
      surprised: "😲",
      fearful: "😨",
      disgusted: "🤢",
      neutral: "😐",
    };

    this.init();
  }

  async init() {
    console.log("🤖 Initializing Facial Recognition Experiments");
    this.clearEmotionDisplay(); // Initialize emotion display
    await this.loadModels();
    this.setupEventListeners();
  }

  async loadModels() {
    const status = document.getElementById("status");

    try {
      status.textContent = "Loading face detection models...";
      status.className = "status loading";

      // Load face-api.js models from CDN
      const MODEL_URL =
        "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      this.modelsLoaded = true;
      status.textContent =
        "✅ AI models loaded successfully! Ready to detect faces.";
      status.className = "status success";

      console.log("✅ All face-api.js models loaded");
    } catch (error) {
      console.error("❌ Error loading models:", error);
      status.textContent =
        "❌ Failed to load AI models. Check console for details.";
      status.className = "status error";
    }
  }

  setupEventListeners() {
    // Camera controls
    document
      .getElementById("startCamera")
      .addEventListener("click", () => this.startCamera());
    document
      .getElementById("stopCamera")
      .addEventListener("click", () => this.stopCamera());

    // Image upload
    document
      .getElementById("imageUpload")
      .addEventListener("change", (e) => this.handleImageUpload(e));
    document
      .getElementById("detectInImage")
      .addEventListener("click", () => this.detectInUploadedImage());

    // Face recognition (advanced)
    document
      .getElementById("enableRecognition")
      .addEventListener("click", () => this.enableRecognition());
  }

  async startCamera() {
    if (!this.modelsLoaded) {
      alert("Please wait for AI models to load first.");
      return;
    }

    try {
      // Update emotion display to show camera starting
      const emotionEmojisDiv = document.getElementById("emotionEmojis");
      const emotionTextDiv = document.getElementById("emotionText");
      emotionEmojisDiv.innerHTML =
        '<div style="color: #007bff; font-size: 16px;">📹 Starting camera...</div>';
      emotionTextDiv.innerHTML =
        '<small style="color: #007bff;">Initializing video feed</small>';

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      this.video.srcObject = stream;
      this.video.play();

      document.getElementById("startCamera").disabled = true;
      document.getElementById("stopCamera").disabled = false;

      console.log("📹 Camera started");

      // Test face-api.js availability
      if (typeof faceapi === "undefined") {
        console.error("❌ face-api.js is not loaded!");
        emotionEmojisDiv.innerHTML =
          '<div style="color: #dc3545; font-size: 16px;">❌ API Error</div>';
        emotionTextDiv.innerHTML =
          '<small style="color: #dc3545;">face-api.js not loaded</small>';
        return;
      }

      // Update emotion display to show camera is ready
      emotionEmojisDiv.innerHTML =
        '<div style="color: #28a745; font-size: 16px;">👀 Camera active</div>';
      emotionTextDiv.innerHTML =
        '<small style="color: #28a745;">Looking for faces...</small>';

      // Start face detection loop with improved initialization
      this.video.addEventListener("play", () => {
        console.log(
          "📹 Video started playing, dimensions:",
          this.video.videoWidth,
          "x",
          this.video.videoHeight
        );
        this.isDetecting = true;
        // Wait a moment for video to fully initialize
        setTimeout(() => {
          this.detectFaces();
        }, 500);
      });
    } catch (error) {
      console.error("❌ Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");

      // Update emotion display to show error
      const emotionEmojisDiv = document.getElementById("emotionEmojis");
      const emotionTextDiv = document.getElementById("emotionText");
      emotionEmojisDiv.innerHTML =
        '<div style="color: #dc3545; font-size: 16px;">❌ Camera error</div>';
      emotionTextDiv.innerHTML =
        '<small style="color: #dc3545;">Check camera permissions</small>';
    }
  }

  stopCamera() {
    this.isDetecting = false;
    this.detectionCount = 0; // Reset counter

    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
    }

    document.getElementById("startCamera").disabled = false;
    document.getElementById("stopCamera").disabled = true;

    // Clear canvas and emotion display
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.clearEmotionDisplay();

    console.log("📹 Camera stopped");
  }

  async detectFaces() {
    if (!this.isDetecting || this.video.paused || this.video.ended) {
      return;
    }

    try {
      this.detectionCount++;

      // Show scanning indicator every 30 frames (roughly every second)
      if (this.detectionCount % 30 === 0) {
        const emotionTextDiv = document.getElementById("emotionText");
        if (emotionTextDiv && this.isDetecting) {
          emotionTextDiv.innerHTML = `<small style="color: #28a745;">📹 Scanning... (${Math.floor(
            this.detectionCount / 30
          )}s)</small>`;
        }
      }

      // Add debug info every 60 frames (every 2 seconds)
      if (this.detectionCount % 60 === 0) {
        console.log(
          `🔍 Debug: Frame ${this.detectionCount}, Video ready: ${this.video.readyState}, Video size: ${this.video.videoWidth}x${this.video.videoHeight}`
        );
      }

      // Perform face detection with fallback
      let detections = [];

      try {
        // Primary detection attempt
        detections = await faceapi
          .detectAllFaces(
            this.video,
            new faceapi.TinyFaceDetectorOptions(this.DETECTION_CONFIG.primary)
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        // Fallback detection if no faces found (every second)
        if (detections.length === 0 && this.detectionCount % 30 === 0) {
          detections = await faceapi
            .detectAllFaces(
              this.video,
              new faceapi.TinyFaceDetectorOptions(
                this.DETECTION_CONFIG.fallback
              )
            )
            .withFaceLandmarks()
            .withFaceExpressions();
        }
      } catch (error) {
        console.error("❌ Detection error:", error);
        detections = [];
      }

      // Log detection results periodically
      if (this.detectionCount % 60 === 0 || detections.length > 0) {
        console.log(
          `🔍 Frame ${this.detectionCount}: ${detections.length} face(s) detected`
        );
      }

      // Prepare canvas
      this.drawVideoFrame();
      this.drawScanningIndicator();

      // Update emotion display and draw face overlays
      if (detections.length > 0) {
        this.updateCameraEmotionDisplay(detections);
        this.drawFaceDetections(detections);
      } else {
        this.clearEmotionDisplay();
      }
    } catch (error) {
      console.error("❌ Error in face detection:", error);
    }

    // Continue detection loop
    requestAnimationFrame(() => this.detectFaces());
  }

  // Canvas drawing helper methods
  drawVideoFrame() {
    // Clear canvas for overlay drawing (video element handles the video display)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawScanningIndicator() {
    this.ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
    this.ctx.font = "14px Arial";
    this.ctx.fillText(`🔍 Scanning... Frame ${this.detectionCount}`, 10, 25);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      `Video: ${this.video.videoWidth}x${this.video.videoHeight}`,
      10,
      45
    );
  }

  drawFaceDetections(detections) {
    detections.forEach((detection, index) => {
      const { box } = detection.detection;
      const { expressions, landmarks } = detection;

      this.drawFaceBoundingBox(box, index + 1, detection.detection.score);
      this.drawFaceLandmarks(landmarks);
      this.drawFaceInfo(box, index + 1, detection.detection.score);
      this.drawEmotionInfo(box, expressions);
    });
  }

  drawFaceBoundingBox(box, faceNumber, confidence) {
    // Main bounding box
    this.ctx.strokeStyle = "#00ff00";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Corner markers
    const cornerSize = 15;
    this.ctx.lineWidth = 4;
    const corners = [
      [
        [box.x, box.y + cornerSize],
        [box.x, box.y],
        [box.x + cornerSize, box.y],
      ],
      [
        [box.x + box.width - cornerSize, box.y],
        [box.x + box.width, box.y],
        [box.x + box.width, box.y + cornerSize],
      ],
      [
        [box.x, box.y + box.height - cornerSize],
        [box.x, box.y + box.height],
        [box.x + cornerSize, box.y + box.height],
      ],
      [
        [box.x + box.width - cornerSize, box.y + box.height],
        [box.x + box.width, box.y + box.height],
        [box.x + box.width, box.y + box.height - cornerSize],
      ],
    ];

    corners.forEach((corner) => {
      this.ctx.beginPath();
      this.ctx.moveTo(corner[0][0], corner[0][1]);
      this.ctx.lineTo(corner[1][0], corner[1][1]);
      this.ctx.lineTo(corner[2][0], corner[2][1]);
      this.ctx.stroke();
    });
  }

  drawFaceLandmarks(landmarks) {
    if (landmarks) {
      this.ctx.fillStyle = "#ffff00";
      landmarks.positions.forEach((point) => {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      });
    }
  }

  drawFaceInfo(box, faceNumber, confidence) {
    const infoWidth = 220;
    const infoHeight = 80;
    const infoX = Math.min(box.x, this.canvas.width - infoWidth);
    const infoY = Math.max(0, box.y - infoHeight - 10);

    // Background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(infoX, infoY, infoWidth, infoHeight);

    // Face number and confidence
    this.ctx.fillStyle = "#00ff00";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(`Face ${faceNumber}`, infoX + 10, infoY + 20);

    this.ctx.font = "14px Arial";
    this.ctx.fillText(
      `Confidence: ${Math.round(confidence * 100)}%`,
      infoX + 10,
      infoY + 40
    );

    // Dimensions and position
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      `Size: ${Math.round(box.width)}×${Math.round(box.height)}px`,
      infoX + 10,
      infoY + 55
    );
    this.ctx.fillText(
      `Pos: (${Math.round(box.x)}, ${Math.round(box.y)})`,
      infoX + 10,
      infoY + 70
    );
  }

  drawEmotionInfo(box, expressions) {
    if (!expressions) return;

    const sortedExpressions = Object.entries(expressions).sort(
      ([, a], [, b]) => b - a
    );
    const topExpression = sortedExpressions[0];
    const secondExpression = sortedExpressions[1];

    // Large emoji
    const emoji = this.emotionEmojis[topExpression[0]] || "😐";
    this.ctx.font = "36px Arial";
    this.ctx.fillText(emoji, box.x + box.width + 15, box.y + 40);

    // Emotion info background
    const emotionInfoY = box.y + 50;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(box.x + box.width + 60, emotionInfoY, 150, 60);

    // Primary emotion
    this.ctx.fillStyle = "#00ff00";
    this.ctx.font = "bold 14px Arial";
    this.ctx.fillText(
      topExpression[0].charAt(0).toUpperCase() + topExpression[0].slice(1),
      box.x + box.width + 70,
      emotionInfoY + 20
    );

    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      `${Math.round(topExpression[1] * 100)}% confidence`,
      box.x + box.width + 70,
      emotionInfoY + 35
    );

    // Secondary emotion if significant
    if (secondExpression && secondExpression[1] > 0.2) {
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(
        `Also: ${secondExpression[0]} (${Math.round(
          secondExpression[1] * 100
        )}%)`,
        box.x + box.width + 70,
        emotionInfoY + 50
      );
    }
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const resultDiv = document.getElementById("imageResult");
    resultDiv.innerHTML =
      '<div style="color: #007bff; padding: 10px;">📤 Loading image...</div>';

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.uploadedImage = img;
        console.log("🖼️ Image uploaded:", file.name);

        // Show the uploaded image immediately
        this.displayUploadedImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  displayUploadedImage() {
    const resultDiv = document.getElementById("imageResult");
    resultDiv.innerHTML = "";

    // Create a container for the image and info
    const container = document.createElement("div");
    container.style.cssText =
      "border: 2px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; background: #f9f9f9;";

    // Add image info
    const info = document.createElement("div");
    info.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #28a745;">
        ✅ Image loaded: ${this.uploadedImage.width} x ${this.uploadedImage.height} pixels
      </div>
      <div style="margin-bottom: 15px; color: #666; font-size: 14px;">
        Click "Detect Faces" to analyze this image for faces
      </div>
    `;
    container.appendChild(info);

    // Create and add the image
    const displayImg = document.createElement("img");
    displayImg.src = this.uploadedImage.src;
    displayImg.style.cssText =
      "max-width: 100%; max-height: 400px; border: 1px solid #ccc; border-radius: 4px; display: block;";
    container.appendChild(displayImg);

    resultDiv.appendChild(container);
  }

  async detectInUploadedImage() {
    if (!this.uploadedImage || !this.modelsLoaded) {
      alert("Please upload an image and wait for models to load.");
      return;
    }

    const resultDiv = document.getElementById("imageResult");

    // Show loading state
    resultDiv.innerHTML = `
      <div style="border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 10px 0; background: #e7f3ff; text-align: center;">
        <div style="color: #007bff; font-size: 18px; margin-bottom: 10px;">🔍 Analyzing image...</div>
        <div style="color: #666; font-size: 14px;">Detecting faces and emotions</div>
      </div>
    `;

    try {
      console.log(
        `🖼️ Analyzing image: ${this.uploadedImage.width}x${this.uploadedImage.height}px`
      );

      // Perform face detection on uploaded image
      const detections = await faceapi
        .detectAllFaces(
          this.uploadedImage,
          new faceapi.TinyFaceDetectorOptions(this.DETECTION_CONFIG.image)
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      console.log(
        `🎯 Analysis complete: ${detections.length} face(s) detected`
      );

      // Clear loading state
      resultDiv.innerHTML = "";

      // Create result container
      const container = document.createElement("div");
      container.style.cssText =
        "border: 2px solid #28a745; border-radius: 8px; padding: 15px; margin: 10px 0; background: #f8fff9;";

      // Add analysis header
      const header = document.createElement("div");
      header.innerHTML = `
        <div style="color: #28a745; font-size: 18px; font-weight: bold; margin-bottom: 15px;">
          🎯 Analysis Results: ${detections.length} face${
        detections.length !== 1 ? "s" : ""
      } detected
        </div>
      `;
      container.appendChild(header);

      // Create canvas for visualization
      const canvas = document.createElement("canvas");
      const maxDisplayWidth = 600;
      const scale = Math.min(1, maxDisplayWidth / this.uploadedImage.width);

      canvas.width = this.uploadedImage.width * scale;
      canvas.height = this.uploadedImage.height * scale;
      canvas.style.cssText =
        "border: 2px solid #ddd; border-radius: 4px; max-width: 100%; display: block;";

      const ctx = canvas.getContext("2d");

      // Draw scaled image
      ctx.drawImage(this.uploadedImage, 0, 0, canvas.width, canvas.height);

      // Create detailed results
      const detailsDiv = document.createElement("div");
      detailsDiv.style.cssText = "margin-top: 15px;";

      if (detections.length === 0) {
        detailsDiv.innerHTML = `
          <div style="color: #ffc107; background: #fff8e1; padding: 15px; border-radius: 4px; border: 1px solid #ffc107;">
            <strong>⚠️ No faces detected in this image</strong><br><br>
            <strong>Troubleshooting tips:</strong><br>
            • Make sure faces are clearly visible and not too small<br>
            • Try images with faces facing forward<br>
            • Ensure good lighting and contrast<br>
            • Face should be at least 50x50 pixels in size<br><br>
            <em>Detection settings: Input size 512px, Score threshold 0.3</em>
          </div>
        `;
      } else {
        // Draw face detection boxes and landmarks
        detections.forEach((detection, index) => {
          const { box } = detection.detection;
          const { expressions, landmarks } = detection;

          // Scale coordinates
          const scaledBox = {
            x: box.x * scale,
            y: box.y * scale,
            width: box.width * scale,
            height: box.height * scale,
          };

          // Draw bounding box
          ctx.strokeStyle = "#ff0000";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            scaledBox.x,
            scaledBox.y,
            scaledBox.width,
            scaledBox.height
          );

          // Draw face label with confidence
          ctx.fillStyle = "#ff0000";
          ctx.font = `${Math.max(14, 16 * scale)}px Arial`;
          ctx.fillText(
            `Face ${index + 1} (${Math.round(
              detection.detection.score * 100
            )}%)`,
            scaledBox.x,
            scaledBox.y - 8
          );

          // Draw landmarks if available
          if (landmarks) {
            ctx.fillStyle = "#00ff00";
            landmarks.positions.forEach((point) => {
              ctx.beginPath();
              ctx.arc(point.x * scale, point.y * scale, 2, 0, 2 * Math.PI);
              ctx.fill();
            });
          }

          // Draw top emotion
          if (expressions) {
            const topEmotion = Object.entries(expressions).sort(
              ([, a], [, b]) => b - a
            )[0];
            const emoji = this.emotionEmojis[topEmotion[0]] || "😐";

            ctx.font = `${Math.max(20, 24 * scale)}px Arial`;
            ctx.fillText(
              emoji,
              scaledBox.x + scaledBox.width + 10,
              scaledBox.y + 30
            );
          }
        });

        // Create detailed breakdown
        let detailsHTML = `
          <div style="background: #f0f8ff; padding: 15px; border-radius: 4px; border: 1px solid #007bff;">
            <strong>📊 Detailed Analysis:</strong><br><br>
        `;

        detections.forEach((detection, index) => {
          const { box, score } = detection.detection;
          const { expressions } = detection;

          detailsHTML += `
            <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;">
              <strong>Face ${index + 1}:</strong><br>
              • Position: (${Math.round(box.x)}, ${Math.round(box.y)})<br>
              • Size: ${Math.round(box.width)} x ${Math.round(
            box.height
          )} pixels<br>
              • Confidence: ${Math.round(score * 100)}%<br>
          `;

          if (expressions) {
            const sortedEmotions = Object.entries(expressions)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3); // Top 3 emotions

            detailsHTML += `• <strong>Top emotions:</strong><br>`;
            sortedEmotions.forEach(([emotion, confidence]) => {
              const emoji = this.emotionEmojis[emotion] || "😐";
              detailsHTML += `&nbsp;&nbsp;${emoji} ${emotion}: ${Math.round(
                confidence * 100
              )}%<br>`;
            });
          }

          detailsHTML += `</div>`;
        });

        detailsHTML += `</div>`;
        detailsDiv.innerHTML = detailsHTML;
      }

      container.appendChild(canvas);
      container.appendChild(detailsDiv);
      resultDiv.appendChild(container);

      console.log(`🖼️ Image analysis visualization complete`);
    } catch (error) {
      console.error("❌ Error analyzing image:", error);
      resultDiv.innerHTML = `
        <div style="border: 2px solid #dc3545; border-radius: 8px; padding: 20px; margin: 10px 0; background: #fff5f5;">
          <div style="color: #dc3545; font-size: 18px; margin-bottom: 10px;">❌ Analysis Failed</div>
          <div style="color: #666; font-size: 14px;">
            Error: ${error.message}<br>
            Check browser console for more details.
          </div>
        </div>
      `;
    }
  }

  enableRecognition() {
    alert(
      "Face recognition requires additional setup with training data. Check the README.md for advanced examples."
    );
    console.log("🔍 Face recognition feature would require:");
    console.log("1. Training data (images of known people)");
    console.log("2. Face descriptors generation");
    console.log("3. Face matching algorithms");
    console.log("4. Database of known faces");
  }

  updateCameraEmotionDisplay(detections) {
    const emotionEmojisDiv = document.getElementById("emotionEmojis");
    const emotionTextDiv = document.getElementById("emotionText");

    if (!detections || detections.length === 0) {
      this.clearEmotionDisplay();
      return;
    }

    // Show primary face emotion with count
    const primaryDetection = detections[0];
    const primaryExpressions = primaryDetection.expressions;

    if (primaryExpressions) {
      const sortedExpressions = Object.entries(primaryExpressions).sort(
        ([, a], [, b]) => b - a
      );
      const topEmotion = sortedExpressions[0];
      const emoji = this.emotionEmojis[topEmotion[0]] || "😐";

      // Display main emoji with face count
      if (detections.length === 1) {
        emotionEmojisDiv.innerHTML = emoji;
      } else {
        emotionEmojisDiv.innerHTML = `${emoji}<span style="font-size: 16px; color: #666;"> +${
          detections.length - 1
        }</span>`;
      }

      // Create detailed breakdown for all faces
      let detailsHTML = `<strong>📊 Live Analysis (${detections.length} face${
        detections.length !== 1 ? "s" : ""
      }):</strong><br><br>`;

      detections.forEach((detection, index) => {
        const { expressions } = detection;
        const { box, score } = detection.detection;

        if (expressions) {
          const sortedEmotions = Object.entries(expressions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2); // Top 2 emotions

          const faceEmoji = this.emotionEmojis[sortedEmotions[0][0]] || "😐";
          detailsHTML += `<div style="margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">`;
          detailsHTML += `<strong>${faceEmoji} Face ${
            index + 1
          }</strong> (${Math.round(score * 100)}%)<br>`;

          sortedEmotions.forEach(([emotion, confidence]) => {
            if (confidence > 0.15) {
              // Show emotions above 15%
              detailsHTML += `&nbsp;&nbsp;${emotion}: ${Math.round(
                confidence * 100
              )}%<br>`;
            }
          });

          detailsHTML += `&nbsp;&nbsp;<small>Size: ${Math.round(
            box.width
          )}×${Math.round(box.height)}px</small><br>`;
          detailsHTML += `</div>`;
        }
      });

      emotionTextDiv.innerHTML = detailsHTML;
    } else {
      this.clearEmotionDisplay();
    }
  }

  clearEmotionDisplay() {
    const emotionEmojisDiv = document.getElementById("emotionEmojis");
    const emotionTextDiv = document.getElementById("emotionText");

    if (emotionEmojisDiv) {
      // Show different messages based on camera state
      if (this.isDetecting) {
        emotionEmojisDiv.innerHTML =
          '<div style="color: #ffc107; font-size: 16px;">🔍 Searching...</div>';
        emotionTextDiv.innerHTML =
          '<small style="color: #ffc107;">Camera active - Move closer or look at camera</small>';
      } else {
        emotionEmojisDiv.innerHTML =
          '<div style="color: #999; font-size: 16px;">😐 No emotions detected</div>';
        emotionTextDiv.innerHTML =
          '<small style="color: #666;">Start camera to detect emotions</small>';
      }
    }

    if (emotionTextDiv && !this.isDetecting) {
      emotionTextDiv.innerHTML =
        '<small style="color: #666;">Start camera to detect emotions</small>';
    }
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Load face-api.js from CDN
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
  script.onload = () => {
    console.log("📦 face-api.js loaded from CDN");
    new FacialRecognitionExperiments();
  };
  script.onerror = () => {
    console.error("❌ Failed to load face-api.js from CDN");
    document.getElementById("status").textContent =
      "❌ Failed to load required libraries.";
    document.getElementById("status").className = "status error";
  };
  document.head.appendChild(script);
});

// Export for potential module use
export default FacialRecognitionExperiments;
