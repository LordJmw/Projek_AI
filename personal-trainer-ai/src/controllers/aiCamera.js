import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

let detector;
let squatCounter = 0;
let pushupCounter = 0;
let squatDown = false;
let pushupDown = false;

// State variables
let lastFeedbackTime = 0;
let lastPose = null;
let lastMovementTime = Date.now();
let lastIdleVoiceTime = Date.now();
let badFormStartTime = null;
let currentFeedback = '';

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
  if (window.speechSynthesis) {
    const now = Date.now();
    if (now - lastFeedbackTime < 3000) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    lastFeedbackTime = now;
  }
}

export async function detectPose(videoElement, callback) {
  if (!detector || !videoElement || videoElement.readyState < 2) {
    return;
  }

  try {
    const poses = await detector.estimatePoses(videoElement);
    if (poses.length === 0 || !poses[0].keypoints) {
      checkIdleState();
      return callback({
        detected: 'None',
        squatCounter,
        pushupCounter,
        feedback: currentFeedback
      });
    }

    const keypoints = poses[0].keypoints;
    const now = Date.now();

    // Check for movement
    if (lastPose) {
      const movement = checkMovement(keypoints, lastPose.keypoints);
      if (movement > 2) {
        lastMovementTime = now;
      }
    }
    lastPose = poses[0];

    // Check for idle state
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
        feedback: currentFeedback
      });
    }

    // Analyze workout form
    const result = analyzeWorkoutForm(keypoints, now);
    currentFeedback = result.feedback;
    
    callback({
      detected: result.detected,
      squatCounter,
      pushupCounter,
      feedback: currentFeedback
    });

  } catch (error) {
    console.error("Pose detection error:", error);
    callback({
      detected: 'Error',
      squatCounter,
      pushupCounter,
      feedback: "Detection error occurred"
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

function analyzeWorkoutForm(keypoints, now) {
  const hip = keypoints[11];
  const knee = keypoints[13];
  const ankle = keypoints[15];
  const shoulder = keypoints[5];
  const elbow = keypoints[7];
  const wrist = keypoints[9];

  if (!hip || !knee || !ankle || !shoulder || !elbow || !wrist) {
    return { detected: 'None', feedback: '' };
  }

  const squatAngle = calculateAngle(hip, knee, ankle);
  const pushupAngle = calculateAngle(shoulder, elbow, wrist);

  let detected = 'None';
  let feedback = '';

  // Squat detection and feedback
  if (squatAngle < 90) {
    squatDown = true;
    if (squatAngle > 70) {
      feedback = "Lower your hips more for a proper squat";
      speakIfNeeded("Lower your hips more", now);
    }
  } else if (squatAngle > 160 && squatDown) {
    squatCounter++;
    squatDown = false;
    detected = 'Squat';
    feedback = "Good squat!";
  }

  // Push-up detection and feedback
  if (pushupAngle < 90) {
    pushupDown = true;
    if (pushupAngle > 70) {
      feedback = "Go lower in your push-up";
      speakIfNeeded("Go lower in your push-up", now);
    }
  } else if (pushupAngle > 160 && pushupDown) {
    pushupCounter++;
    pushupDown = false;
    detected = 'Push-Up';
    feedback = "Good push-up!";
  }

  return { detected, feedback };
}

function speakIfNeeded(message, now) {
  if (now - lastFeedbackTime > 3000) {
    speak(message);
  }
}

function checkIdleState() {
  const now = Date.now();
  if (now - lastMovementTime > 3000 && now - lastIdleVoiceTime > 8000) {
    currentFeedback = "Are you there? Keep moving!";
    speak(currentFeedback);
    lastIdleVoiceTime = now;
  }
}