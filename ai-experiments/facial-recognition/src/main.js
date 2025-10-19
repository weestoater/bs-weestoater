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

    // Scaling factors for canvas/video coordinate mapping
    this.scaleX = 1;
    this.scaleY = 1;

    // Mood analysis state
    this.isMoodAnalyzing = false;
    this.moodData = [];
    this.analysisStartTime = null;
    this.analysisInterval = null;
    this.countdownInterval = null;
    this.moodChart = null;
    this.moodChartCtx = null;

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
    this.initializeMoodChart();
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
      ?.addEventListener("click", () => this.enableRecognition());

    // Mood analysis controls
    document
      .getElementById("startMoodAnalysis")
      .addEventListener("click", () => this.startMoodAnalysis());
    document
      .getElementById("stopMoodAnalysis")
      .addEventListener("click", () => this.stopMoodAnalysis());
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
      document.getElementById("startMoodAnalysis").disabled = false;

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

        // Synchronize canvas dimensions with video dimensions
        this.syncCanvasWithVideo();

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
    document.getElementById("startMoodAnalysis").disabled = true;

    // Stop mood analysis if running
    if (this.isMoodAnalyzing) {
      this.stopMoodAnalysis();
    }

    // Clear canvas and emotion display
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.clearEmotionDisplay();

    console.log("📹 Camera stopped");
  }

  syncCanvasWithVideo() {
    // Get the actual displayed size of the video element
    const videoRect = this.video.getBoundingClientRect();
    const videoDisplayWidth = this.video.offsetWidth;
    const videoDisplayHeight = this.video.offsetHeight;

    // Get the actual video stream dimensions
    const videoStreamWidth = this.video.videoWidth;
    const videoStreamHeight = this.video.videoHeight;

    console.log("🔄 Syncing canvas with video:");
    console.log(
      "  Video stream dimensions:",
      videoStreamWidth,
      "x",
      videoStreamHeight
    );
    console.log(
      "  Video display dimensions:",
      videoDisplayWidth,
      "x",
      videoDisplayHeight
    );

    // Set canvas dimensions to match the video display size
    this.canvas.width = videoDisplayWidth;
    this.canvas.height = videoDisplayHeight;

    // Also set the CSS dimensions to match
    this.canvas.style.width = videoDisplayWidth + "px";
    this.canvas.style.height = videoDisplayHeight + "px";

    // Calculate scaling factors for face detection coordinates
    this.scaleX = videoDisplayWidth / videoStreamWidth;
    this.scaleY = videoDisplayHeight / videoStreamHeight;

    console.log(
      "  Canvas dimensions set to:",
      this.canvas.width,
      "x",
      this.canvas.height
    );
    console.log("  Scale factors - X:", this.scaleX, ", Y:", this.scaleY);
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
    // Apply scaling to coordinates
    const scaledBox = {
      x: box.x * (this.scaleX || 1),
      y: box.y * (this.scaleY || 1),
      width: box.width * (this.scaleX || 1),
      height: box.height * (this.scaleY || 1),
    };

    // Main bounding box
    this.ctx.strokeStyle = "#00ff00";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(
      scaledBox.x,
      scaledBox.y,
      scaledBox.width,
      scaledBox.height
    );

    // Corner markers
    const cornerSize = 15;
    this.ctx.lineWidth = 4;
    const corners = [
      [
        [scaledBox.x, scaledBox.y + cornerSize],
        [scaledBox.x, scaledBox.y],
        [scaledBox.x + cornerSize, scaledBox.y],
      ],
      [
        [scaledBox.x + scaledBox.width - cornerSize, scaledBox.y],
        [scaledBox.x + scaledBox.width, scaledBox.y],
        [scaledBox.x + scaledBox.width, scaledBox.y + cornerSize],
      ],
      [
        [scaledBox.x, scaledBox.y + scaledBox.height - cornerSize],
        [scaledBox.x, scaledBox.y + scaledBox.height],
        [scaledBox.x + cornerSize, scaledBox.y + scaledBox.height],
      ],
      [
        [
          scaledBox.x + scaledBox.width - cornerSize,
          scaledBox.y + scaledBox.height,
        ],
        [scaledBox.x + scaledBox.width, scaledBox.y + scaledBox.height],
        [
          scaledBox.x + scaledBox.width,
          scaledBox.y + scaledBox.height - cornerSize,
        ],
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
        const scaledX = point.x * (this.scaleX || 1);
        const scaledY = point.y * (this.scaleY || 1);
        this.ctx.beginPath();
        this.ctx.arc(scaledX, scaledY, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      });
    }
  }

  drawFaceInfo(box, faceNumber, confidence) {
    // Apply scaling to coordinates
    const scaledBox = {
      x: box.x * (this.scaleX || 1),
      y: box.y * (this.scaleY || 1),
      width: box.width * (this.scaleX || 1),
      height: box.height * (this.scaleY || 1),
    };

    const infoWidth = 220;
    const infoHeight = 80;
    const infoX = Math.min(scaledBox.x, this.canvas.width - infoWidth);
    const infoY = Math.max(0, scaledBox.y - infoHeight - 10);

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
      `Size: ${Math.round(scaledBox.width)}×${Math.round(scaledBox.height)}px`,
      infoX + 10,
      infoY + 55
    );
    this.ctx.fillText(
      `Pos: (${Math.round(scaledBox.x)}, ${Math.round(scaledBox.y)})`,
      infoX + 10,
      infoY + 70
    );
  }

  drawEmotionInfo(box, expressions) {
    if (!expressions) return;

    // Apply scaling to coordinates
    const scaledBox = {
      x: box.x * (this.scaleX || 1),
      y: box.y * (this.scaleY || 1),
      width: box.width * (this.scaleX || 1),
      height: box.height * (this.scaleY || 1),
    };

    const sortedExpressions = Object.entries(expressions).sort(
      ([, a], [, b]) => b - a
    );
    const topExpression = sortedExpressions[0];
    const secondExpression = sortedExpressions[1];

    // Large emoji
    const emoji = this.emotionEmojis[topExpression[0]] || "😐";
    this.ctx.font = "36px Arial";
    this.ctx.fillText(
      emoji,
      scaledBox.x + scaledBox.width + 15,
      scaledBox.y + 40
    );

    // Emotion info background
    const emotionInfoY = scaledBox.y + 50;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(
      scaledBox.x + scaledBox.width + 60,
      emotionInfoY,
      150,
      60
    );

    // Primary emotion
    this.ctx.fillStyle = "#00ff00";
    this.ctx.font = "bold 14px Arial";
    this.ctx.fillText(
      topExpression[0].charAt(0).toUpperCase() + topExpression[0].slice(1),
      scaledBox.x + scaledBox.width + 70,
      emotionInfoY + 20
    );

    this.ctx.font = "12px Arial";
    this.ctx.fillText(
      `${Math.round(topExpression[1] * 100)}% confidence`,
      scaledBox.x + scaledBox.width + 70,
      emotionInfoY + 35
    );

    // Secondary emotion if significant
    if (secondExpression && secondExpression[1] > 0.2) {
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(
        `Also: ${secondExpression[0]} (${Math.round(
          secondExpression[1] * 100
        )}%)`,
        scaledBox.x + scaledBox.width + 70,
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

  // Mood Analysis Methods
  initializeMoodChart() {
    this.moodChart = document.getElementById("moodChart");
    this.moodChartCtx = this.moodChart.getContext("2d");
    this.drawEmptyChart();
  }

  drawEmptyChart() {
    const ctx = this.moodChartCtx;
    const width = this.moodChart.width;
    const height = this.moodChart.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (height - 40) * (i / 4) + 20;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = (width - 60) * (i / 6) + 40;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // X-axis labels (time)
    for (let i = 0; i <= 6; i++) {
      const x = (width - 60) * (i / 6) + 40;
      ctx.fillText(`${i * 5}s`, x, height - 5);
    }

    // Y-axis labels (confidence)
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = (height - 40) * (i / 4) + 25;
      ctx.fillText(`${(1 - i / 4) * 100}%`, 35, y);
    }

    // Title
    ctx.textAlign = "center";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText("Mood Over Time", width / 2, 15);
  }

  startMoodAnalysis() {
    if (!this.isDetecting) {
      alert("Please start the camera first!");
      return;
    }

    this.isMoodAnalyzing = true;
    this.moodData = [];
    this.analysisStartTime = Date.now();

    // Update UI
    document.getElementById("startMoodAnalysis").disabled = true;
    document.getElementById("stopMoodAnalysis").disabled = false;

    // Start countdown
    this.startCountdown();

    // Collect mood data every 5 seconds
    this.analysisInterval = setInterval(() => {
      this.collectMoodDataPoint();
    }, 5000);

    // Stop analysis after 30 seconds
    setTimeout(() => {
      if (this.isMoodAnalyzing) {
        this.stopMoodAnalysis();
      }
    }, 30000);

    console.log("📊 Started 30-second mood analysis");
  }

  stopMoodAnalysis() {
    this.isMoodAnalyzing = false;

    // Clear intervals
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // Update UI
    document.getElementById("startMoodAnalysis").disabled = false;
    document.getElementById("stopMoodAnalysis").disabled = true;
    document.getElementById("analysisCountdown").textContent =
      "Analysis complete";

    // Generate summary
    this.generateMoodSummary();

    console.log("📊 Mood analysis stopped");
  }

  startCountdown() {
    const updateCountdown = () => {
      if (!this.isMoodAnalyzing) return;

      const elapsed = Date.now() - this.analysisStartTime;
      const remaining = Math.max(0, 30000 - elapsed);
      const seconds = Math.ceil(remaining / 1000);

      const countdownElement = document.getElementById("analysisCountdown");
      if (seconds > 0) {
        countdownElement.innerHTML = `
          <div style="color: #007bff; font-weight: bold;">
            ⏱️ Analyzing: ${seconds}s remaining
          </div>
          <div style="font-size: 12px; color: #666;">
            Data points: ${this.moodData.length}/6
          </div>
        `;
      } else {
        countdownElement.textContent = "Processing results...";
      }
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  getCurrentDominantEmotion() {
    // Get the most recent face detection data from the emotion display
    const emotionTextDiv = document.getElementById("emotionText");

    // Parse current emotion from the display
    const textContent = emotionTextDiv.textContent;
    if (textContent && textContent.includes(":")) {
      const lines = textContent.split("\n");
      for (let line of lines) {
        if (line.includes(":") && line.includes("%")) {
          const match = line.match(/(\w+):\s*(\d+)%/);
          if (match) {
            return {
              emotion: match[1],
              confidence: parseInt(match[2]) / 100,
            };
          }
        }
      }
    }

    return { emotion: "neutral", confidence: 0.5 };
  }

  collectMoodDataPoint() {
    if (!this.isMoodAnalyzing) return;

    const currentEmotion = this.getCurrentDominantEmotion();
    const timePoint = this.moodData.length * 5; // 0, 5, 10, 15, 20, 25 seconds

    this.moodData.push({
      time: timePoint,
      emotion: currentEmotion.emotion,
      confidence: currentEmotion.confidence,
      timestamp: Date.now(),
    });

    console.log(
      `📊 Collected mood data point ${this.moodData.length}: ${
        currentEmotion.emotion
      } (${Math.round(currentEmotion.confidence * 100)}%)`
    );

    // Update chart
    this.updateMoodChart();
  }

  updateMoodChart() {
    const ctx = this.moodChartCtx;
    const width = this.moodChart.width;
    const height = this.moodChart.height;

    // Redraw empty chart
    this.drawEmptyChart();

    if (this.moodData.length === 0) return;

    // Define emotion colors
    const emotionColors = {
      happy: "#28a745",
      sad: "#6c757d",
      angry: "#dc3545",
      surprised: "#ffc107",
      fearful: "#6f42c1",
      disgusted: "#20c997",
      neutral: "#007bff",
    };

    // Draw data points and lines
    ctx.lineWidth = 3;

    const emotions = [...new Set(this.moodData.map((d) => d.emotion))];

    emotions.forEach((emotion) => {
      const emotionData = this.moodData.filter((d) => d.emotion === emotion);
      if (emotionData.length === 0) return;

      ctx.strokeStyle = emotionColors[emotion] || "#000";
      ctx.fillStyle = emotionColors[emotion] || "#000";

      // Draw line
      ctx.beginPath();
      emotionData.forEach((point, index) => {
        const x = (width - 60) * (point.time / 30) + 40;
        const y = (height - 40) * (1 - point.confidence) + 20;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      emotionData.forEach((point) => {
        const x = (width - 60) * (point.time / 30) + 40;
        const y = (height - 40) * (1 - point.confidence) + 20;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Add emoji above point
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        const emoji = this.emotionEmojis[emotion] || "😐";
        ctx.fillText(emoji, x, y - 8);
      });
    });
  }

  generateMoodSummary() {
    if (this.moodData.length === 0) {
      document.getElementById("moodSummary").innerHTML =
        "<em>No mood data collected during analysis</em>";
      return;
    }

    // Calculate dominant emotion
    const emotionCounts = {};
    let totalConfidence = 0;

    this.moodData.forEach((point) => {
      emotionCounts[point.emotion] = (emotionCounts[point.emotion] || 0) + 1;
      totalConfidence += point.confidence;
    });

    const dominantEmotion = Object.entries(emotionCounts).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    const avgConfidence = totalConfidence / this.moodData.length;
    const dominantEmoji = this.emotionEmojis[dominantEmotion] || "😐";

    // Detect mood trends
    let trend = "stable";
    if (this.moodData.length >= 3) {
      const firstHalf = this.moodData.slice(
        0,
        Math.floor(this.moodData.length / 2)
      );
      const secondHalf = this.moodData.slice(
        Math.floor(this.moodData.length / 2)
      );

      const firstAvg =
        firstHalf.reduce((sum, p) => sum + p.confidence, 0) / firstHalf.length;
      const secondAvg =
        secondHalf.reduce((sum, p) => sum + p.confidence, 0) /
        secondHalf.length;

      if (secondAvg > firstAvg + 0.1) trend = "improving";
      else if (secondAvg < firstAvg - 0.1) trend = "declining";
    }

    const summaryHTML = `
      <div style="background: #f0f8ff; padding: 12px; border-radius: 6px; border: 1px solid #007bff;">
        <div style="font-weight: bold; color: #007bff; margin-bottom: 8px;">
          📊 30-Second Analysis Summary
        </div>
        <div style="margin-bottom: 6px;">
          <strong>Dominant Mood:</strong> ${dominantEmoji} ${
      dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)
    }
        </div>
        <div style="margin-bottom: 6px;">
          <strong>Average Confidence:</strong> ${Math.round(
            avgConfidence * 100
          )}%
        </div>
        <div style="margin-bottom: 6px;">
          <strong>Mood Trend:</strong> ${
            trend.charAt(0).toUpperCase() + trend.slice(1)
          }
        </div>
        <div style="font-size: 12px; color: #666;">
          Data points collected: ${this.moodData.length}/6
        </div>
      </div>
    `;

    document.getElementById("moodSummary").innerHTML = summaryHTML;

    console.log("📊 Mood summary generated:", {
      dominantEmotion,
      avgConfidence: Math.round(avgConfidence * 100),
      trend,
      dataPoints: this.moodData.length,
    });
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
