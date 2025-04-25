import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

let detector;
let squatCounter = 0;
let pushupCounter = 0;
let squatDown = false;
let pushupDown = false;

let lastFeedbackTime = 0;
let lastPose = null;
let lastMovementTime = Date.now();
let lastIdleVoiceTime = Date.now();
let lastSpokenFeedback = '';
let currentFeedback = '';
let feedbackDisplayTimeout = null;

let lastDetected = 'None';  
let consistentCounter = 0; 
const CONSISTENCY_THRESHOLD = 5;  

export async function initCamera(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    });
    videoElement.srcObject = stream;

    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play().then(resolve).catch(resolve);
      };
    });
  } catch (error) {
    console.error("Camera initialization error:", error);
    throw error;
  }
}

export async function loadModel() {
  try {
    await tf.setBackend('webgl');
    await tf.ready();
    detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
      modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
  } catch (error) {
    console.error("Model loading error:", error);
    throw error;
  }
}

function calculateAngle(p1, p2, p3) {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}

function speak(message) {
  if (window.speechSynthesis && message !== lastSpokenFeedback) {
    const now = Date.now();
    if (now - lastFeedbackTime < 3000) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);

    lastFeedbackTime = now;
    lastSpokenFeedback = message;
  }
}

export async function detectPose(videoElement, callback) {
  if (!detector || !videoElement || videoElement.readyState < 2) {
    return;
  }

  try {
    const poses = await detector.estimatePoses(videoElement);
    const now = Date.now();

    if (poses.length === 0 || !poses[0].keypoints) {
      checkIdleState();
      callback({
        detected: 'None',
        squatCounter,
        pushupCounter,
        feedback: currentFeedback,
      });
    }

    const keypoints = poses[0].keypoints;

    // Detect movement to prevent idle detection
    if (lastPose) {
      const movement = checkMovement(keypoints, lastPose.keypoints);
      if (movement > 2.5) {
        lastMovementTime = now;
      }
    }
    lastPose = poses[0];

    // Idle feedback
    if (now - lastMovementTime > 5000) {
      if (now - lastIdleVoiceTime > 8000) {
        currentFeedback = "Are you there? Keep moving!";
        speak(currentFeedback);
        lastIdleVoiceTime = now;
      }
      return callback({
        detected: 'None',
        squatCounter,
        pushupCounter,
        feedback: currentFeedback,
      });
    }

    const result = analyzeWorkoutForm(keypoints, now);

    // Manage feedback display timing
    if (result.feedback && result.feedback !== currentFeedback) {
      currentFeedback = result.feedback;
      clearTimeout(feedbackDisplayTimeout);
      feedbackDisplayTimeout = setTimeout(() => {
        currentFeedback = '';
      }, 2500);
    }

    callback({
      detected: result.detected,
      squatCounter,
      pushupCounter,
      feedback: currentFeedback,
    });

  } catch (error) {
    console.error("Pose detection error:", error);
    callback({
      detected: 'Error',
      squatCounter,
      pushupCounter,
      feedback: "Detection error occurred",
    });
  }
}

function checkMovement(currentKeypoints, previousKeypoints) {
  let totalMovement = 0;
  let validPoints = 0;

  currentKeypoints.forEach((keypoint, i) => {
    const prev = previousKeypoints[i];
    if (keypoint.score > 0.3 && prev.score > 0.3) {
      const dx = keypoint.x - prev.x;
      const dy = keypoint.y - prev.y;
      totalMovement += Math.sqrt(dx * dx + dy * dy);
      validPoints++;
    }
  });

  return validPoints > 0 ? totalMovement / validPoints : 0;
}

function getKeypoint(keypoints, name) {
  return keypoints.find(k => k.name === name || k.part === name);
}

function getAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}
let detectedState = 'None';  // Keeps track of the last stable detected state
let detectedStableCount = 0; // Counter to track how many frames the pose has been stable

function analyzeWorkoutForm(keypoints, now) {
  const leftHip = getKeypoint(keypoints, 'left_hip');
  const leftKnee = getKeypoint(keypoints, 'left_knee');
  const leftAnkle = getKeypoint(keypoints, 'left_ankle');

  const leftShoulder = getKeypoint(keypoints, 'left_shoulder');
  const leftElbow = getKeypoint(keypoints, 'left_elbow');
  const leftWrist = getKeypoint(keypoints, 'left_wrist');

  let detected = 'None';
  let feedback = '';

  // **Squat Logic**: Track lower body (hip, knee, ankle)
  if (leftHip && leftKnee && leftAnkle) {
    const squatAngle = getAngle(leftHip, leftKnee, leftAnkle);

    if (squatAngle > 30 && squatAngle < 120) {
      detected = 'Squat';
      if (!squatDown) {
        squatDown = true;
        feedback = 'Lower your hips more';  // Squat feedback
      }
    } else if (squatAngle >= 160 && squatDown) {
      if (currentFeedback === '') {
        squatCounter += 1;
        speak('Nice squat');
      }
      squatDown = false;
      feedback = '';  // Reset feedback after squat is counted
    }
  }

  // **Push-up Logic**: Track upper body (shoulder, elbow, wrist)
  if (leftShoulder && leftElbow && leftWrist) {
    const pushupAngle = getAngle(leftShoulder, leftElbow, leftWrist);

    if (pushupAngle > 30 && pushupAngle < 100) {
      detected = 'Push-up';
      if (!pushupDown) {
        pushupDown = true;
        feedback = 'Go lower for full push-up';  // Push-up feedback
      }
    } else if (pushupAngle >= 160 && pushupDown) {
      if (currentFeedback === '') {
        pushupCounter += 1;
        speak('Great push-up');
      }
      pushupDown = false;
      feedback = '';  // Reset feedback after push-up is counted
    }
  }

  // **Detect Stable Pose**:
  // If detected pose is consistent for more than 3 frames, set it as the detected state
  if (detected === detectedState) {
    detectedStableCount++;
  } else {
    detectedStableCount = 0;  // Reset if the pose changes
    detectedState = detected; // Update the detected state
  }

  // If the pose has been stable for 3 or more frames, allow the state to change
  if (detectedStableCount >= 3) {
    // Send the stable detected state to the callback
    return { detected, feedback };
  }

  return { detected: detectedState, feedback };  // Return the last stable state if not yet stable
}

function speakIfNeeded(message, now) {
  if (now - lastFeedbackTime > 3000 && message !== lastSpokenFeedback) {
    speak(message);
  }
}
function checkIdleState() {
  const now = Date.now();
  // If more than 5 seconds have passed without movement, trigger the idle state message
  if (now - lastMovementTime > 3000) {
    // Check that the voice hasn't been spoken recently
    if (now - lastIdleVoiceTime > 8000) {
      currentFeedback = "Are you there? Keep moving!";
      speak(currentFeedback); // Speak the idle message
      lastIdleVoiceTime = now; // Update the last time the idle message was spoken
    }
  }
}
export function resetWorkoutState() {
  squatCounter = 0;
  pushupCounter = 0;
  squatDown = false;
  pushupDown = false;
  lastFeedbackTime = 0;
  lastPose = null;
  lastMovementTime = Date.now();
  lastIdleVoiceTime = Date.now();
  lastSpokenFeedback = '';
  currentFeedback = '';
  clearTimeout(feedbackDisplayTimeout);
}